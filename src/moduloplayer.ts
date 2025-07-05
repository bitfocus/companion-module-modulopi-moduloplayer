import { MPinstance } from './main.js'
//import { getPresets } from './presets.js'

// JSON ID
// 1 = list Tasks,
// 2 = Launch Task,
// 3 = list Playlist

// 100 =
// 110 = ACTION GOTO
// 120 = GRAND MASTER FADER
// 130 = AUDIO MASTER

export class ModuloPlayer {
	instance: MPinstance

	constructor(instance: MPinstance) {
		this.instance = instance
	}

	public messageManager(data: String): void {
		const datas = JSON.parse(data.toString())
		//this.instance.log('warn', 'MODULO PLAYER | MESSAGE MANAGER | DATA ID >>> ' + datas['id'])
		if (datas['id'] == 1) {
			//console.log('debug', 'MODULO PLAYER | MESSAGE MANAGER | DATA >>> ' + data.toString())
			this.tasksListManager(datas['result'])
		} else if (datas['id'] == 2) {
			//console.log('debug', 'MODULO PLAYER | MESSAGE MANAGER | LAUNCH TASK | DATA >>> ' + data.toString())
			//this.playListCuesManager(datas['result'])
		} else if (datas['id'] == 3) {
			//console.log('debug', 'MODULO PLAYER | MESSAGE MANAGER | DATA >>> ' + data.toString())
			this.playListCuesManager(datas['result'])
		} else if (datas['id'] == 110) {
			//console.log('debug', 'MODULO PLAYER | MESSAGE MANAGER | DATA >>> ' + data.toString())
			this.setPlayListCurrentCueIndex(datas['result'])
			this.setGrandMasterFaderVariable(datas['result'])
			this.setAudioMasterVariable(datas['result'])
		} else if (datas['id'] == 120) {
			//this.instance.log('info', 'MODULO PLAYER | MESSAGE MANAGER| GRAND MASTER | DATA >>> ' + data.toString())
			this.setGrandMasterFaderVariable(datas['result'])
		} else if (datas['id'] == 130) {
			//this.instance.log('info', 'MODULO PLAYER | MESSAGE MANAGER| GRAND MASTER | DATA >>> ' + data.toString())
			this.setAudioMasterVariable(datas['result'])
		}
	}

	// TASK LIST
	public tasksListManager(obj: any): void {
		const tlInstance: any[] = this.instance.tasksList
		const tlNew: any[] = obj
		const checkTL = areJsonArraysEqual(tlInstance, tlNew)
		if (!checkTL) {
			this.instance.tasksList = obj
			this.instance.updateInstance()
		}
	}

	// PLAY LISTS CUES
	public playListCuesManager(obj: any): void {
		const plInstance: any[] = this.instance.playLists
		const plNew: any[] = obj
		const checkPL = areJsonArraysEqual(plInstance, plNew)
		if (!checkPL) {
			this.instance.playLists = obj
			this.setDropDownPL(obj)
			this.instance.updateInstance()
			this.setGrandMasterFaderVariable(obj)
		}
	}

	// ACTION DROPDOWN PLAY LIST ARRAY
	public setDropDownPL(pls: any) {
		let plsa: any = []
		for (let pl = 0; pl < pls.length; pl++) {
			const obj = { id: `${pl}`, label: `${pls[pl]['name']}`, uuid: `${pls[pl]['uuid']}` }
			plsa.push(obj)
		}
		this.instance.dropdownPlayList = plsa
	}

	// SET PLAYLIST CURRENT CUE INDEX
	async setPlayListCurrentCueIndex(obj: any) {
		const pls: any[] = obj
		for (let playlist = 0; playlist < pls.length; playlist++) {
			let uuid: String = this.instance.cleanUUID(pls[playlist]['uuid'])
			var obj: any = {
				[`pl_${uuid}_currentIndex`]: parseInt(pls[playlist]['index']),
			}
			this.instance.states[`pl_${uuid}_currentIndex`] = parseInt(pls[playlist]['index'])
			this.instance.setVariableValues(obj)
			this.instance.checkFeedbacks(`current_Cue`)
		}
	}

	async setGrandMasterFaderVariable(obj: any) {
		const pls: any[] = obj
		for (let playlist = 0; playlist < pls.length; playlist++) {
			let uuid: String = this.instance.cleanUUID(pls[playlist]['uuid'])
			// this.instance.log('warn', `MODULO PLAYER | GET GRAND MASTER FADER >>> ${uuid} >>> ${pls[playlist]['grandMasterFader']}`)
			let grandMasterFader = (pls[playlist]['grandMasterFader'] * 100).toFixed(0)
			var obj: any = {
				[`pl_${uuid}_grandMasterFader`]: grandMasterFader,
			}
			this.instance.states[`pl_${uuid}_grandMasterFader`] = grandMasterFader
			this.instance.setVariableValues(obj)
			// this.instance.checkFeedbacks()
		}
	}

	async setAudioMasterVariable(obj: any) {
		const pls: any[] = obj
		for (let playlist = 0; playlist < pls.length; playlist++) {
			let uuid: String = this.instance.cleanUUID(pls[playlist]['uuid'])
			let audioMaster = (pls[playlist]['audioMaster'] * 100).toFixed(0)
			var obj: any = {
				[`pl_${uuid}_audioMaster`]: audioMaster,
			}
			this.instance.states[`pl_${uuid}_audioMaster`] = audioMaster
			this.instance.setVariableValues(obj)
		}
	}

	// SEND ACTIONS

	// GET CURRENT CUE INDEX
	async sendCurrentCues() {
		var m = `{"jsonrpc":"2.0","method":"get.list.playlists",
            "params": {
            "level": "playlist"},
            "id": 110}`
		this.instance.mpConnection.sendJsonMessage(m)
	}

	async sendGotoCue(plUUID: any, cueID: any) {
		var m = `{
			"jsonrpc": "2.0",
			"method": "doaction.playlist",
			"params": {
			"uuid": "${plUUID}",
			"action": "goto",
			"cue": ${cueID}
			},
			"id": 110
		}`
		this.instance.mpConnection.sendJsonMessage(m)
		this.instance.states[`pl_${this.instance.cleanUUID(plUUID)}_currentIndex`] = cueID
		this.instance.checkFeedbacks(`current_Cue`)
	}

	async sendPreloadCue(plUUID: any, cueID: any) {
		var m = `{
			"jsonrpc": "2.0",
			"method": "doaction.playlist",
			"params": {
			"uuid": "${plUUID}",
			"action": "preload",
			"cue": ${cueID}
			},
			"id": 0
		}`
		this.instance.mpConnection.sendJsonMessage(m)
	}

	async sendPlay(plUUID: any) {
		var m = `{
			"jsonrpc": "2.0",
			"method": "doaction.playlist",
			"params": {
			"uuid": "${plUUID}",
			"action": "play"
			},
			"id": 0
		}`
		this.instance.mpConnection.sendJsonMessage(m)
	}

	async sendPause(plUUID: any) {
		var m = `{
			"jsonrpc": "2.0",
			"method": "doaction.playlist",
			"params": {
			"uuid": "${plUUID}",
			"action": "pause"
			},
			"id": 0
		}`
		this.instance.mpConnection.sendJsonMessage(m)
	}

	async sendGrandMasterFader(_pl: any, _value: any, _duration: any) {
		var m = `{"jsonrpc":"2.0","method":"doaction.playlist",
			"params": {
            "uuid": "${_pl}",
            "action": "grandMasterFader",
			"value": ${_value},
			"duration": ${_duration}
            },"id": 120}`
		this.instance.mpConnection.sendJsonMessage(m)
	}

	async sendAudioMaster(_pl: any, _value: any, _duration: any) {
		var m = `{"jsonrpc":"2.0","method":"doaction.playlist",
			"params": {
            "uuid": "${_pl}",
            "action": "audioMaster",
			"value": ${_value},
			"duration": ${_duration}
            },"id": 130}`
		this.instance.mpConnection.sendJsonMessage(m)
	}

	async sendTaskListModuloPlayer() {
		var m = `{"jsonrpc":"2.0","method":"get.list.tasks","id": 1}`
		//this.instance.log('info', 'GET TASKS LIST')
		this.instance.mpConnection.sendJsonMessage(m)
	}

	async sendLaunchTask(uuid: any) {
		var m = `{"jsonrpc":"2.0","method":"doaction.task", "params": {
            "uuid": "${uuid}",
            "action": "launch"
            },"id": 2}`
		//this.instance.log('debug', 'SENDING WS MESSAGE LAUNCH TASK ' + this.websocket.url + ' ' + m)
		this.instance.mpConnection.sendJsonMessage(m)
	}

	async sendPlaylistModuloPlayer() {
		var m = `{"jsonrpc":"2.0","method":"get.list.playlists",
            "params": {
            "level": "cue"},
            "id": 3}`
		this.instance.mpConnection.sendJsonMessage(m)
	}

	async sendNextCue(plUUDI: any) {
		var m = `{"jsonrpc": "2.0", "method": "doaction.playlist",
				"params": {
				"uuid": "${plUUDI}",
				"action": "next"
			},"id": 0}`
		this.instance.mpConnection.sendJsonMessage(m)
	}

	async sendPrevCue(plUUDI: any) {
		var m = `{"jsonrpc": "2.0", "method": "doaction.playlist",
				"params": {
				"uuid": "${plUUDI}",
				"action": "prev"
			},"id": 0}`
		this.instance.mpConnection.sendJsonMessage(m)
	}

	// SHOW FONCTIONS
	// SAVE
	async sendShowSave() {
		var m = `{"jsonrpc": "2.0", "method": "doaction.show", "params": {"action": "save"}, "id": 0}`
		this.instance.mpConnection.sendJsonMessage(m)
	}

	// BACKUP
	async sendShowbackup() {
		var m = `{"jsonrpc": "2.0", "method": "doaction.show", "params": {"action": "backup"}, "id": 0}`
		this.instance.mpConnection.sendJsonMessage(m)
	}

	// RESCAN MEDIAS
	async sendShowRescanMedia() {
		var m = `{"jsonrpc": "2.0", "method": "doaction.show", "params": {"action": "rescanmedia"}, "id": 0}`
		this.instance.mpConnection.sendJsonMessage(m)
	}

	// REMOVE MISSING MEDIAS
	async sendShowRemoveMissingMedia() {
		var m = `{"jsonrpc": "2.0", "method": "doaction.show", "params": {"action": "removemissingmedia"}, "id": 0}`
		this.instance.mpConnection.sendJsonMessage(m)
	}

	// RESCAN MEDIAS FORCE
	async sendShowRescanMediaForce() {
		var m = `{"jsonrpc": "2.0", "method": "doaction.show", "params": {"action": "rescanmediaforce"}, "id": 0}`
		this.instance.mpConnection.sendJsonMessage(m)
	}

	// SEND SHOW TO ALL REMOTES
	async sendShowSendShowToRemote() {
		var m = `{"jsonrpc": "2.0", "method": "doaction.show", "params": {"action": "sendshowtoremote"}, "id": 0}`
		this.instance.mpConnection.sendJsonMessage(m)
	}
}

function areJsonArraysEqual(a: any[], b: any[]): boolean {
	if (a.length !== b.length) return false
	for (let i = 0; i < a.length; i++) {
		if (JSON.stringify(a[i]) !== JSON.stringify(b[i])) {
			return false
		}
	}
	return true
}
