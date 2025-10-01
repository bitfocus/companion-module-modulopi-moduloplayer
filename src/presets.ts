import {
	combineRgb,
	CompanionButtonPresetDefinition,
	CompanionTextPresetDefinition,
	CompanionPresetDefinitions,
} from '@companion-module/base'
import type { MPinstance } from './main.js'

export type PresetCategory = 'Tasks List' | 'PL'

const textSize = 14

export type mpPreset = CompanionButtonPresetDefinition | CompanionTextPresetDefinition
type mpPresetArray = mpPreset[] | any

export function getPresets(instance: MPinstance): CompanionPresetDefinitions {
	// TASK
	const getTasksPresets = (): mpPresetArray => {
		const tasksPresets: mpPresetArray = []
		const tls: any[] = instance.tasksList
		for (let task = 0; task < tls.length; task++) {
			//let color = instance.getColorFromHex(tls[task]['uiColor']) // [0, 0, 0]
			// COLOR
				let color = [0, 0, 0]
				if (tls[task]['uiColor'] !== '' && tls[task]['uiColor'] !== 'transparent') {
					const parsedColor = instance.getColorFromHex(tls[task]['uiColor'])
					if (parsedColor !== null) {
						color = parsedColor
					}
				}
			let uuid: String = instance.cleanUUID(tls[task]['uuid']) //.replaceAll("{", "").replaceAll("}", "")
			tasksPresets.push({
				category: `Tasks List` as PresetCategory,
				name: `$(Modulo_Player:tl_${uuid}_name)`,
				type: 'button',
				style: {
					text: `$(Modulo_Player:tl_${uuid}_name)`,
					size: textSize,
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(color[0], color[1], color[2]),
				},
				steps: [
					{
						down: [
							{
								actionId: 'launch_task',
								options: { task: `${instance.tasksList[task]['uuid']}` },
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: 'color_task',
						options: {
							uuid: uuid,
						},
					},
				],
			})
		}
		return tasksPresets
	}

	// PLAYLISTS CUES
	const getPlayListsCuesPresets = (): mpPresetArray => {
		const playlistsPresets: mpPresetArray = []
		const pls: any[] = instance.playLists
		//instance.log('warn', 'GET PLAYLISTS PRESETS >>> ' + JSON.stringify(pls, null, 4))
		for (let playlist = 0; playlist < pls.length; playlist++) {
			let cl: any[] = pls[playlist]['cues']
			let plID = pls[playlist]['uuid']
			let uuid: String = instance.cleanUUID(pls[playlist]['uuid'])
			let plName = pls[playlist]['name']
			//instance.log('warn', 'GET CUES PRESETS >>> ' + uuid)

			playlistsPresets.push({
				category: `${playlist + 1} - ${plName}`,
				name: 'Generals',
				type: 'text',
				//text: 'Generals',
			})

			// PLAY
			playlistsPresets.push({
				category: `${playlist + 1} - ${plName}`,
				name: `${plName}\nPlay`,
				type: 'button',
				style: {
					text: `${plName}\nPlay`,
					size: textSize,
					color: combineRgb(255, 255, 255),
					bgcolor: instance.grayModuloPlayer,
				},
				steps: [
					{
						down: [
							{
								actionId: 'play_pl',
								options: {
									plUUID: `${plID}`,
									pl: playlist.toString(),
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			})

			// PAUSE
			playlistsPresets.push({
				category: `${playlist + 1} - ${plName}`,
				name: `${plName}\nPause`,
				type: 'button',
				style: {
					text: `${plName}\nPause`,
					size: textSize,
					color: combineRgb(255, 255, 255),
					bgcolor: instance.grayModuloPlayer,
				},
				steps: [
					{
						down: [
							{
								actionId: 'pause_pl',
								options: {
									plUUID: `${plID}`,
									pl: playlist.toString(),
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			})

			// NEXT CUE
			playlistsPresets.push({
				category: `${playlist + 1} - ${plName}`,
				name: `${plName}`,
				type: 'button',
				style: {
					text: `${plName}`,
					alignment: 'center:top',
					size: textSize,
					color: combineRgb(255, 255, 255),
					bgcolor: instance.grayModuloPlayer,
					png64: next_icon,
					pngalignment: 'center:center',
				},
				steps: [
					{
						down: [
							{
								actionId: 'next_cue',
								options: {
									plUUID: `${plID}`,
									pl: playlist.toString(),
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			})

			// PREV CUE
			playlistsPresets.push({
				category: `${playlist + 1} - ${plName}`,
				name: `${plName}`,
				type: 'button',
				style: {
					text: `${plName}`,
					alignment: 'center:top',
					size: textSize,
					color: combineRgb(255, 255, 255),
					bgcolor: instance.grayModuloPlayer,
					png64: prev_icon,
					pngalignment: 'center:center',
				},
				steps: [
					{
						down: [
							{
								actionId: 'prev_cue',
								options: {
									plUUID: `${plID}`,
									pl: playlist.toString(),
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			})

			// GRAND MASTER 0%
			playlistsPresets.push({
				category: `${playlist + 1} - ${plName}`,
				name: `${plName}\nGM\n0%`,
				type: 'button',
				style: {
					text: `${plName}\nGM\n0%`,
					size: textSize,
					color: combineRgb(255, 255, 255),
					bgcolor: instance.grayModuloPlayer,
				},
				steps: [
					{
						down: [
							{
								actionId: 'pl_grand_master_fader',
								options: {
									value: 0,
									duration: 2000,
									plUUID: `${plID}`,
									pl: playlist.toString(),
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			})

			// GRAND MASTER 100%
			playlistsPresets.push({
				category: `${playlist + 1} - ${plName}`,
				name: `${plName}\nGM\n100%`,
				type: 'button',
				style: {
					text: `${plName}\nGM\n100%`,
					size: textSize,
					color: combineRgb(255, 255, 255),
					bgcolor: instance.grayModuloPlayer,
				},
				steps: [
					{
						down: [
							{
								actionId: 'pl_grand_master_fader',
								options: {
									value: 100,
									duration: 2000,
									plUUID: `${plID}`,
									pl: playlist.toString(),
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			})

			// GRAND MASTER LIVE
			playlistsPresets.push({
				category: `${playlist + 1} - ${plName}`,
				name: `${plName}\nGM\nRotate`,
				type: 'button',
				options: {
					rotaryActions: true,
				},
				style: {
					text: `${plName}\nGM\nRotate`,
					size: textSize,
					color: combineRgb(255, 255, 255),
					bgcolor: instance.grayModuloPlayer,
				},
				steps: [
					{
						down: [],
						up: [],
						rotate_left: [
							{
								actionId: 'grand_master_fader_remove',
								options: {
									value: 1,
									duration: 0,
									plUUID: `${plID}`,
									pl: playlist.toString(),
								},
							},
						],
						rotate_right: [
							{
								actionId: 'grand_master_fader_add',
								options: {
									value: 1,
									duration: 0,
									plUUID: `${plID}`,
									pl: playlist.toString(),
								},
							},
						],
					},
				],
				feedbacks: [],
			})

			// AUDIO MASTER 0%
			playlistsPresets.push({
				category: `${playlist + 1} - ${plName}`,
				name: `${plName}\nAM\n0%`,
				type: 'button',
				style: {
					text: `${plName}\nAM\n0%`,
					size: textSize,
					color: combineRgb(255, 255, 255),
					bgcolor: instance.grayModuloPlayer,
				},
				steps: [
					{
						down: [
							{
								actionId: 'audio_master',
								options: {
									value: 0,
									duration: 2000,
									plUUID: `${plID}`,
									pl: playlist.toString(),
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			})

			// AUDIO MASTER 100%
			playlistsPresets.push({
				category: `${playlist + 1} - ${plName}`,
				name: `${plName}\nAM\n100%`,
				type: 'button',
				style: {
					text: `${plName}\nAM\n100%`,
					size: textSize,
					color: combineRgb(255, 255, 255),
					bgcolor: instance.grayModuloPlayer,
				},
				steps: [
					{
						down: [
							{
								actionId: 'audio_master',
								options: {
									value: 100,
									duration: 2000,
									plUUID: `${plID}`,
									pl: playlist.toString(),
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			})

			// AUDIO MASTER LIVE
			playlistsPresets.push({
				category: `${playlist + 1} - ${plName}`,
				name: `${plName}\nAM\nRotate`,
				type: 'button',
				options: {
					rotaryActions: true,
				},
				style: {
					text: `${plName}\nAM\nRotate`,
					size: textSize,
					color: combineRgb(255, 255, 255),
					bgcolor: instance.grayModuloPlayer,
				},
				steps: [
					{
						down: [],
						up: [],
						rotate_left: [
							{
								actionId: 'audio_master_remove',
								options: {
									value: 1,
									duration: 0,
									plUUID: `${plID}`,
									pl: playlist.toString(),
								},
							},
						],
						rotate_right: [
							{
								actionId: 'audio_master_add',
								options: {
									value: 1,
									duration: 0,
									plUUID: `${plID}`,
									pl: playlist.toString(),
								},
							},
						],
					},
				],
				feedbacks: [],
			})

			// GOTO
			playlistsPresets.push({
				category: `${playlist + 1} - ${plName}`,
				name: `Goto`,
				type: 'text',
				//text: 'Goto',
			})

			for (let cue = 0; cue < cl.length; cue++) {
				const cuuid = instance.cleanUUID(cl[cue]['uuid'])
				// COLOR
				let color = [0, 0, 0]
				if (cl[cue]['uiColor'] !== '' && cl[cue]['uiColor'] !== 'transparent') {
					const parsedColor = instance.getColorFromHex(cl[cue]['uiColor'])
					if (parsedColor !== null) {
						color = parsedColor
					}
				}
				playlistsPresets.push({
					category: `${playlist + 1} - ${plName}`,
					name: `$(Modulo_Player:cue_${cuuid}_name)`,
					type: 'button',
					style: {
						text: `$(Modulo_Player:cue_${cuuid}_name)`,
						size: textSize,
						color: combineRgb(255, 255, 255),
						bgcolor: combineRgb(color[0], color[1], color[2]),
					},
					steps: [
						{
							down: [
								{
									actionId: 'goto_cue',
									options: {
										cueUUID: `${cl[cue]['uuid']}`,
										plUUID: `${plID}`,
										index: `${cue + 1}`,
										pl: playlist.toString(),
									},
								},
							],
							up: [],
						},
					],
					feedbacks: [
						{
							feedbackId: 'color_cue',
							options: {
								uuid: cuuid,
							},
						},
						{
							feedbackId: 'current_Cue',
							options: {
								current_Cue: cue + 1, // pls[playlist]['index'],
								pl: uuid,
							},
							style: {
								bgcolor: instance.orangeModuloPlayer,
							},
						},
					],
				})
			}

			// PRELOAD
			playlistsPresets.push({
				category: `${playlist + 1} - ${plName}`,
				name: `Preload`,
				type: 'text',
				//text: 'Goto',
			})

			for (let cue = 0; cue < cl.length; cue++) {
				const cuuid = instance.cleanUUID(cl[cue]['uuid'])

				playlistsPresets.push({
					category: `${playlist + 1} - ${plName}`,
					name: `Preload\n$(Modulo_Player:cue_${cuuid}_name)`,
					type: 'button',
					style: {
						text: `Preload\n$(Modulo_Player:cue_${cuuid}_name)`,
						size: textSize,
						color: combineRgb(255, 255, 255),
						bgcolor: instance.grayModuloPlayer,
					},
					steps: [
						{
							down: [
								{
									actionId: 'preload_cue',
									options: {
										cueUUID: `${cl[cue]['uuid']}`,
										plUUID: `${plID}`,
										index: `${cue + 1}`,
										pl: playlist.toString(),
									},
								},
							],
							up: [],
						},
					],
					feedbacks: [
						{
							feedbackId: 'color_cue',
							options: {
								uuid: cuuid,
							},
						},
						{
							feedbackId: 'current_Cue',
							options: {
								current_Cue: cue + 1, // pls[playlist]['index'],
								pl: uuid,
							},
							style: {
								bgcolor: instance.orangeModuloPlayer,
							},
						},
					],
				})
			}

			// VARIABLES
			playlistsPresets.push({
				category: `${playlist + 1} - ${plName}`,
				name: `Variables`,
				type: 'text',
				//text: 'Goto',
			})

			// GRAND MASTER VARIABLES //$(Modulo_Player:pl_${instance.cleanUUID(plID)}_grandMasterFader)
			playlistsPresets.push({
				category: `${playlist + 1} - ${plName}`,
				name: `${plName}\nGM\n$(Modulo_Player:pl_${plID}_grandMasterFader)`,
				type: 'button',
				options: {
					rotaryActions: true,
				},
				style: {
					text: `${plName}\nGM\n$(Modulo_Player:pl_${instance.cleanUUID(plID)}_grandMasterFader)`,
					size: textSize,
					color: combineRgb(255, 255, 255),
					bgcolor: instance.grayModuloPlayer,
				},
				steps: [
					{
						down: [],
						up: [],
					},
				],
				feedbacks: [],
			})

			// GRAND MASTER VARIABLES //$(Modulo_Player:pl_${instance.cleanUUID(plID)}_grandMasterFader)
			playlistsPresets.push({
				category: `${playlist + 1} - ${plName}`,
				name: `${plName}\nAM\n$(Modulo_Player:pl_${plID}_audioMaster)`,
				type: 'button',
				options: {
					rotaryActions: true,
				},
				style: {
					text: `${plName}\nAM\n$(Modulo_Player:pl_${instance.cleanUUID(plID)}_audioMaster)`,
					size: textSize,
					color: combineRgb(255, 255, 255),
					bgcolor: instance.grayModuloPlayer,
				},
				steps: [
					{
						down: [],
						up: [],
					},
				],
				feedbacks: [],
			})
		}

		//instance.log("warn", "GET TASKS PRESETS 1 >>> " + tasksPresets.length)
		return playlistsPresets
	}

	// SHOW PRESETS
	const getShowPresets = (): mpPresetArray => {
		const showPresets: mpPresetArray = []

		// SAVE
		showPresets.push({
			category: `Show`,
			name: `Save`,
			type: 'button',
			style: {
				text: `Save`,
				size: textSize,
				color: combineRgb(255, 255, 255),
				bgcolor: instance.grayModuloPlayer,
			},
			steps: [
				{
					down: [
						{
							actionId: 'save',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		})

		// BACKUP
		showPresets.push({
			category: `Show`,
			name: `Backup`,
			type: 'button',
			style: {
				text: `Backup`,
				size: textSize,
				color: combineRgb(255, 255, 255),
				bgcolor: instance.grayModuloPlayer,
			},
			steps: [
				{
					down: [
						{
							actionId: 'backup',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		})

		// RESCAN MEDIAS
		showPresets.push({
			category: `Show`,
			name: `Rescan Medias`,
			type: 'button',
			style: {
				text: `Rescan Medias`,
				size: textSize,
				color: combineRgb(255, 255, 255),
				bgcolor: instance.grayModuloPlayer,
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
		})

		// RESCAN MEDIAS FORCE
		showPresets.push({
			category: `Show`,
			name: `Rescan Medias Force`,
			type: 'button',
			style: {
				text: `Rescan Medias Force`,
				size: textSize,
				color: combineRgb(255, 255, 255),
				bgcolor: instance.grayModuloPlayer,
			},
			steps: [
				{
					down: [
						{
							actionId: 'rescan_medias_force',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		})

		// REMOVE MISSING MEDIAS
		showPresets.push({
			category: `Show`,
			name: `Remove Missing Medias`,
			type: 'button',
			style: {
				text: `Remove Missing Medias`,
				size: textSize,
				color: combineRgb(255, 255, 255),
				bgcolor: instance.grayModuloPlayer,
			},
			steps: [
				{
					down: [
						{
							actionId: 'remove_missing_medias',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		})

		// SEND SHOW TO ALL REMOTE
		showPresets.push({
			category: `Show`,
			name: `Send Show to All Remotes`,
			type: 'button',
			style: {
				text: `Send Show to All Remotes`,
				size: textSize,
				color: combineRgb(255, 255, 255),
				bgcolor: instance.grayModuloPlayer,
			},
			steps: [
				{
					down: [
						{
							actionId: 'send_show_to_remote',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		})

		return showPresets
	}

	const getSpydogPresets = (): mpPresetArray => {
		const spydogPresets: mpPresetArray = []

		// REBOOT
		spydogPresets.push({
			category: `Spydog`,
			name: `Reboot Server`,
			type: 'button',
			style: {
				text: `Reboot Server`,
				size: textSize,
				color: combineRgb(255, 255, 255),
				bgcolor: instance.redModuloPlayer,
			},
			steps: [
				{
					down: [
						{
							actionId: 'spydog_reboot_mp',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		})

		// POWER OFF
		spydogPresets.push({
			category: `Spydog`,
			name: `Power Off Server`,
			type: 'button',
			style: {
				text: `Power Off Server`,
				size: textSize,
				color: combineRgb(255, 255, 255),
				bgcolor: instance.redModuloPlayer,
			},
			steps: [
				{
					down: [
						{
							actionId: 'spydog_power_off_mp',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		})

		// RESTART MODULO PLAYER
		spydogPresets.push({
			category: `Spydog`,
			name: `Start Modulo Player`,
			type: 'button',
			style: {
				text: `Start Modulo Player`,
				size: textSize,
				color: combineRgb(255, 255, 255),
				bgcolor: instance.greenModuloPlayer,
			},
			steps: [
				{
					down: [
						{
							actionId: 'spydog_start_mp',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		})
		// STOP MODULO PLAYER
		spydogPresets.push({
			category: `Spydog`,
			name: `Stop Modulo Player`,
			type: 'button',
			style: {
				text: `Stop Modulo Player`,
				size: textSize,
				color: combineRgb(255, 255, 255),
				bgcolor: instance.orangeModuloPlayer,
			},
			steps: [
				{
					down: [
						{
							actionId: 'spydog_stop_mp',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		})

		return spydogPresets
	}

	// VARIABLES CUES
	const getVariablesPresets = (): mpPresetArray => {
		const variablesPresets: mpPresetArray = []

		variablesPresets.push({
			category: `Variables`,
			name: 'General',
			type: 'text',
			//text: 'Generals',
		})

		// STATUS
		variablesPresets.push({
			category: `Variables`,
			name: `Satut`,
			type: 'button',
			style: {
				text: `Satut`,
				size: textSize,
				color: combineRgb(255, 255, 255),
				bgcolor: instance.greenModuloPlayer,
			},
			steps: [
				{
					down: [],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'status',
					options: {
						status: 0,
					},
					style: {
						text: `Offline`,
						bgcolor: combineRgb(255, 0, 0),
					},
				},
				{
					feedbackId: 'status',
					options: {
						status: 1,
					},
					style: {
						text: `Launching`,
						bgcolor: instance.orangeModuloPlayer,
					},
				},
				{
					feedbackId: 'status',
					options: {
						status: 2,
					},
					style: {
						text: `Online`,
						bgcolor: instance.greenModuloPlayer,
					},
				},
			],
		})

		// NAME
		variablesPresets.push({
			category: `Variables`,
			name: `Name\nMaster\nor\nSlave`,
			type: 'button',
			style: {
				text: `Name\nMaster\nor\nSlave`,
				size: textSize,
				color: combineRgb(255, 255, 255),
				bgcolor: instance.getCombineRGBFromHex(instance.states['color']),
			},
			steps: [
				{
					down: [],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'color',
					options: {},
				},
				{
					feedbackId: 'master',
					options: {
						master: true,
					},
					style: {
						text: `$(Modulo_Player:serverName) Master`,
					},
				},
				{
					feedbackId: 'master',
					options: {
						master: false,
					},
					style: {
						text: `$(Modulo_Player:serverName) Slave`,
					},
				},
			],
		})

		// FPS
		variablesPresets.push({
			category: `Variables`,
			name: `FPS\n$(Modulo_Player:fps)`,
			type: 'button',
			style: {
				text: `FPS\n$(Modulo_Player:fps)`,
				size: textSize,
				color: combineRgb(255, 255, 255),
				bgcolor: instance.greenModuloPlayer,
			},
			steps: [
				{
					down: [],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'fps_ok',
					options: {},
					style: {
						bgcolor: instance.greenModuloPlayer,
					},
				},
				{
					feedbackId: 'fps_ok',
					options: {},
					style: {
						bgcolor: instance.redModuloPlayer,
					},
				},
			],
		})

		// MEMORY USE
		variablesPresets.push({
			category: `Variables`,
			name: `Memory\n$(Modulo_Player:memoryUse) %`,
			type: 'button',
			style: {
				text: `Memory\n$(Modulo_Player:memoryUse) %`,
				size: textSize,
				color: combineRgb(255, 255, 255),
				bgcolor: instance.greenModuloPlayer,
			},
			steps: [
				{
					down: [],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'memory_use',
					options: {},
				},
			],
		})

		// CPU USE
		variablesPresets.push({
			category: `Variables`,
			name: `CPU\n$(Modulo_Player:cpuUse) %`,
			type: 'button',
			style: {
				text: `CPU\n$(Modulo_Player:cpuUse) %`,
				size: textSize,
				color: combineRgb(255, 255, 255),
				bgcolor: instance.greenModuloPlayer,
			},
			steps: [
				{
					down: [],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'cpu_use',
					options: {},
				},
			],
		})

		// DYNAMIC INFO
		variablesPresets.push({
			category: `Variables`,
			name: 'Dynamic Info',
			type: 'text',
			//text: 'Generals',
		})

		const dynamicArray: { [key: string]: any } = instance.dynamicInfo
		for (var key in dynamicArray) {
			if (key === 'color') {
				variablesPresets.push({
					category: `Variables`,
					name: `Color Player`,
					type: 'button',
					style: {
						text: `Color Player`,
						size: textSize,
						color: combineRgb(255, 255, 255),
						bgcolor: instance.getCombineRGBFromHex(instance.states['color']),
					},
					steps: [
						{
							down: [],
							up: [],
						},
					],
					feedbacks: [
						{
							feedbackId: 'color',
							options: {},
						},
					],
				})
			} else {
				variablesPresets.push({
					category: `Variables`,
					name: `(Modulo_Player:${key})`,
					type: 'button',
					style: {
						text: `$(Modulo_Player:${key})`,
						size: textSize,
						color: combineRgb(255, 255, 255),
						//bgcolor: instance.getCombineRGBFromHex(instance.states['color']),
					},
					steps: [
						{
							down: [],
							up: [],
						},
					],
					feedbacks: [],
				})
			}
		}

		// STATIC INFO
		variablesPresets.push({
			category: `Variables`,
			name: 'Static Info',
			type: 'text',
			//text: 'Generals',
		})

		const staticInfo: { [key: string]: any } = instance.staticInfo
		for (var key in staticInfo) {
			variablesPresets.push({
				category: `Variables`,
				name: `(Modulo_Player:${key})`,
				type: 'button',
				style: {
					text: `$(Modulo_Player:${key})`,
					size: textSize,
					color: combineRgb(255, 255, 255),
					//bgcolor: instance.getCombineRGBFromHex(instance.states['color']),
				},
				steps: [
					{
						down: [],
						up: [],
					},
				],
				feedbacks: [],
			})
		}

		return variablesPresets
	}

	let presets: mpPresetArray = []
	if (instance.sdConnected) {
		presets = [
			...getTasksPresets(),
			...getPlayListsCuesPresets(),
			...getShowPresets(),
			...getSpydogPresets(),
			...getVariablesPresets(),
		]
	} else {
		presets = [...getTasksPresets(), ...getPlayListsCuesPresets(), ...getShowPresets(), ...getVariablesPresets()]
	}

	return presets as unknown as CompanionPresetDefinitions
}

const next_icon =
	'iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAFEmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgeG1wOkNyZWF0ZURhdGU9IjIwMjUtMDYtMjRUMTA6NDI6MTUrMDIwMCIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjUtMDYtMjRUMTA6NDY6MTQrMDI6MDAiCiAgIHhtcDpNZXRhZGF0YURhdGU9IjIwMjUtMDYtMjRUMTA6NDY6MTQrMDI6MDAiCiAgIHBob3Rvc2hvcDpEYXRlQ3JlYXRlZD0iMjAyNS0wNi0yNFQxMDo0MjoxNSswMjAwIgogICBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIgogICBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiCiAgIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSI0MCIKICAgZXhpZjpQaXhlbFlEaW1lbnNpb249IjQwIgogICBleGlmOkNvbG9yU3BhY2U9IjEiCiAgIHRpZmY6SW1hZ2VXaWR0aD0iNDAiCiAgIHRpZmY6SW1hZ2VMZW5ndGg9IjQwIgogICB0aWZmOlJlc29sdXRpb25Vbml0PSIyIgogICB0aWZmOlhSZXNvbHV0aW9uPSI3Mi8xIgogICB0aWZmOllSZXNvbHV0aW9uPSI3Mi8xIj4KICAgPHhtcE1NOkhpc3Rvcnk+CiAgICA8cmRmOlNlcT4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0icHJvZHVjZWQiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFmZmluaXR5IFBob3RvIDIgMi42LjIiCiAgICAgIHN0RXZ0OndoZW49IjIwMjUtMDYtMjRUMTA6NDY6MTQrMDI6MDAiLz4KICAgIDwvcmRmOlNlcT4KICAgPC94bXBNTTpIaXN0b3J5PgogIDwvcmRmOkRlc2NyaXB0aW9uPgogPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KPD94cGFja2V0IGVuZD0iciI/Phspxb4AAAGCaUNDUHNSR0IgSUVDNjE5NjYtMi4xAAAokXWRzytEURTHPzMGEyOKxSwsXhpKIT9qYqOMNNSkaYzyazPzzJtRM+P13pskW2WrKLHxa8FfwFZZK0WkZM2W2KDnPKNGMud27vnc773ndO+54I5n1Zzp6YZc3jJi4ZAyNT2jVD9RhR8v7XgSqqkPRaMRytrbDS4nXnU6tcqf+9dq51OmCi6v8KCqG5bwqHBkydId3hRuUjOJeeFj4Q5DLih87ejJIj86nC7yh8NGPDYM7gZhJf2Lk79YzRg5YXk5gVy2oP7cx3mJL5WfnJDYIt6MSYwwIRTGGGGYID0MyBykk166ZEWZ/O7v/HEWJVeVWWcZgwXSZLDoELUg1VMSNdFTMrIsO/3/21dT6+stVveFoPLBtl9aoXoDPtdt+33ftj8PoOIezvKl/MU96H8Vfb2kBXahfhVOzktacgtO18B/pyeMxLdUIe7WNHg+grppaLyEmtliz372ObyF+Ip81QVs70CbnK+f+wI1bGfP9gSzaAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAN9JREFUWIXt1D8OQUEQgPEZf0KpcQAKh3ATrqByAU6glFCLS9ByBApH4AKv8imEbPEi5i1vSeZXv9n58jZZEeecc86lpJaPgZ6IjCJ3zlX1FHlGPkCBJcUtANNPKRJZB7YF4jZA/atxQWQLOBriDkCrlLggsgtc3og7A51S44LIPpC9iMuAfpK4IHL4InCQNO4BmObETVJ3PXF/ftZB3IpvPydWQBPYAzugkbonF9AG2p88s/A1AGMRqRpGZqqKdU9MYCYilqusqurVuqdiHSjbzwfWImbnkfPOOeec+wM3bf56C1rwLO4AAAAASUVORK5CYII='

const prev_icon =
	'iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAFEmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgeG1wOkNyZWF0ZURhdGU9IjIwMjUtMDYtMjRUMTA6NDI6MTUrMDIwMCIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjUtMDYtMjRUMTA6NDY6MjQrMDI6MDAiCiAgIHhtcDpNZXRhZGF0YURhdGU9IjIwMjUtMDYtMjRUMTA6NDY6MjQrMDI6MDAiCiAgIHBob3Rvc2hvcDpEYXRlQ3JlYXRlZD0iMjAyNS0wNi0yNFQxMDo0MjoxNSswMjAwIgogICBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIgogICBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiCiAgIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSI0MCIKICAgZXhpZjpQaXhlbFlEaW1lbnNpb249IjQwIgogICBleGlmOkNvbG9yU3BhY2U9IjEiCiAgIHRpZmY6SW1hZ2VXaWR0aD0iNDAiCiAgIHRpZmY6SW1hZ2VMZW5ndGg9IjQwIgogICB0aWZmOlJlc29sdXRpb25Vbml0PSIyIgogICB0aWZmOlhSZXNvbHV0aW9uPSI3Mi8xIgogICB0aWZmOllSZXNvbHV0aW9uPSI3Mi8xIj4KICAgPHhtcE1NOkhpc3Rvcnk+CiAgICA8cmRmOlNlcT4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0icHJvZHVjZWQiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFmZmluaXR5IFBob3RvIDIgMi42LjIiCiAgICAgIHN0RXZ0OndoZW49IjIwMjUtMDYtMjRUMTA6NDY6MjQrMDI6MDAiLz4KICAgIDwvcmRmOlNlcT4KICAgPC94bXBNTTpIaXN0b3J5PgogIDwvcmRmOkRlc2NyaXB0aW9uPgogPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KPD94cGFja2V0IGVuZD0iciI/PiTiGS4AAAGCaUNDUHNSR0IgSUVDNjE5NjYtMi4xAAAokXWRzytEURTHPzMGEyOKxSwsXhpKIT9qYqOMNNSkaYzyazPzzJtRM+P13pskW2WrKLHxa8FfwFZZK0WkZM2W2KDnPKNGMud27vnc773ndO+54I5n1Zzp6YZc3jJi4ZAyNT2jVD9RhR8v7XgSqqkPRaMRytrbDS4nXnU6tcqf+9dq51OmCi6v8KCqG5bwqHBkydId3hRuUjOJeeFj4Q5DLih87ejJIj86nC7yh8NGPDYM7gZhJf2Lk79YzRg5YXk5gVy2oP7cx3mJL5WfnJDYIt6MSYwwIRTGGGGYID0MyBykk166ZEWZ/O7v/HEWJVeVWWcZgwXSZLDoELUg1VMSNdFTMrIsO/3/21dT6+stVveFoPLBtl9aoXoDPtdt+33ftj8PoOIezvKl/MU96H8Vfb2kBXahfhVOzktacgtO18B/pyeMxLdUIe7WNHg+grppaLyEmtliz372ObyF+Ip81QVs70CbnK+f+wI1bGfP9gSzaAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAOJJREFUWIXt1bFtwkAYhuHvR6C4dOMBEilLhElgDZSWjIBElfRhCdKGFVwwAixgS0Ev1SkiIJQ7ZB/F/9T+fG9hnSXnnHPO5WQpI2AgaREx+TGzWcpZtwQeIiatmRUpZw1SRn26+8Bh4g5JrxHPx3wO3QEqoMrdcRFQABvgG3jI3XMCMGDFr08g6YboBPDGuXnuLkkSML0QF0xyx42B9kpgA7zkinsC9lfigh3w2HdcCdT/iAtqoOwrbgR8RcQFa2DUdZwBHwlxwTuR10/sr+5ZUiNpGbn7+47tDXvnnHPO9egInP95mCldvZ4AAAAASUVORK5CYII='
