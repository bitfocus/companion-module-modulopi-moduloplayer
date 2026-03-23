import { combineRgb } from '@companion-module/base'
import type { MPinstance } from './main.js'

export function UpdateFeedbacks(instance: MPinstance): void {
	instance.setFeedbackDefinitions({
		color_task: {
			name: 'Color Task',
			type: 'advanced',
			options: [
				{
					type: 'textinput',
					label: 'Task UUID',
					id: 'uuid',
					default: '',
					isVisible: () => false,
				},
			],
			callback: (feedback) => {
				const uuid = feedback.options.uuid as string
				const colorStr = instance.getVariableValue(`tl_${uuid}_color`)
				if (typeof colorStr === 'string') {
					return { bgcolor: parseInt(colorStr, 10) }
				}
				return {}
			},
		},
		color_cue: {
			name: 'Color Cue',
			type: 'advanced',
			options: [
				{
					type: 'textinput',
					label: 'Legacy Cue UUID',
					id: 'uuid',
					default: '',
					isVisible: () => false,
				},
				{
					type: 'textinput',
					label: 'Playlist UUID',
					id: 'pl',
					default: '',
					isVisible: () => false,
				},
				{
					type: 'textinput',
					label: 'Cue UUID',
					id: 'cue',
					default: '',
					isVisible: () => false,
				},
			],
			callback: (feedback) => {
				const cueUuid = (feedback.options.cue as string) || (feedback.options.uuid as string)
				const colorStr = instance.getVariableValue(`cue_${cueUuid}_color`)
				if (typeof colorStr === 'string') {
					return { bgcolor: parseInt(colorStr, 10) }
				}
				return {}
			},
		},
		current_Cue: {
			name: 'PlayList Current Cue',
			type: 'boolean',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'current_Cue',
					type: 'textinput',
					label: 'Cue UUID',
					default: '',
					isVisible: () => false,
				},
				{
					id: 'pl',
					type: 'textinput',
					label: 'Playlist UUID',
					default: '',
					isVisible: () => false,
				},
			],
			callback: (feedback) => {
				const plUuid = feedback.options.pl as string
				const currentCue = feedback.options.current_Cue
				const currentIndex = instance.states[`pl_${plUuid}_currentIndex`]
				if (typeof currentCue === 'number') {
					return currentIndex === currentCue
				}
				if (typeof currentCue !== 'string' || currentCue === '') return false
				const playlist = instance.playLists.find((p) => instance.cleanUUID(p.uuid) === plUuid)
				if (!playlist) return false
				const cueIndex = playlist.cues.findIndex((c) => instance.cleanUUID(c.uuid) === currentCue)
				if (cueIndex === -1) return false
				return currentIndex === cueIndex + 1
			},
		},
		status: {
			name: 'Modulo Player Status',
			type: 'boolean',
			defaultStyle: {
				bgcolor: instance.greenModuloPlayer,
			},
			options: [
				{
					id: 'status',
					type: 'dropdown',
					label: 'Modulo Player Status',
					default: 0,
					choices: [
						{ id: 0, label: 'Offline' },
						{ id: 1, label: 'Launching' },
						{ id: 2, label: 'Online' },
					],
				},
			],
			callback: (feedback) => {
				if (feedback.options.status === instance.states[`status`]) {
					return true
				} else {
					return false
				}
			},
		},
		master: {
			name: 'Modulo Player Master',
			type: 'boolean',
			defaultStyle: {
				text: 'Master',
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'master',
					type: 'number',
					label: 'Master',
					default: 1,
					min: 0,
					max: 1,
					isVisible: () => false,
				},
			],
			callback: async (feedback) => {
				if (feedback.options.master === instance.states[`master`]) {
					return true
				} else {
					return false
				}
			},
		},
		color: {
			name: 'Color Player',
			type: 'advanced',
			options: [],
			callback: () => {
				const colorStr = instance.getVariableValue(`color`)
				if (typeof colorStr === 'string') {
					return {
						bgcolor: instance.getCombineRGBFromHex(colorStr),
					}
				}
				return {}
			},
		},
		fps_ok: {
			name: 'FPS Player',
			type: 'advanced',
			options: [],
			callback: () => {
				const fpsOk = !!instance.getVariableValue(`fpsOk`)
				if (fpsOk) {
					return {
						bgcolor: instance.greenModuloPlayer,
					}
				} else {
					return {
						bgcolor: instance.redModuloPlayer,
					}
				}
			},
		},
		memory_use: {
			name: 'Memory Use',
			type: 'advanced',
			options: [],
			callback: () => {
				const memoryValue = instance.getVariableValue(`memoryUse`)
				let memory: number = NaN
				if (typeof memoryValue === 'number') {
					memory = memoryValue
				} else if (typeof memoryValue === 'string') {
					memory = parseFloat(memoryValue)
				}
				if (!isNaN(memory) && memory < 50) {
					return {
						bgcolor: instance.greenModuloPlayer,
					}
				} else if (!isNaN(memory) && memory <= 90 && memory >= 50) {
					return {
						bgcolor: instance.orangeModuloPlayer,
					}
				} else {
					return {
						bgcolor: instance.redModuloPlayer,
					}
				}
			},
		},
		cpu_use: {
			name: 'CPU Use',
			type: 'advanced',
			options: [],
			callback: () => {
				const cpuValue = instance.getVariableValue(`cpuUse`)
				let cpu: number = NaN
				if (typeof cpuValue === 'number') {
					cpu = cpuValue
				} else if (typeof cpuValue === 'string') {
					cpu = parseFloat(cpuValue)
				}
				if (!isNaN(cpu) && cpu < 50) {
					return {
						bgcolor: instance.greenModuloPlayer,
					}
				} else if (!isNaN(cpu) && cpu <= 90 && cpu >= 50) {
					return {
						bgcolor: instance.orangeModuloPlayer,
					}
				} else {
					return {
						bgcolor: instance.redModuloPlayer,
					}
				}
			},
		},
	})
}
