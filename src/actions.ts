import type { MPinstance } from './main.js'

export function UpdateActions(instance: MPinstance): void {
	instance.setActionDefinitions({
		// LAUNCH TASK
		launch_task: {
			name: 'Launch Task {uuid}',
			options: [
				{
					id: 'task',
					type: 'textinput',
					label: 'Task ID',
					default: '',
				},
			],
			callback: async (event) => {
				//console.log('Launch Task ID: ' + event.options.task)
				instance.mpConnection.sendMessageLunchTask(event.options.task, 2)
			},
		},

		// GOTO CUE
		goto_cue: {
			name: 'Launch Cue (ID) from Playlist',
			options: [
				{
					id: 'index',
					type: 'number',
					label: 'Cue ID',
					default: 1,
					min: 1,
					max: 10000,
				},
				{
					id: 'cueUUID',
					type: 'textinput',
					label: 'Cue UUID',
					default: '',
					isVisible: () => false,
				},
				{
					id: 'plUUID',
					type: 'textinput',
					label: 'Playlist uuid',
					default: '',
					isVisible: () => false,
				},
				{
					id: 'pl',
					type: 'dropdown',
					label: 'Select Playlist',
					choices: instance.dropdownPlayList,
					default: `0`,
				},
			],
			callback: async (event) => {
				let id = 0
				if (typeof event.options.pl === 'string') {
					id = parseInt(event.options.pl, 10)
				}
				const pl = instance.dropdownPlayList[id]
				// console.log('warn', `MODULO PLAYER | GET DROPDOWN ACTION >>> ${typeof event.options.pl} >>>  ${JSON.stringify(pl)}`)
				// console.log(`Launch Cue ID: ${event.options.pl} from Playlist UUID: ${pl["uuid"]}`)
				instance.moduloplayer?.setGotoCue(pl['uuid'], event.options.index)
			},
		},

		// PRELOAD CUE
		preload_cue: {
			name: 'Preload Cue (ID) from Playlist',
			options: [
				{
					id: 'index',
					type: 'number',
					label: 'Cue ID',
					default: 1,
					min: 1,
					max: 10000,
				},
				{
					id: 'cueUUID',
					type: 'textinput',
					label: 'Cue UUID',
					default: '',
					isVisible: () => false,
				},
				{
					id: 'plUUID',
					type: 'textinput',
					label: 'Playlist uuid',
					default: '',
					isVisible: () => false,
				},
				{
					id: 'pl',
					type: 'dropdown',
					label: 'Select Playlist',
					choices: instance.dropdownPlayList,
					default: `0`,
				},
			],
			callback: async (event) => {
				let id = 0
				if (typeof event.options.pl === 'string') {
					id = parseInt(event.options.pl, 10)
				}
				const pl = instance.dropdownPlayList[id]
				// console.log('warn', `MODULO PLAYER | GET DROPDOWN ACTION >>> ${typeof event.options.pl} >>>  ${JSON.stringify(pl)}`)
				// console.log(`Launch Cue ID: ${event.options.pl} from Playlist UUID: ${pl["uuid"]}`)
				instance.moduloplayer?.setPreloadCue(pl['uuid'], event.options.index)
			},
		},

		// PLAY CUE
		play_pl: {
			name: 'Play Playlist',
			options: [
				{
					id: 'plUUID',
					type: 'textinput',
					label: 'Playlist UUID',
					default: '',
					isVisible: () => false,
				},
				{
					id: 'pl',
					type: 'dropdown',
					label: 'Select Playlist',
					choices: instance.dropdownPlayList,
					default: `0`,
				},
			],
			callback: async (event) => {
				let id = 0
				if (typeof event.options.pl === 'string') {
					id = parseInt(event.options.pl, 10)
				}
				const pl = instance.dropdownPlayList[id]
				instance.moduloplayer?.setPlay(pl['uuid'])
			},
		},

		// PLAY CUE
		pause_pl: {
			name: 'Pause Playlist',
			options: [
				{
					id: 'plUUID',
					type: 'textinput',
					label: 'Playlist UUID',
					default: '',
					isVisible: () => false,
				},
				{
					id: 'pl',
					type: 'dropdown',
					label: 'Select Playlist',
					choices: instance.dropdownPlayList,
					default: `0`,
				},
			],
			callback: async (event) => {
				let id = 0
				if (typeof event.options.pl === 'string') {
					id = parseInt(event.options.pl, 10)
				}
				const pl = instance.dropdownPlayList[id]
				instance.moduloplayer?.setPause(pl['uuid'])
			},
		},

		// NEXT CUE
		next_cue: {
			name: 'Next Cue on Playlist',
			options: [
				{
					id: 'plUUID',
					type: 'textinput',
					label: 'Playlist UUID',
					default: '',
					isVisible: () => false,
				},
				{
					id: 'pl',
					type: 'dropdown',
					label: 'Select Playlist',
					choices: instance.dropdownPlayList,
					default: `0`,
				},
			],
			callback: async (event) => {
				let id = 0
				if (typeof event.options.pl === 'string') {
					id = parseInt(event.options.pl, 10)
				}
				const pl = instance.dropdownPlayList[id]
				instance.moduloplayer?.setNextCue(pl['uuid'])
			},
		},

		// PREV CUE
		prev_cue: {
			name: 'Next Cue on Playlist',
			options: [
				{
					id: 'plUUID',
					type: 'textinput',
					label: 'Playlist UUID',
					default: '',
					isVisible: () => false,
				},
				{
					id: 'pl',
					type: 'dropdown',
					label: 'Select Playlist',
					choices: instance.dropdownPlayList,
					default: `0`,
				},
			],
			callback: async (event) => {
				let id = 0
				if (typeof event.options.pl === 'string') {
					id = parseInt(event.options.pl, 10)
				}
				const pl = instance.dropdownPlayList[id]
				instance.moduloplayer?.setPrevCue(pl['uuid'])
			},
		},

		// GRAND MASTER FADER
		pl_grand_master_fader: {
			name: 'GrandMaster Fader on Playlist (ID)',
			options: [
				{
					id: 'pl',
					type: 'dropdown',
					label: 'Select Playlist',
					choices: instance.dropdownPlayList,
					default: `0`,
				},
				{
					id: 'plUUID',
					type: 'textinput',
					label: 'Playlist ID',
					default: '',
					isVisible: () => false,
				},
				{
					id: 'value',
					type: 'number',
					label: 'Value in % (0 to 100)',
					default: 100,
					min: 0,
					max: 100,
				},
				{
					id: 'duration',
					type: 'number',
					label: 'Duration in ms (max 3600000 = 1 hour)',
					default: 2000,
					min: 0,
					max: 3600000,
				},
			],
			callback: async (event) => {
				let id = 0
				if (typeof event.options.pl === 'string') {
					id = parseInt(event.options.pl, 10)
				}
				const pl = instance.dropdownPlayList[id]
				instance.moduloplayer?.setGrandMasterFader(pl['uuid'], event.options.value, event.options.duration)
			},
		},

		// GRAND MASTER FADER
		audio_master: {
			name: 'Audio Master on Playlist',
			options: [
				{
					id: 'pl',
					type: 'dropdown',
					label: 'Select Playlist',
					choices: instance.dropdownPlayList,
					default: `0`,
				},
				{
					id: 'plUUID',
					type: 'textinput',
					label: 'Playlist ID',
					default: '',
					isVisible: () => false,
				},
				{
					id: 'value',
					type: 'number',
					label: 'Value in % (0 to 100)',
					default: 100,
					min: 0,
					max: 100,
				},
				{
					id: 'duration',
					type: 'number',
					label: 'Duration in ms (max 3600000 = 1 hour)',
					default: 2000,
					min: 0,
					max: 3600000,
				},
			],
			callback: async (event) => {
				let id = 0
				if (typeof event.options.pl === 'string') {
					id = parseInt(event.options.pl, 10)
				}
				const pl = instance.dropdownPlayList[id]
				instance.moduloplayer?.setAudioMaster(pl['uuid'], event.options.value, event.options.duration)
			},
		},

		// ----- SHOW -----
		// SAVE
		save: {
			name: 'Save Show',
			options: [],
			callback: async () => {
				instance.moduloplayer?.setShowSave()
			},
		},

		// BACKUP
		backup: {
			name: 'Backup Show',
			options: [],
			callback: async () => {
				instance.moduloplayer?.setShowbackup()
			},
		},

		// RESSCAN MEDIAS
		rescan_medias: {
			name: 'Rescan Medias',
			options: [],
			callback: async () => {
				instance.moduloplayer?.setShowRescanMedia()
			},
		},

		// RESSCAN MEDIAS
		remove_missing_medias: {
			name: 'Remove Missing Medias',
			options: [],
			callback: async () => {
				instance.moduloplayer?.setShowRemoveMissingMedia()
			},
		},

		// RESSCAN MEDIAS Froce
		rescan_medias_force: {
			name: 'Rescan Medias Force',
			options: [],
			callback: async () => {
				instance.moduloplayer?.setShowRescanMediaForce()
			},
		},

		// RESSCAN MEDIAS Froce
		send_show_to_remote: {
			name: 'Send show to all remotes',
			options: [],
			callback: async () => {
				instance.moduloplayer?.setShowSendShowToRemote()
			},
		},
	})
}
