import { MPinstance } from './main.js'
//import { InstanceStatus } from '@companion-module/base'

import WebSocket from 'ws'

export class MPconnection {
	instance: MPinstance
	private websocket: WebSocket | undefined | null
	private wsTimeout: NodeJS.Timeout | undefined
	private mpAddr: string | undefined
	private mpPort: any | undefined | null
	private readonly reconnectmin = 100
	private readonly reconnectmax = 16_500
	private reconnectinterval = this.reconnectmin
	private shouldBeConnected: boolean

	//private pollAPI: NodeJS.Timeout | undefined

	constructor(instance: MPinstance) {
		this.instance = instance
		this.shouldBeConnected = false
	}

	async connect(addr: string | undefined, port: any): Promise<void> {
		this.mpAddr = addr
		this.mpPort = port
		//this.instance!.log('debug', `WEBSOCKET MP CONNECT ${this.mpAddr} ${this.mpPort}`)
		if (this.mpAddr === undefined || this.mpPort == undefined) return
		this.shouldBeConnected = true

		const urlObj = `ws://${this.mpAddr}:${this.mpPort}`
		if (urlObj === null) return

		try {
			const setupMP = async () => {
				this.websocket = new WebSocket(urlObj)

				this.websocket.on('open', async () => {
					this.reconnectinterval = this.reconnectmin
					this.instance!.log('info', 'WEBSOCKET MP OPENED ' + this.websocket?.readyState)
					this.instance.mpConnected = true
					this.instance.isConnected()
					this.instance.initPolling()
				})

				this.websocket.on('close', (ev: { toString: () => any }) => {
					console.log(
						'ws closed',
						ev.toString(),
						this.shouldBeConnected ? 'should be connected' : 'should not be connected',
					)
					if (this.shouldBeConnected) {
						//this.instance.updateStatus(InstanceStatus.Disconnected)
						this.instance.isConnected()
						if (this.wsTimeout) clearTimeout(this.wsTimeout)
						this.wsTimeout = setTimeout(() => {
							this.connect(this.mpAddr, this.mpPort)
						}, this.reconnectinterval)
						this.reconnectinterval *= 1.2
						if (this.reconnectinterval > this.reconnectmax) this.reconnectinterval = this.reconnectmax
					}
				})

				this.websocket.on('error', (error: string) => {
					this.instance.log('error', 'Socket ' + error)
					this.instance.log('warn', 'Check if Modulo Player is started ?')
					//this.instance.updateStatus(InstanceStatus.ConnectionFailure)
				})

				this.websocket.on('message', (data: { toString: () => string }) => {
					//console.log('debug', 'incoming MP message ' + data.toString())
					this.instance.moduloplayer?.messageManager(data.toString())
				})
			}

			await setupMP()
		} catch (error) {
			this.disconnect()
			if (this.wsTimeout) clearTimeout(this.wsTimeout)
			this.wsTimeout = setTimeout(() => {
				this.connect(this.mpAddr, this.mpPort)
			}, this.reconnectinterval)
			this.reconnectinterval *= 1.2
			if (this.reconnectinterval > this.reconnectmax) this.reconnectinterval = this.reconnectmax
		}
	}

	sendMessage(method: string, id: any): void {
		if (this.websocket?.readyState === 1) {
			var m = `{"jsonrpc":"2.0","method":"${method}","id": ${id}}`
			this.websocket?.send(m)
			//this.instance.log('debug', 'SENDING WS MESSAGE ' + this.websocket.url + ' ' + m)
		}
	}

	sendMessageLunchTask(uuid: any, id: any): void {
		if (this.websocket?.readyState === 1) {
			var m = `{"jsonrpc":"2.0","method":"doaction.task", "params": {
            "uuid": "${uuid}",
            "action": "launch"
            },"id": ${id}}`
			this.websocket?.send(m)
			//this.instance.log('debug', 'SENDING WS MESSAGE LAUNCH TASK ' + this.websocket.url + ' ' + m)
		}
	}

	sendJsonMessage(message: String) {
		if (this.websocket?.readyState === 1 && message !== '') {
			this.websocket?.send(message)
			this.instance.log('debug', 'SENDING WS MESSAGE LAUNCH TASK ' + this.websocket.url + ' ' + message)
		}
	}

	sendMessagePlaylistsCues(): void {
		if (this.websocket?.readyState === 1) {
			var m = `{"jsonrpc":"2.0","method":"get.list.playlists",
            "params": {
            "level": "cue"},
            "id": 3}`
			this.websocket?.send(m)
			//this.instance.log('debug', 'SENDING WS MESSAGE GET PLAYLISTS CUES ' + this.websocket.url + ' ' + m)
		}
	}

	disconnect(): void {
		clearTimeout(this.wsTimeout)
		// if (this.pollAPI !== undefined) {
		// 	clearInterval(this.pollAPI)
		// }
		this.shouldBeConnected = false
		this.websocket?.close()
		this.instance.mpConnected = false
		this.instance.isConnected()
	}

	destroy(): void {
		clearTimeout(this.wsTimeout)
		// if (this.pollAPI !== undefined) {
		// 	clearInterval(this.pollAPI)
		// }
		this.shouldBeConnected = false
		this.websocket = null
		this.instance.mpConnected = false
		this.instance.isConnected()
		this.instance!.log('debug', 'Connection has been destroyed due to removal or disable by user')
	}

	// public readonly initPolling = (): void => {
	// 	//this.instance.log('warn', `CONNECTION| INIT POLLING >>> ${this.pollAPI}`)
	// 	if (this.pollAPI !== undefined) {
	// 		clearInterval(this.pollAPI)
	// 	}

	// 	const pollAPI = () => {
	// 		if (this.websocket?.readyState == 1) {
	// 			this.instance.updatPolling()
	// 		}
	// 	}

	// 	pollAPI()

	// 	// Check if API Polling is disabled
	// 	if (this.instance.config.pollInterval != 0) {
	// 		const pollInterval = this.instance.config.pollInterval < 100 ? 100 : this.instance.config.pollInterval
	// 		this.pollAPI = setInterval(pollAPI, pollInterval)
	// 	}
	// }
}
