const { InstanceBase, Regex, runEntrypoint, InstanceStatus, TCPHelper } = require('@companion-module/base')
const configFields = require('./src/configFields')
const getPresets = require('./src/presets')
const UpgradeScripts = require('./src/upgrades')
const getActions = require('./src/actions')
const getVariables = require('./src/variables')
const UpdateFeedbacks = require('./src/feedbacks')
const moduloPlayer = require('./src/moduloplayer')

let plCount = 0

class ModuloPlayerInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
		Object.assign(this, {
			...configFields,
			...moduloPlayer,
		})
	}
	// INIT MODULO PLAYER MODULE
	async init(config) {
		this.plCount = 0
		this.config = config
		this.moduloPlayerData = {
			tmpCueList: [],
			playList: [],
			cuesList: [],
			taskList: [],
			states: {},
		}
		this.updateStatus(InstanceStatus.Ok)
		this.updateActions() // export actions
		this.init_tcp()
	}

	// When module gets deleted
	async destroy() {
		if (this.retry_interval) clearInterval(this.retry_interval)
		if (this.polling_interval) clearInterval(this.polling_interval)
		this.socket.destroy()
		delete this.moduloplayer
		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		this.config = config
		let resetConnection = false

		if (this.config.host != config.host) {
			resetConnection = true
		}

		this.config = config
		if (resetConnection || !this.socket) {
			this.init_tcp()
		}

		this.updateVariableDefinitions()
		this.updateActions()
		this.updatePresets()
	}

	async sendCommand(cmd) {
		if (cmd !== undefined) {
			//this.log('info', `MODULO PLAYER | sending to ${this.config.host} Commande >>> ${cmd}`)
			if (this.socket !== undefined && this.socket.isConnected) {
				await this.socket.send(cmd + '\n')
			} else {
				this.log('error', 'Socket not connected :(')
			}
		}
	}

	GetUpgradeScripts() {
		return [UpgradeScripts]
	}

	updateActions() {
		this.setActionDefinitions(getActions(this))
	}

	updatePresets() {
		this.setPresetDefinitions(getPresets(this.moduloPlayerData))
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions() {
		this.setVariableDefinitions(getVariables(this.moduloPlayerData))
		this.getPlayListCueIndexFromModuloPlayer()
	}

	async getPlayListFromModuloPlayer() {
		await this.sendCommand('getallplaylistswithuuid')
	}

	async getPlayListCueIndexFromModuloPlayer() {
		this.moduloPlayerData.tmpCueList = []
		for (let i = 0; i < this.moduloPlayerData.playList.length; i++) {
			await this.sendCommand('getPlayListCueIndex?' + (i + 1))
		}
	}

	async getCuesListFromModuloPlayer() {
		this.moduloPlayerData.tmpCueList = []
		for (let i = 0; i < this.moduloPlayerData.playList.length; i++) {
			await this.sendCommand('getallcueswithuuid?' + (i + 1))
		}
	}

	async getTaskListModuloPlayer() {
		await this.sendCommand('getalltaskswithuuid')
	}

	/**
	 * Create pollers for fetching data from ModuloPlayer
	 */
	moduloPlayPoller() {
		if (this.config) {
			if (this.config.pollingInterval === 0) {
				if (this.polling_interval) clearInterval(this.polling_interval)
			} else {
				this.polling_interval = setInterval(() => {
					//this.log('warn', `MODULO PLAYER | MODULOPLAYER POLLER >>> ${this.config.pollingInterval}`)
					this.getTaskListModuloPlayer().then(() => {})
				}, Math.ceil(this.config.pollingInterval * 1000) || 5000)
			}
		}
	}

	init_tcp() {
		this.log('info', `MODULO PLAYER | INIT TCP CONTROL >>> ${this.config.host} ${28686}`)

		if (this.socket !== undefined) {
			this.socket.destroy()
			delete this.socket
		}

		if (this.config.port === undefined) {
			this.config.port = 28686
		}

		if (this.config.host) {
			//this.log('info', `MODULO PLAYER | TCP CONTROL | Opening connection to ${this.config.host}:${this.config.port}`)

			this.socket = new TCPHelper(this.config.host, this.config.port, { reconnect: true })

			this.socket.on('status_change', (status, message) => {
				this.updateStatus(status, message)
				//this.log('info', `MODULO PLAYER | TCP CONTROL | STATUS  UPDATE >>> ${status} | ${message}`)
			})

			this.socket.on('error', (err) => {
				this.updateStatus(InstanceStatus.UnknownError, err.message)
				this.log('error', 'MODULO PLAYER | TCP CONTROL | NETWORK ERROR: ' + err.message)
			})

			let receivebuffer = ''
			this.socket.on('connect', () => {
				this.updateStatus(InstanceStatus.Ok)
				this.log('info', 'MODULO PLAYER | TCP CONTROL | CONNECTED !')
				receivebuffer = ''
				this.moduloPlayPoller()
			})

			this.socket.on('data', (chunk) => {
				let i = 0
				let line = ''
				let offset = 0
				//this.log('info', 'TCP CONTROL | RECEIVE DATA >>> ' + chunk)
				receivebuffer += chunk.toString()
				// if (receivebuffer.indexOf('\n') === '\n') {
				while ((i = receivebuffer.indexOf('\n', offset)) !== -1) {
					line = receivebuffer.slice(offset, i)
					//this.log('error', 'RECEIVE DATA LINE >>> ' + line.toString())
					offset = i + 1
					this.socket.emit('receiveline', line)
				}
				// } else {
				// 	this.socket.emit('receiveline', chunk)
				// }
				receivebuffer = receivebuffer.slice(offset)
			})

			this.socket.on('receiveline', (data) => {
				let v = data.toString().slice(0, data.toString().lastIndexOf('?'))
				//this.log('warn', `TCP CONTROL | RECEIVE LINE >>> ${data.toString()}`)

				if (data.toString().slice(0, data.toString().lastIndexOf('?')) === 'alltaskswithuuid') {
					this.getAllTaskList(data)
					this.getPlayListFromModuloPlayer().then(() => {})
				}

				if (data.toString().slice(0, data.toString().lastIndexOf('?')) === 'allplaylistswithuuid') {
					this.getPlayList(data)
					this.getCuesListFromModuloPlayer().then(() => {})
				}

				if (data.toString().slice(0, 15) === 'allcueswithuuid') {
					this.getAllCuesList(data)
				}

				if (data.toString().slice(0, 16) === 'playListCueIndex') {
					//this.log('info' , 'RECEIVE PLAY LIST CUE INDEX >>>' + data.toString())
					this.setPlayListCurrentCueIndex(data, this)
				}

				if (data.toString() === 'RescanDone') {
					this.log('info', `TCP CONTROL | RescanDone`)
				}
			})

			this.socket.on('refresh', () => {
				//this.log('info', `TCP CONTROL | REFRESH !`)
				this.updateActions()
				this.updatePresets()
				this.updateVariableDefinitions()
				this.updateFeedbacks()
				this.plCount = 0
			})
		}
	}
}

runEntrypoint(ModuloPlayerInstance, UpgradeScripts)
