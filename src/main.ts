import {
	InstanceBase,
	runEntrypoint,
	InstanceStatus,
	SomeCompanionConfigField,
	combineRgb,
} from '@companion-module/base'
import { GetConfigFields, type ModuloPlayConfig } from './configFields.js'
import { UpdateVariableDefinitions } from './variables.js'
import { InitVariableDefinitions } from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { getPresets } from './presets.js'

//import { getPresets } from './presets.js'

import { MPconnection } from './mpconnection.js'
import { SDconnection } from './sdconnection.js'
import { ModuloPlayer } from './moduloplayer.js'
import { SpyDog } from './spydog.js'

interface IStringIndex {
	[key: string]: any
}

export class MPinstance extends InstanceBase<ModuloPlayConfig> {
	config!: ModuloPlayConfig // Setup in init()
	/** reference to the connection with the device */
	public mpConnection!: MPconnection
	public sdConnection!: SDconnection
	public mpConnected = false
	public sdConnected = false

	moduloplayer: ModuloPlayer | undefined
	spydog: SpyDog | undefined

	public pollAPI: NodeJS.Timeout | null = null

	// MODULO PLAYER DATA
	public tasksList = []
	public playLists = []
	public states: IStringIndex = {}
	public dropdownPlayList = []
	public dynamicInfo = {}
	public staticInfo = {}

	// COLORS
	public grayModuloPlayer: number = 2763306
	public orangeModuloPlayer: number = 16753920
	public greenModuloPlayer: number = 5818647
	public redModuloPlayer: number = 16711680

	// CONTRUCTOR
	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuloPlayConfig): Promise<void> {
		this.mpConnection = new MPconnection(this)
		this.sdConnection = new SDconnection(this)
		this.moduloplayer = new ModuloPlayer(this)
		this.spydog = new SpyDog(this)
		await this.configUpdated(config)

		this.updateInstance()
	}

	// When module gets deleted
	async destroy(): Promise<void> {
		this.mpConnection.destroy()
		this.sdConnection.destroy()
		this.log('debug', 'destroy')
	}

	async configUpdated(config: ModuloPlayConfig): Promise<void> {
		this.updateStatus(InstanceStatus.Disconnected, 'Update')
		this.config = config
		this.mpConnection.disconnect()
		this.sdConnection.disconnect()
		this.updateStatus(InstanceStatus.Connecting, `Init Connection`)
		await this.mpConnection.connect(this.config.host, this.config.mpPort)
		if (this.config.sdEnable) {
			await this.sdConnection.connect(this.config.host, this.config.sdPort)
		}
	}

	async isConnected() {
		if (this.mpConnected && this.sdConnected) {
			this.updateStatus(InstanceStatus.Ok, `Connected`)
			if (this.mpConnected) this.moduloplayer?.getTaskListModuloPlayer()
			if (this.mpConnected) this.moduloplayer?.getPlaylistModuloPlayer()
			if (this.sdConnected) this.spydog?.getStaticInfo()
			if (this.sdConnected) this.spydog?.getDynamicInfo()
		} else if (!this.mpConnected && this.sdConnected) {
			this.updateStatus(InstanceStatus.Ok, `Spydog Online | Modulo Player Offline`)
			if (this.sdConnected) this.spydog?.getStaticInfo()
			if (this.sdConnected) this.spydog?.getDynamicInfo()
		} else if (this.mpConnected && !this.sdConnected) {
			this.updateStatus(InstanceStatus.Ok, `Modulo Player Online | Spydog Offline`)
			if (this.mpConnected) this.moduloplayer?.getTaskListModuloPlayer()
			if (this.mpConnected) this.moduloplayer?.getPlaylistModuloPlayer()
		} else {
			this.updateStatus(InstanceStatus.Connecting, `Init Connection`)
		}
	}

	async updateInstance() {
		this.setPresetDefinitions(getPresets(this))
		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions()
	}

	updatPolling() {
		if (this.mpConnected) this.moduloplayer?.getPlaylistsCurrentCues()
		if (this.mpConnected) this.moduloplayer?.getTaskListModuloPlayer()
		if (this.mpConnected) this.moduloplayer?.getPlaylistModuloPlayer()
		if (this.sdConnected) this.spydog?.getDynamicInfo()
	}

	// Return config fields for web config
	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	updateActions(): void {
		UpdateActions(this)
	}

	updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
		InitVariableDefinitions(this)
	}

	cleanUUID(uuid: String) {
		return uuid.replaceAll('{', '').replaceAll('}', '')
	}

	cleanName(name: String) {
		return name.replaceAll(' ', '-')
	}

	getCombineRGBFromHex(colorHex: any) {
		//this.log('debug', `MAIN | GET COMBINE RGB ${colorHex}`)
		if (colorHex === undefined || colorHex === null) return
		let rgb = this.getColorFromHex(colorHex)
		return combineRgb(rgb[0], rgb[1], rgb[2])
	}

	getColorFromHex(colorHex: any) {
		let couleurRgb = [0, 0, 0]
		if (colorHex !== '') {
			couleurRgb = this.hexToRgb(`${colorHex}`)
		}
		return couleurRgb
	}

	hexToRgb(hex: any) {
		const normal = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)
		if (normal) return normal.slice(1).map((e: string) => parseInt(e, 16))

		const shorthand = hex.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i)
		if (shorthand) return shorthand.slice(1).map((e: string) => 0x11 * parseInt(e, 16))

		return null
	}

	public readonly initPolling = (): void => {
		//this.instance.log('warn', `CONNECTION| INIT POLLING >>> ${this.pollAPI}`)
		if (this.pollAPI !== undefined && this.pollAPI !== null) {
			clearInterval(this.pollAPI)
		}

		const pollAPI = () => {
			//if (this.websocket?.readyState == 1) {
			this.updatPolling()
			//}
		}

		pollAPI()

		// Check if API Polling is disabled
		if (this.config.pollInterval != 0) {
			const pollInterval = this.config.pollInterval < 100 ? 100 : this.config.pollInterval
			this.pollAPI = setInterval(pollAPI, pollInterval)
		}
	}
}

runEntrypoint(MPinstance, UpgradeScripts)
