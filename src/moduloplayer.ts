import { MPinstance } from './main.js'
//import { getPresets } from './presets.js'

// JSON ID
// 1 = list Tasks,
// 2 = Launch Task,
// 3 = list Playlist

// 100 = CURRENT CUE LIST
// 110 = ACTION GOTO

export class ModuloPlayer {
	instance: MPinstance

	constructor(instance: MPinstance) {
		this.instance = instance
	}

	public messageManager(data: String): void {
		const datas = JSON.parse(data.toString())
		//this.instance.log('debug', 'MODULO PLAYER | MESSAGE MANAGER | DATA ID >>> ' + datas['id'])
		if (datas['id'] == 1) {
			//console.log('debug', 'MODULO PLAYER | MESSAGE MANAGER | DATA >>> ' + data.toString())
			this.tasksListManager(datas['result'])
		} else if (datas['id'] == 3) {
			//console.log('debug', 'MODULO PLAYER | MESSAGE MANAGER | DATA >>> ' + data.toString())
			this.playListCuesManager(datas['result'])
		} else if (datas['id'] == 100) {
			//console.log('debug', 'MODULO PLAYER | MESSAGE MANAGER | DATA >>> ' + data.toString())
			this.setPlayListCurrentCueIndex(datas['result'])
		}
	}

	// TASK LIST
	public tasksListManager(obj: any): void {
		const tlInstance: any[] = this.instance.tasksList
		const tlNew: any[] = obj
		const checkTL = areJsonArraysEqual(tlInstance, tlNew)
		//this.instance.log('debug', `MODULO PLAYER | CHECK TL >>> ${checkTL}`)
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
		//this.instance.log('debug', `MODULO PLAYER | CHECK PL >>> ${checkPL}`)
		if (!checkPL) {
			this.instance.playLists = obj
			this.setDropDownPL(obj)
			this.instance.updateInstance()
		}
	}

	public setDropDownPL(pls: any) {
		let plsa: any = []
		for (let pl = 0; pl < pls.length; pl++) {
			// this.instance.log('info', `MODULO PLAYER | GET DROPDOWN >>> ${pl}`)
			const obj = { id: `${pl}`, label: `${pls[pl]['name']}`, uuid: `${pls[pl]['uuid']}` }
			plsa.push(obj)
		}
		this.instance.dropdownPlayList = plsa
		// this.instance.log('warn', `MODULO PLAYER | GET DROPDOWN 1 >>>  ${JSON.stringify(this.instance.dropdownPlayList)}`)
	}

	// GET CURRENT CUE INDEX
	async getPlaylistsCurrentCues() {
		// this.instance.log('info', `MODULO PLAYER | GET PLAYLISTS CURRENT CUE !`)
		this.instance.mpConnection?.sendMessage('get.list.playlists', 100)
	}

	async setPlayListCurrentCueIndex(obj: any) {
		const pls: any[] = obj
		for (let playlist = 0; playlist < pls.length; playlist++) {
			let uuid: String = this.instance.cleanUUID(pls[playlist]['uuid'])
			// this.instance.log('warn', `MODULO PLAYER | GET CURRENT INDEX >>> ${uuid} >>> ${pls[playlist]['index']} >>> ${pls[playlist]['grandMasterFader']}`)
			let grandMasterFader = (pls[playlist]['grandMasterFader'] * 100).toFixed(0)
			var obj: any = {
				[`pl_${uuid}_currentIndex`]: parseInt(pls[playlist]['index']),
				[`pl_${uuid}_grandMasterFader`]: grandMasterFader,
			}
			this.instance.states[`pl_${uuid}_currentIndex`] = parseInt(pls[playlist]['index'])
			this.instance.states[`pl_${uuid}_grandMasterFader`] = grandMasterFader
			this.instance.setVariableValues(obj)
			this.instance.checkFeedbacks()
		}
	}

	async setGotoCue(plUUID: any, cueID: any) {
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
	}

	async setPreloadCue(plUUID: any, cueID: any) {
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

	async setPlay(plUUID: any) {
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

	async setPause(plUUID: any) {
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

	async setGrandMasterFader(_pl: any, _value: any, _duration: any) {
		var m = `{"jsonrpc":"2.0","method":"doaction.playlist",
			"params": {
            "uuid": "${_pl}",
            "action": "grandMasterFader",
			"value": ${_value},
			"duration": ${_duration}
            },"id": ${110}}`
		this.instance.mpConnection.sendJsonMessage(m)
	}

	async setAudioMaster(_pl: any, _value: any, _duration: any) {
		var m = `{"jsonrpc":"2.0","method":"doaction.playlist",
			"params": {
            "uuid": "${_pl}",
            "action": "audioMaster",
			"value": ${_value},
			"duration": ${_duration}
            },"id": ${110}}`
		this.instance.mpConnection.sendJsonMessage(m)
	}

	async getTaskListModuloPlayer() {
		//this.instance.log('info', 'GET TASKS LIST')
		this.instance.mpConnection?.sendMessage('get.list.tasks', 1)
	}

	async getPlaylistModuloPlayer() {
		//this.instance.log('info', 'GET PLAY LIST')
		this.instance.mpConnection?.sendMessagePlaylistsCues()
	}

	async setNextCue(plUUDI: any) {
		var m = `{"jsonrpc": "2.0", "method": "doaction.playlist",
				"params": {
				"uuid": "${plUUDI}",
				"action": "next"
			},"id": 0}`
		this.instance.mpConnection.sendJsonMessage(m)
	}

	async setPrevCue(plUUDI: any) {
		var m = `{"jsonrpc": "2.0", "method": "doaction.playlist",
				"params": {
				"uuid": "${plUUDI}",
				"action": "prev"
			},"id": 0}`
		this.instance.mpConnection.sendJsonMessage(m)
	}

	// SHOW FONCTIONS
	// SAVE
	async setShowSave() {
		var m = `{"jsonrpc": "2.0", "method": "doaction.show", "params": {"action": "save"}, "id": 0}`
		this.instance.mpConnection.sendJsonMessage(m)
	}

	// BACKUP
	async setShowbackup() {
		var m = `{"jsonrpc": "2.0", "method": "doaction.show", "params": {"action": "backup"}, "id": 0}`
		this.instance.mpConnection.sendJsonMessage(m)
	}

	// RESCAN MEDIAS
	async setShowRescanMedia() {
		var m = `{"jsonrpc": "2.0", "method": "doaction.show", "params": {"action": "rescanmedia"}, "id": 0}`
		this.instance.mpConnection.sendJsonMessage(m)
	}

	// REMOVE MISSING MEDIAS
	async setShowRemoveMissingMedia() {
		var m = `{"jsonrpc": "2.0", "method": "doaction.show", "params": {"action": "removemissingmedia"}, "id": 0}`
		this.instance.mpConnection.sendJsonMessage(m)
	}

	// RESCAN MEDIAS FORCE
	async setShowRescanMediaForce() {
		var m = `{"jsonrpc": "2.0", "method": "doaction.show", "params": {"action": "rescanmediaforce"}, "id": 0}`
		this.instance.mpConnection.sendJsonMessage(m)
	}

	// SEND SHOW TO ALL REMOTES
	async setShowSendShowToRemote() {
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
