import { MPinstance } from './main.js'
import {
	RPC_ID,
	msgGetTasks,
	msgGetPlaylistsCues,
	msgGetPlaylistsPlaylist,
	msgLaunchTask,
	msgGotoCue,
	msgPreloadCue,
	msgPlay,
	msgPause,
	msgNextCue,
	msgPrevCue,
	msgGrandMasterFader,
	msgAudioMaster,
	msgShowAction,
	type ShowAction,
} from './messages.js'
import type { RawPlaylist, RawTask } from './types.js'

interface RpcResponse {
	id: number
	result: unknown
}

export class ModuloPlayer {
	instance: MPinstance

	constructor(instance: MPinstance) {
		this.instance = instance
	}

	public messageManager(data: string): void {
		const datas = JSON.parse(data) as RpcResponse
		if (datas.id === RPC_ID.GET_TASKS) {
			this.tasksListManager(datas.result as RawTask[])
		} else if (datas.id === RPC_ID.LAUNCH_TASK) {
			// réponse ignorée
		} else if (datas.id === RPC_ID.GET_PLAYLISTS_CUES) {
			this.playListCuesManager(datas.result as RawPlaylist[])
		} else if (datas.id === RPC_ID.GET_PLAYLISTS_PLAYLIST) {
			this.setPlayListCurrentCueIndex(datas.result as RawPlaylist[])
			this.setGrandMasterFaderVariable(datas.result as RawPlaylist[])
			this.setAudioMasterVariable(datas.result as RawPlaylist[])
		} else if (datas.id === RPC_ID.GRAND_MASTER_FADER) {
			this.setGrandMasterFaderVariable(datas.result as RawPlaylist[])
		} else if (datas.id === RPC_ID.AUDIO_MASTER) {
			this.setAudioMasterVariable(datas.result as RawPlaylist[])
		}
	}

	// TASK LIST
	public tasksListManager(newList: RawTask[]): void {
		if (!Array.isArray(newList)) return
		if (!areJsonArraysEqual(this.instance.tasksList, newList)) {
			this.instance.tasksList = newList
			this.setDropDownTL(newList)
			this.instance.updateInstance()
		}
	}

	// ACTION DROPDOWN TASK ARRAY
	public setDropDownTL(tasks: RawTask[]): void {
		this.instance.dropdownTaskList = tasks.map((tl) => ({
			id: this.instance.cleanUUID(tl.uuid),
			label: tl.name,
			uuid: tl.uuid,
		}))
	}

	// PLAY LISTS CUES
	public playListCuesManager(newList: RawPlaylist[]): void {
		if (!Array.isArray(newList)) return
		if (!areJsonArraysEqual(this.instance.playLists, newList)) {
			this.instance.playLists = newList
			this.setDropDownPL(newList)
			this.instance.updateInstance()
			this.setGrandMasterFaderVariable(newList)
		}
	}

	// ACTION DROPDOWN PLAY LIST ARRAY
	public setDropDownPL(pls: RawPlaylist[]): void {
		this.instance.dropdownPlayList = pls.map((pl) => ({
			id: this.instance.cleanUUID(pl.uuid),
			label: pl.name,
			uuid: pl.uuid,
		}))
	}

	// SET PLAYLIST CURRENT CUE INDEX
	setPlayListCurrentCueIndex(pls: RawPlaylist[]): void {
		if (!Array.isArray(pls)) return
		for (const playlist of pls) {
			const uuid = this.instance.cleanUUID(playlist.uuid)
			const index = parseInt(String(playlist.index))
			const key = `pl_${uuid}_currentIndex`
			if (this.instance.states[key] === index) continue
			this.instance.states[key] = index
			this.instance.setVariableValues({ [key]: index })
			this.instance.checkFeedbacks(`current_Cue`)
		}
	}

	setGrandMasterFaderVariable(pls: RawPlaylist[]): void {
		if (!Array.isArray(pls)) return
		for (const playlist of pls) {
			const uuid = this.instance.cleanUUID(playlist.uuid)
			const grandMasterFader = (playlist.grandMasterFader * 100).toFixed(0)
			const key = `pl_${uuid}_grandMasterFader`
			if (this.instance.states[key] === grandMasterFader) continue
			this.instance.states[key] = grandMasterFader
			this.instance.setVariableValues({ [key]: grandMasterFader })
		}
	}

	setAudioMasterVariable(pls: RawPlaylist[]): void {
		if (!Array.isArray(pls)) return
		for (const playlist of pls) {
			const uuid = this.instance.cleanUUID(playlist.uuid)
			const audioMaster = (playlist.audioMaster * 100).toFixed(0)
			const key = `pl_${uuid}_audioMaster`
			if (this.instance.states[key] === audioMaster) continue
			this.instance.states[key] = audioMaster
			this.instance.setVariableValues({ [key]: audioMaster })
		}
	}

	// SEND ACTIONS

	sendCurrentCues(): void {
		this.instance.mpConnection.sendJsonMessage(msgGetPlaylistsPlaylist())
	}

	sendGotoCue(plUUID: string, cueID: number): void {
		this.instance.mpConnection.sendJsonMessage(msgGotoCue(plUUID, cueID))
		this.instance.states[`pl_${this.instance.cleanUUID(plUUID)}_currentIndex`] = cueID
		this.instance.checkFeedbacks(`current_Cue`)
	}

	sendPreloadCue(plUUID: string, cueID: number): void {
		this.instance.mpConnection.sendJsonMessage(msgPreloadCue(plUUID, cueID))
	}

	sendPlay(plUUID: string): void {
		this.instance.mpConnection.sendJsonMessage(msgPlay(plUUID))
	}

	sendPause(plUUID: string): void {
		this.instance.mpConnection.sendJsonMessage(msgPause(plUUID))
	}

	sendGrandMasterFader(plUUID: string, value: number, duration: number): void {
		this.instance.mpConnection.sendJsonMessage(msgGrandMasterFader(plUUID, value, duration))
	}

	sendAudioMaster(plUUID: string, value: number, duration: number): void {
		this.instance.mpConnection.sendJsonMessage(msgAudioMaster(plUUID, value, duration))
	}

	sendTaskListModuloPlayer(): void {
		this.instance.mpConnection.sendJsonMessage(msgGetTasks())
	}

	sendLaunchTask(uuid: string): void {
		this.instance.mpConnection.sendJsonMessage(msgLaunchTask(uuid))
	}

	sendPlaylistModuloPlayer(): void {
		this.instance.mpConnection.sendJsonMessage(msgGetPlaylistsCues())
	}

	sendNextCue(plUUID: string): void {
		this.instance.mpConnection.sendJsonMessage(msgNextCue(plUUID))
	}

	sendPrevCue(plUUID: string): void {
		this.instance.mpConnection.sendJsonMessage(msgPrevCue(plUUID))
	}

	sendShowSave(): void {
		this.instance.mpConnection.sendJsonMessage(msgShowAction('save' satisfies ShowAction))
	}

	sendShowbackup(): void {
		this.instance.mpConnection.sendJsonMessage(msgShowAction('backup' satisfies ShowAction))
	}

	sendShowRescanMedia(): void {
		this.instance.mpConnection.sendJsonMessage(msgShowAction('rescanmedia' satisfies ShowAction))
	}

	sendShowRemoveMissingMedia(): void {
		this.instance.mpConnection.sendJsonMessage(msgShowAction('removemissingmedia' satisfies ShowAction))
	}

	sendShowRescanMediaForce(): void {
		this.instance.mpConnection.sendJsonMessage(msgShowAction('rescanmediaforce' satisfies ShowAction))
	}

	sendShowSendShowToRemote(): void {
		this.instance.mpConnection.sendJsonMessage(msgShowAction('sendshowtoremote' satisfies ShowAction))
	}
}

function areJsonArraysEqual(a: unknown[], b: unknown[]): boolean {
	if (a.length !== b.length) return false
	for (let i = 0; i < a.length; i++) {
		if (JSON.stringify(a[i]) !== JSON.stringify(b[i])) return false
	}
	return true
}
