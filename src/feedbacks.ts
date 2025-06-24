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
					label: 'UUID',
					id: 'uuid',
					default: '',
					isVisible: () => false,
				},
			],
			callback: (feedback) => {
				const uuid = feedback.options.uuid
				const colorStr = instance.getVariableValue(`tl_${uuid}_color`) // string "16750848"
				if (typeof colorStr === 'string') {
					const bgColor = parseInt(colorStr, 10)
					return {
						bgcolor: bgColor,
					}
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
					label: 'UUID',
					id: 'uuid',
					default: '',
					isVisible: () => false,
				},
			],
			callback: (feedback) => {
				const uuid = feedback.options.uuid
				const colorStr = instance.getVariableValue(`cue_${uuid}_color`) // string "16750848"
				if (typeof colorStr === 'string') {
					const bgColor = parseInt(colorStr, 10)
					return {
						bgcolor: bgColor,
					}
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
					type: 'number',
					label: 'ID',
					default: 1,
					min: 1,
					max: 10000,
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
				if (instance.states[`pl_${feedback.options.pl}_currentIndex`] === feedback.options.current_Cue) {
					return true
				} else {
					return false
				}
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
