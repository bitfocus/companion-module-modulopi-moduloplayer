module.exports = function getActions(self) {

	const actions = {}

	actions['launch_task'] = {
		name: 'Launch Task (ID)',
		options: [
			{
				id: 'task',
				type: 'number',
				label: 'Task ID',
				default: 1,
				min: 1,
				max: 10000,
			},
		],
		callback: async (event) => {
			console.log('Launch Task ID: ' + event.options.task)
			await self.sendCommand('launchTask?' + event.options.task)
		},
	}

	actions['launch_cue'] = {
		name: 'Launch Cue (ID) on Playlist (ID)',
		options: [
			{
				id: 'cue',
				type: 'number',
				label: 'Cue ID',
				default: 1,
				min: 1,
				max: 10000,
			},
			{
				id: 'pl',
				type: 'number',
				label: 'Playlist ID',
				default: 1,
				min: 1,
				max: 10000,
			},
		],
		callback: async (event) => {
			console.log('Launch Cue ID: ' + event.options.cue + ' from Playlist ID: ' + event.options.pl)
			await self.sendCommand('playItem?' + event.options.pl + '?' + event.options.cue)
			await self.getPlayListCueIndexFromModuloPlayer()
		},
	}

	actions['next_cue'] = {
		name: 'Next Cue Playlist (ID)',
		options: [
			{
				id: 'pl',
				type: 'number',
				label: 'Playlist ID',
				default: 1,
				min: 1,
				max: 10000,
			},
		],
		callback: async (event) => {
			console.log('Next Cue from Playlist ID: ' + event.options.pl)
			await self.sendCommand('playnextcue?' + event.options.pl)
		},
	}

	actions['previous_cue'] = {
		name: 'Previous Cue Playlist (ID)',
		options: [
			{
				id: 'pl',
				type: 'number',
				label: 'Playlist ID',
				default: 1,
				min: 1,
				max: 10000,
			},
		],
		callback: async (event) => {
			console.log('previous Cue from Playlist ID: ' + event.options.pl)
			await self.sendCommand('playpreviouscue?' + event.options.pl)
		},
	}

	actions['preload_cue'] = {
		name: 'Preload a cue on a playlist',
		options: [
			{
				id: 'cue',
				type: 'number',
				label: 'Cue ID',
				default: 1,
				min: 1,
				max: 10000,
			},
			{
				id: 'pl',
				type: 'number',
				label: 'Playlist ID',
				default: 1,
				min: 1,
				max: 10000,
			},
		],
		callback: async (event) => {
			console.log('Preload Cue ID: ' + event.options.cue + ' from Playlist ID: ' + event.options.pl)
			await self.sendCommand('preloadcue?' + event.options.pl + '?' + event.options.cue)
		},
	}

	actions['pl_fader'] = {
		name: 'Fader value of a playlist',
		options: [
			{
				id: 'pl',
				type: 'number',
				label: 'Playlist ID',
				default: 1,
				min: 1,
				max: 10000,
			},
			{
				id: 'stepSize',
				type: 'number',
				label: 'Step Size (-/+)',
				default: 1,
				min: 0,
				max: 100,
				step: 1,
			},
		],
		callback: async (event) => {
			const minLevel = 0.0
			const maxLevel = 100.0
			let currentValue = self.getVariableValue('pl_fader')
			console.log('Fader VALUES >>> ' + currentValue + " " + event.options.stepSize)
			let newValue = (currentValue + event.options.stepSize)
			if (newValue < minLevel) {
				newValue = minLevel
			} else if (newValue > maxLevel) {
				newValue = maxLevel
			}
			self.setVariableValues({ pl_fader: parseInt(newValue) })
			console.log('Variable Fader >>> ' + newValue + " / " + parseFloat(newValue / 100))
			await self.sendCommand('setFaderPlayList?' + event.options.pl + '?' + parseFloat(newValue / 100))
		},
	}

	actions['pl_cue_index'] = {
		name: 'Get PlayList Cue Index',
		options: [
			{
				id: 'pl',
				type: 'number',
				label: 'Playlist ID',
				default: 1,
				min: 1,
				max: 10000,
			},
		],
		callback: async (event) => {
			console.log('GET PLAYLIST CUE INDEX >>> ' + event.options.pl)
			await self.sendCommand('getPlayListCueIndex?' + event.options.pl)
		},
	}

	// General
	actions['save_show'] = {
		name: 'Save Show',
		options: [],
		callback: async (event) => {
			console.log('Save Show')
			await self.sendCommand('saveShow')
		},
	}

	actions['backup_show'] = {
		name: 'Backup Show',
		options: [],
		callback: async (event) => {
			console.log('Backup Show')
			await self.sendCommand('backupShow')
		},
	}

	actions['rescan_medias'] = {
		name: 'Medias Update',
		options: [],
		callback: async (event) => {
			console.log('Update Medias')
			await self.sendCommand('rescanMedias')
		},
	}
	return actions
};
