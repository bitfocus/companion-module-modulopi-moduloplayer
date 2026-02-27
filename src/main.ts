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

import { WSConnection } from './wsconnection.js'
import { ModuloPlayer } from './moduloplayer.js'
import { SpyDog } from './spydog.js'
import type {
	RawTask,
	RawPlaylist,
	DropdownPlaylistEntry,
	StateMap,
	SpydogStaticInfo,
	SpydogDynamicInfo,
} from './types.js'

export class MPinstance extends InstanceBase<ModuloPlayConfig> {
	config!: ModuloPlayConfig // Setup in init()
	public mpConnection!: WSConnection
	public sdConnection!: WSConnection
	public mpConnected = false
	public sdConnected = false

	moduloplayer: ModuloPlayer | undefined
	spydog: SpyDog | undefined

	public pollAPI: NodeJS.Timeout | null = null

	// MODULO PLAYER DATA
	public tasksList: RawTask[] = []
	public playLists: RawPlaylist[] = []
	public states: StateMap = {}
	public dropdownPlayList: DropdownPlaylistEntry[] = []
	public dropdownTaskList: DropdownPlaylistEntry[] = []
	public dynamicInfo: Partial<SpydogDynamicInfo> = {}
	public staticInfo: Partial<SpydogStaticInfo> = {}

	// Snapshot structurel pour éviter les updateInstance() inutiles
	private _lastStructuralHash: string | null = null

	// COLORS
	public grayModuloPlayer: number = 2763306
	public orangeModuloPlayer: number = 16753920
	public greenModuloPlayer: number = 5818647
	public redModuloPlayer: number = 16711680

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuloPlayConfig): Promise<void> {
		this.moduloplayer = new ModuloPlayer(this)
		this.spydog = new SpyDog(this)

		this.mpConnection = new WSConnection(
			this,
			'ModuloPlayer',
			(connected) => {
				this.mpConnected = connected
				void this.isConnected()
				if (connected) this.initPolling()
			},
			(data) => this.moduloplayer?.messageManager(data),
		)
		this.sdConnection = new WSConnection(
			this,
			'Spydog',
			(connected) => {
				this.sdConnected = connected
				void this.isConnected()
				this.updateInstance()
			},
			(data) => this.spydog?.messageManager(data),
		)

		await this.configUpdated(config)
		this.updateInstance()
	}

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
		this.updateStatus(InstanceStatus.Connecting, `Init Connection, Start Modulo Player`)
		await this.mpConnection.connect(this.config.host, this.config.mpPort)
		if (this.config.sdEnable) {
			await this.sdConnection.connect(this.config.host, this.config.sdPort)
		}
	}

	async isConnected(): Promise<void> {
		this.log('info', `IS CONNECTED ? >>> PLAYER: ${this.mpConnected} | SPYDOG: ${this.sdConnected}`)
		if (this.config.sdEnable) {
			if (this.mpConnected && this.sdConnected) {
				this.updateStatus(InstanceStatus.Ok, `Connected`)
				this.moduloplayer?.sendTaskListModuloPlayer()
				this.moduloplayer?.sendPlaylistModuloPlayer()
				this.spydog?.sendStaticInfo()
				this.spydog?.sendDynamicInfo()
			} else if (!this.mpConnected && this.sdConnected) {
				this.updateStatus(InstanceStatus.Connecting, `Modulo Player Offline | Spydog Online `)
				this.spydog?.sendStaticInfo()
				this.spydog?.sendDynamicInfo()
			} else if (this.mpConnected && !this.sdConnected) {
				this.updateStatus(InstanceStatus.Connecting, `Modulo Player Online | Spydog Offline`)
				this.moduloplayer?.sendTaskListModuloPlayer()
				this.moduloplayer?.sendPlaylistModuloPlayer()
			} else {
				this.updateStatus(InstanceStatus.ConnectionFailure, `Start Modulo Player or Check IP Address`)
			}
		} else {
			if (this.mpConnected) {
				this.updateStatus(InstanceStatus.Ok, `Connected`)
				this.moduloplayer?.sendTaskListModuloPlayer()
				this.moduloplayer?.sendPlaylistModuloPlayer()
			} else {
				this.updateStatus(InstanceStatus.ConnectionFailure, `Start Modulo Player or Check IP Address`)
			}
		}
	}

	updateInstance(): void {
		// Hash structurel uniquement : UUIDs, noms, couleurs, sdConnected
		// Les champs dynamiques (currentIndex, grandMasterFader, audioMaster) sont exclus
		// pour éviter un re-enregistrement à chaque poll
		const structHash = JSON.stringify({
			sdConnected: this.sdConnected,
			tasks: this.tasksList.map((t) => ({ uuid: t.uuid, name: t.name, uiColor: t.uiColor })),
			playlists: this.playLists.map((pl) => ({
				uuid: pl.uuid,
				name: pl.name,
				cues: pl.cues.map((c) => ({ uuid: c.uuid, name: c.name, uiColor: c.uiColor })),
			})),
		})

		if (structHash === this._lastStructuralHash) return
		this._lastStructuralHash = structHash

		this.setPresetDefinitions(getPresets(this))
		this.updateActions()
		this.updateFeedbacks()
		this.updateVariableDefinitions()
		this.checkFeedbacks(`color_cue`)
		this.checkFeedbacks(`color_task`)
	}

	updatePolling(): void {
		if (this.mpConnected) this.moduloplayer?.sendCurrentCues()
		if (this.mpConnected) this.moduloplayer?.sendTaskListModuloPlayer()
		if (this.mpConnected) this.moduloplayer?.sendPlaylistModuloPlayer()
		if (this.sdConnected) this.spydog?.sendDynamicInfo()
	}

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

	cleanUUID(uuid: string): string {
		return uuid.replaceAll('{', '').replaceAll('}', '')
	}

	cleanName(name: string): string {
		return name.replaceAll(' ', '-')
	}

	getCombineRGBFromHex(colorHex: string | undefined | null): number | undefined {
		if (colorHex === undefined || colorHex === null) return undefined
		const rgb = this.getColorFromHex(colorHex)
		if (rgb === null) return undefined
		return combineRgb(rgb[0], rgb[1], rgb[2])
	}

	getColorFromHex(colorHex: string): [number, number, number] | null {
		if (colorHex === '') return [0, 0, 0]
		return this.hexToRgb(colorHex)
	}

	hexToRgb(hex: string): [number, number, number] | null {
		const normal = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)
		if (normal) return normal.slice(1).map((e) => parseInt(e, 16)) as [number, number, number]

		const shorthand = hex.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i)
		if (shorthand) return shorthand.slice(1).map((e) => 0x11 * parseInt(e, 16)) as [number, number, number]

		return null
	}

	public readonly initPolling = (): void => {
		if (this.pollAPI !== undefined && this.pollAPI !== null) {
			clearInterval(this.pollAPI)
		}

		const tick = (): void => {
			this.updatePolling()
		}

		tick()

		if (this.config.pollInterval !== 0) {
			const pollInterval = this.config.pollInterval < 100 ? 100 : this.config.pollInterval
			this.pollAPI = setInterval(tick, pollInterval)
		}
	}
}

runEntrypoint(MPinstance, UpgradeScripts)
