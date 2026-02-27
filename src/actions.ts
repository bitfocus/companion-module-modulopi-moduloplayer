import type { MPinstance } from './main.js'

export function UpdateActions(instance: MPinstance): void {
	instance.setActionDefinitions({
		// LAUNCH TASK
		launch_task: {
			name: 'Launch Task',
			options: [
				{
					id: 'tl',
					type: 'dropdown',
					label: 'Select Task',
					choices: instance.dropdownTaskList,
					default: instance.dropdownTaskList[0]?.id ?? '',
				},
			],
			callback: async (event) => {
				const tl = instance.dropdownTaskList.find((e) => e.id === event.options.tl)
				if (!tl) return
				instance.moduloplayer?.sendLaunchTask(tl.uuid)
			},
		},

		// GOTO CUE
		goto_cue: {
			name: 'Launch Cue (ID) from Playlist',
			options: [
				{
					id: 'index',
					type: 'number',
					label: 'Cue ID (used only if Cue UUID is empty)',
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
				const pl = instance.dropdownPlayList.find((e) => e.id === event.options.pl)
				if (!pl) return
				const cueUUID = event.options.cueUUID as string
				if (cueUUID) {
					const playlist = instance.playLists.find((p) => p.uuid === pl.uuid)
					if (!playlist) return
					const cueIndex = playlist.cues.findIndex((c) => instance.cleanUUID(c.uuid) === cueUUID)
					if (cueIndex === -1) return
					instance.moduloplayer?.sendGotoCue(pl.uuid, cueIndex + 1)
				} else {
					instance.moduloplayer?.sendGotoCue(pl.uuid, Number(event.options.index))
				}
			},
		},

		// PRELOAD CUE
		preload_cue: {
			name: 'Preload Cue (ID) from Playlist',
			options: [
				{
					id: 'index',
					type: 'number',
					label: 'Cue ID (used only if Cue UUID is empty)',
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
				const pl = instance.dropdownPlayList.find((e) => e.id === event.options.pl)
				if (!pl) return
				const cueUUID = event.options.cueUUID as string
				if (cueUUID) {
					const playlist = instance.playLists.find((p) => p.uuid === pl.uuid)
					if (!playlist) return
					const cueIndex = playlist.cues.findIndex((c) => instance.cleanUUID(c.uuid) === cueUUID)
					if (cueIndex === -1) return
					instance.moduloplayer?.sendPreloadCue(pl.uuid, cueIndex + 1)
				} else {
					instance.moduloplayer?.sendPreloadCue(pl.uuid, Number(event.options.index))
				}
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
				const pl = instance.dropdownPlayList.find((e) => e.id === event.options.pl)
				if (!pl) return
				instance.moduloplayer?.sendPlay(pl.uuid)
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
				const pl = instance.dropdownPlayList.find((e) => e.id === event.options.pl)
				if (!pl) return
				instance.moduloplayer?.sendPause(pl.uuid)
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
				const pl = instance.dropdownPlayList.find((e) => e.id === event.options.pl)
				if (!pl) return
				instance.moduloplayer?.sendNextCue(pl.uuid)
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
				const pl = instance.dropdownPlayList.find((e) => e.id === event.options.pl)
				if (!pl) return
				instance.moduloplayer?.sendPrevCue(pl.uuid)
			},
		},

		// GRAND MASTER FADER
		pl_grand_master_fader: {
			name: 'Grand Master Fader on Playlist',
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
				const pl = instance.dropdownPlayList.find((e) => e.id === event.options.pl)
				if (!pl) return
				instance.moduloplayer?.sendGrandMasterFader(pl.uuid, event.options.value as number, event.options.duration as number)
			},
		},

		grand_master_fader_add: {
			name: 'Add Grand Master Fader Rotate on Playlist',
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
					default: 1,
					min: 0,
					max: 100,
				},
			],
			callback: async (event) => {
				const pl = instance.dropdownPlayList.find((e) => e.id === event.options.pl)
				if (!pl) return
				const plName = `pl_${instance.cleanUUID(pl.uuid)}_grandMasterFader`
				const value = Number(instance.states[plName])
				const addValue = typeof event.options.value === 'number' ? event.options.value : 0
				let newValue = value + addValue
				if (newValue > 100) newValue = 100
				instance.moduloplayer?.sendGrandMasterFader(pl.uuid, newValue, 0)
				instance.states[plName] = newValue
			},
		},

		grand_master_fader_remove: {
			name: 'Remove Grand Master Fader Rotate on Playlist',
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
					default: 1,
					min: 0,
					max: 100,
				},
			],
			callback: async (event) => {
				const pl = instance.dropdownPlayList.find((e) => e.id === event.options.pl)
				if (!pl) return
				const plName = `pl_${instance.cleanUUID(pl.uuid)}_grandMasterFader`
				const value = Number(instance.states[plName])
				const addValue = typeof event.options.value === 'number' ? event.options.value : 0
				let newValue = value - addValue
				if (newValue < 0) newValue = 0
				instance.moduloplayer?.sendGrandMasterFader(pl.uuid, newValue, 0)
				instance.states[plName] = newValue
			},
		},

		// AUDIO MASTER
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
				const pl = instance.dropdownPlayList.find((e) => e.id === event.options.pl)
				if (!pl) return
				instance.moduloplayer?.sendAudioMaster(pl.uuid, event.options.value as number, event.options.duration as number)
			},
		},

		audio_master_add: {
			name: 'Add Audio Master Rotate on Playlist',
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
					default: 1,
					min: 0,
					max: 100,
				},
			],
			callback: async (event) => {
				const pl = instance.dropdownPlayList.find((e) => e.id === event.options.pl)
				if (!pl) return
				const plName = `pl_${instance.cleanUUID(pl.uuid)}_audioMaster`
				const value = Number(instance.states[plName])
				const addValue = typeof event.options.value === 'number' ? event.options.value : 0
				let newValue = value + addValue
				if (newValue > 100) newValue = 100
				instance.moduloplayer?.sendAudioMaster(pl.uuid, newValue, 0)
				instance.states[plName] = newValue
			},
		},

		audio_master_remove: {
			name: 'Remove Audio Master Rotate on Playlist',
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
			],
			callback: async (event) => {
				const pl = instance.dropdownPlayList.find((e) => e.id === event.options.pl)
				if (!pl) return
				const plName = `pl_${instance.cleanUUID(pl.uuid)}_audioMaster`
				const value = Number(instance.states[plName])
				const addValue = typeof event.options.value === 'number' ? event.options.value : 0
				let newValue = value - addValue
				if (newValue < 0) newValue = 0
				instance.moduloplayer?.sendAudioMaster(pl.uuid, newValue, 0)
				instance.states[plName] = newValue
			},
		},

		// ----- SHOW -----
		// SAVE
		save: {
			name: 'Save Show',
			options: [],
			callback: async () => {
				instance.moduloplayer?.sendShowSave()
			},
		},

		// BACKUP
		backup: {
			name: 'Backup Show',
			options: [],
			callback: async () => {
				instance.moduloplayer?.sendShowbackup()
			},
		},

		// RESSCAN MEDIAS
		rescan_medias: {
			name: 'Rescan Medias',
			options: [],
			callback: async () => {
				instance.moduloplayer?.sendShowRescanMedia()
			},
		},

		// RESSCAN MEDIAS
		remove_missing_medias: {
			name: 'Remove Missing Medias',
			options: [],
			callback: async () => {
				instance.moduloplayer?.sendShowRemoveMissingMedia()
			},
		},

		// RESSCAN MEDIAS Froce
		rescan_medias_force: {
			name: 'Rescan Medias Force',
			options: [],
			callback: async () => {
				instance.moduloplayer?.sendShowRescanMediaForce()
			},
		},

		// RESSCAN MEDIAS Froce
		send_show_to_remote: {
			name: 'Send show to all remotes',
			options: [],
			callback: async () => {
				instance.moduloplayer?.sendShowSendShowToRemote()
			},
		},

		// ----- SPYDOG -----
		spydog_start_mp: {
			name: 'Start Modulo Player',
			options: [],
			callback: async () => {
				instance.spydog?.sendStartModuloPlayer()
			},
		},

		spydog_stop_mp: {
			name: 'Stop Modulo Player',
			options: [],
			callback: async () => {
				instance.spydog?.sendStopModuloPlayer()
			},
		},

		spydog_reboot_mp: {
			name: 'Reboot Modulo Player',
			options: [],
			callback: async () => {
				instance.spydog?.sendRebootComputer()
			},
		},

		spydog_power_off_mp: {
			name: 'Power Off Modulo Player',
			options: [],
			callback: async () => {
				instance.spydog?.sendPowerOffComputer()
			},
		},
	})
}
