// ============================================================
// DONNÉES BRUTES JSON (réponses de l'API ModuloPlayer)
// ============================================================

/** Un cue tel que renvoyé par get.list.playlists level:cue */
export interface RawCue {
	uuid: string
	name: string
	uiColor: string
}

/** Une playlist telle que renvoyée par get.list.playlists */
export interface RawPlaylist {
	uuid: string
	name: string
	index: number
	grandMasterFader: number
	audioMaster: number
	cues: RawCue[]
}

/** Une tâche telle que renvoyée par get.list.tasks */
export interface RawTask {
	uuid: string
	name: string
	uiColor: string
}

/** Informations statiques renvoyées par Spydog */
export interface SpydogStaticInfo {
	CPU: string
	GpuBrand: string
	GpuDriver: string
	GpuName: string
	ModuloPlayer: string
	OS: string
	processorCount: number
	totalMemory: number
}

/** Informations dynamiques renvoyées par Spydog */
export interface SpydogDynamicInfo {
	clusterId: string
	color: string
	cpuTemperature: number
	cpuUse: number
	detacastTemperature: number
	fps: number
	fpsOk: boolean
	gpuTemperature: number
	lockStatus: number
	master: number
	maxAutocalibOutputs: number
	maxOutputs: number
	memoryUse: number
	motherboardTemperature: number
	serverIp: string
	serverName: string
	serverTime: string
	status: number
	upTime: number
}

// ============================================================
// DONNÉES INTERNES (structures utilisées par Companion)
// ============================================================

/** Entrée dans le dropdown des playlists (actions/presets) */
export interface DropdownPlaylistEntry {
	id: string
	label: string
	uuid: string
}

/**
 * Dictionnaire d'état runtime.
 * Les valeurs sont string | number | boolean car setVariableValues de Companion
 * accepte CompanionVariableValue, et les états sont lus avec parseInt() dans les actions.
 */
export type StateValue = string | number | boolean

export interface StateMap {
	[key: string]: StateValue
}

// ============================================================
// CALLBACKS WSCONNECTION
// ============================================================

export type OnConnectedCallback = (isConnected: boolean) => void
export type OnMessageCallback = (data: string) => void
