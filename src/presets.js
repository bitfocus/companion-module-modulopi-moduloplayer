const { combineRgb } = require('@companion-module/base')

module.exports = function getPresets(moduloPlayerData) {
	const presets = {}
	const colorWhite = [255, 255, 255]
	const colorBlack = [0, 0, 0]
	const colorGrayLight = [100, 100, 100]
	const colorOrange = [255, 165, 0]

	// PLAYLIST & CUES
	Object.keys(moduloPlayerData.playList).forEach((key) => {
		const pl = moduloPlayerData.playList[key]
		const cl = moduloPlayerData.cuesList[key]

		presets[`${pl.uuid}_next_cue`] = {
			type: 'button',
			category: pl.name,
			style: {
				text: `${pl.name}\nNext Cue`,
				size: '14',
				color: combineRgb(colorWhite[0], colorWhite[1], colorWhite[2]),
				bgcolor: combineRgb(colorGrayLight[0], colorGrayLight[1], colorGrayLight[2]),
			},
			steps: [
				{
					down: [
						{
							actionId: 'next_cue',
							options: {
								pl: pl.id,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}
		presets[`${pl.uuid}_previous_cue`] = {
			type: 'button',
			category: pl.name,
			style: {
				text: `${pl.name}\nPrev. Cue`,
				size: '14',
				color: combineRgb(colorWhite[0], colorWhite[1], colorWhite[2]),
				bgcolor: combineRgb(colorGrayLight[0], colorGrayLight[1], colorGrayLight[2]),
			},
			steps: [
				{
					down: [
						{
							actionId: 'previous_cue',
							options: {
								pl: pl.id,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		Object.keys(cl).forEach((key) => {
			presets[`${cl[key].uuid}_${cl[key].name}`] = {
				type: 'button',
				category: pl.name,
				style: {
					text: cl[key].name,
					size: '14',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [
					{
						down: [
							{
								actionId: 'launch_cue',
								options: {
									cue: cl[key].id,
									pl: pl.id,
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: 'current_Cue',
						options: {
							current_Cue: cl[key].id,
							pl: pl.id,
						},
						style: {
							bgcolor: combineRgb(colorOrange[0], colorOrange[1], colorOrange[2]),
						},
					},
				],
			}
		})
	})

	// TASKS
	Object.keys(moduloPlayerData.taskList).forEach((key) => {
		presets[`${key}_${moduloPlayerData.taskList[key].name}`] = {
			type: 'button',
			category: 'Task List',
			style: {
				text: moduloPlayerData.taskList[key].name,
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'launch_task',
							options: {
								task: moduloPlayerData.taskList[key].id,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}
	})

	// CUES
	presets['launch_cue'] = {
		type: 'button',
		category: 'General',
		style: {
			text: 'Launch\nCue\n1',
			size: '14',
			color: combineRgb(colorWhite[0], colorWhite[1], colorWhite[2]),
			bgcolor: combineRgb(colorGrayLight[0], colorGrayLight[1], colorGrayLight[2]),
		},
		steps: [
			{
				down: [
					{
						actionId: 'launch_cue',
						options: {
							cue: 1,
							pl: 1,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`preload_cue`] = {
		type: 'button',
		category: 'General',
		style: {
			text: `Preload\nCue`,
			size: '14',
			color: combineRgb(colorWhite[0], colorWhite[1], colorWhite[2]),
			bgcolor: combineRgb(colorGrayLight[0], colorGrayLight[1], colorGrayLight[2]),
		},
		steps: [
			{
				down: [
					{
						actionId: 'preload_cue',
						options: {
							pl: 1,
							cue: 1,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['next_cue'] = {
		type: 'button',
		category: 'General',
		style: {
			text: 'Next\nCue',
			size: '14',
			color: combineRgb(colorWhite[0], colorWhite[1], colorWhite[2]),
			bgcolor: combineRgb(colorGrayLight[0], colorGrayLight[1], colorGrayLight[2]),
		},
		steps: [
			{
				down: [
					{
						actionId: 'next_cue',
						options: {
							pl: 1,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['previous_cue'] = {
		type: 'button',
		category: 'General',
		style: {
			text: 'Previous\nCue',
			size: '14',
			color: combineRgb(colorWhite[0], colorWhite[1], colorWhite[2]),
			bgcolor: combineRgb(colorGrayLight[0], colorGrayLight[1], colorGrayLight[2]),
		},
		steps: [
			{
				down: [
					{
						actionId: 'previous_cue',
						options: {
							pl: 1,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['lunch_task'] = {
		type: 'button',
		category: 'General',
		style: {
			text: 'Launch\nTask\n1',
			size: '14',
			color: combineRgb(colorWhite[0], colorWhite[1], colorWhite[2]),
			bgcolor: combineRgb(colorGrayLight[0], colorGrayLight[1], colorGrayLight[2]),
		},
		steps: [
			{
				down: [
					{
						actionId: 'launch_task',
						options: {
							task: 1,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	// General
	presets['save_show'] = {
		type: 'button',
		category: 'General',
		style: {
			text: 'Save\nShow',
			size: '14',
			color: combineRgb(colorWhite[0], colorWhite[1], colorWhite[2]),
			bgcolor: combineRgb(colorGrayLight[0], colorGrayLight[1], colorGrayLight[2]),
		},
		steps: [
			{
				down: [
					{
						actionId: 'save_show',
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['backup_show'] = {
		type: 'button',
		category: 'General',
		style: {
			text: 'Backup\nShow',
			size: '14',
			color: combineRgb(colorWhite[0], colorWhite[1], colorWhite[2]),
			bgcolor: combineRgb(colorGrayLight[0], colorGrayLight[1], colorGrayLight[2]),
		},
		steps: [
			{
				down: [
					{
						actionId: 'backup_show',
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['rescan_medias'] = {
		type: 'button',
		category: 'General',
		style: {
			text: 'Update\nMedias',
			size: '14',
			color: combineRgb(colorWhite[0], colorWhite[1], colorWhite[2]),
			bgcolor: combineRgb(colorGrayLight[0], colorGrayLight[1], colorGrayLight[2]),
		},
		steps: [
			{
				down: [
					{
						actionId: 'rescan_medias',
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	return presets
}
