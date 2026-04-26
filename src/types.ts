// ============================================================
// RAW JSON DATA (responses from the ModuloPlayer API)
// ============================================================

/** A cue as returned by get.list.playlists level:cue */
export interface RawCue {
	uuid: string
	name: string
	uiColor: string
}

/** A playlist as returned by get.list.playlists */
export interface RawPlaylist {
	uuid: string
	name: string
	index: number
	grandMasterFader: number
	audioMaster: number
	cues: RawCue[]
}

/** A task as returned by get.list.tasks */
export interface RawTask {
	uuid: string
	name: string
	uiColor: string
}

/** Static information returned by Spydog */
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

/** Dynamic information returned by Spydog */
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
// INTERNAL DATA (structures used by Companion)
// ============================================================

/** Entry in the playlist dropdown (actions/presets) */
export interface DropdownPlaylistEntry {
	id: string
	label: string
	uuid: string
}

/**
 * Runtime state dictionary.
 * Values are string | number | boolean because Companion's setVariableValues
 * accepts CompanionVariableValue, and states are read with parseInt() in actions.
 */
export type StateValue = string | number | boolean

export interface StateMap {
	[key: string]: StateValue
}

// ============================================================
// WSCONNECTION CALLBACKS
// ============================================================

export type OnConnectedCallback = (isConnected: boolean) => void
export type OnMessageCallback = (data: string) => void
