// ============================================================
// IDs JSON-RPC — constantes nommées
// ============================================================
export const RPC_ID = {
	GET_TASKS: 1,
	LAUNCH_TASK: 2,
	GET_PLAYLISTS_CUES: 3,
	GET_PLAYLISTS_PLAYLIST: 110, // aussi utilisé par goto/fader/audio
	GRAND_MASTER_FADER: 120,
	AUDIO_MASTER: 130,
	NO_RESPONSE: 0,
	SPYDOG_DYNAMIC_INFO: 200,
	SPYDOG_STATIC_INFO: 201,
} as const

// ============================================================
// TYPES D'ACTIONS
// ============================================================

export type ShowAction =
	| 'save'
	| 'backup'
	| 'rescanmedia'
	| 'removemissingmedia'
	| 'rescanmediaforce'
	| 'sendshowtoremote'

export type ComputerAction = 'startModuloPlayer' | 'stopModuloPlayer' | 'rebootComputer' | 'powerOffComputer'

// ============================================================
// BUILDERS MODULOPLAYER
// ============================================================

export function msgGetTasks(): string {
	return JSON.stringify({ jsonrpc: '2.0', method: 'get.list.tasks', id: RPC_ID.GET_TASKS })
}

export function msgGetPlaylistsCues(): string {
	return JSON.stringify({
		jsonrpc: '2.0',
		method: 'get.list.playlists',
		params: { level: 'cue' },
		id: RPC_ID.GET_PLAYLISTS_CUES,
	})
}

export function msgGetPlaylistsPlaylist(): string {
	return JSON.stringify({
		jsonrpc: '2.0',
		method: 'get.list.playlists',
		params: { level: 'playlist' },
		id: RPC_ID.GET_PLAYLISTS_PLAYLIST,
	})
}

export function msgLaunchTask(uuid: string): string {
	return JSON.stringify({
		jsonrpc: '2.0',
		method: 'doaction.task',
		params: { uuid, action: 'launch' },
		id: RPC_ID.LAUNCH_TASK,
	})
}

export function msgGotoCue(plUUID: string, cue: number): string {
	return JSON.stringify({
		jsonrpc: '2.0',
		method: 'doaction.playlist',
		params: { uuid: plUUID, action: 'goto', cue },
		id: RPC_ID.GET_PLAYLISTS_PLAYLIST,
	})
}

export function msgPreloadCue(plUUID: string, cue: number): string {
	return JSON.stringify({
		jsonrpc: '2.0',
		method: 'doaction.playlist',
		params: { uuid: plUUID, action: 'preload', cue },
		id: RPC_ID.NO_RESPONSE,
	})
}

export function msgPlay(plUUID: string): string {
	return JSON.stringify({
		jsonrpc: '2.0',
		method: 'doaction.playlist',
		params: { uuid: plUUID, action: 'play' },
		id: RPC_ID.NO_RESPONSE,
	})
}

export function msgPause(plUUID: string): string {
	return JSON.stringify({
		jsonrpc: '2.0',
		method: 'doaction.playlist',
		params: { uuid: plUUID, action: 'pause' },
		id: RPC_ID.NO_RESPONSE,
	})
}

export function msgNextCue(plUUID: string): string {
	return JSON.stringify({
		jsonrpc: '2.0',
		method: 'doaction.playlist',
		params: { uuid: plUUID, action: 'next' },
		id: RPC_ID.NO_RESPONSE,
	})
}

export function msgPrevCue(plUUID: string): string {
	return JSON.stringify({
		jsonrpc: '2.0',
		method: 'doaction.playlist',
		params: { uuid: plUUID, action: 'prev' },
		id: RPC_ID.NO_RESPONSE,
	})
}

export function msgGrandMasterFader(plUUID: string, value: number, duration: number): string {
	return JSON.stringify({
		jsonrpc: '2.0',
		method: 'doaction.playlist',
		params: { uuid: plUUID, action: 'grandMasterFader', value, duration },
		id: RPC_ID.GRAND_MASTER_FADER,
	})
}

export function msgAudioMaster(plUUID: string, value: number, duration: number): string {
	return JSON.stringify({
		jsonrpc: '2.0',
		method: 'doaction.playlist',
		params: { uuid: plUUID, action: 'audioMaster', value, duration },
		id: RPC_ID.AUDIO_MASTER,
	})
}

export function msgShowAction(action: ShowAction): string {
	return JSON.stringify({
		jsonrpc: '2.0',
		method: 'doaction.show',
		params: { action },
		id: RPC_ID.NO_RESPONSE,
	})
}

// ============================================================
// BUILDERS SPYDOG
// ============================================================

export function msgSpydogStaticInfo(): string {
	return JSON.stringify({ jsonrpc: '2.0', method: 'get.computer.static.info', id: RPC_ID.SPYDOG_STATIC_INFO })
}

export function msgSpydogDynamicInfo(): string {
	return JSON.stringify({ jsonrpc: '2.0', method: 'get.computer.dynamic.info', id: RPC_ID.SPYDOG_DYNAMIC_INFO })
}

export function msgComputerAction(action: ComputerAction): string {
	return JSON.stringify({
		jsonrpc: '2.0',
		method: 'doaction.computer',
		params: { action },
		id: RPC_ID.NO_RESPONSE,
	})
}
