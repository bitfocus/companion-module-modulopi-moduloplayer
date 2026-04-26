import { CompanionVariableValues, combineRgb } from '@companion-module/base'
import type { MPinstance } from './main.js'

export function UpdateVariableDefinitions(instance: MPinstance): void {
	const variables = []

	// CUES
	const pls = instance.playLists
	for (const cpl of pls) {
		const uuidPL = instance.cleanUUID(cpl.uuid)
		variables.push({ variableId: `pl_${uuidPL}_currentIndex`, name: `${cpl.name} Current Cue` })
		variables.push({ variableId: `pl_${uuidPL}_grandMasterFader`, name: `${cpl.name} Grand Master Fader` })
		variables.push({ variableId: `pl_${uuidPL}_audioMaster`, name: `${cpl.name} Audio Master` })

		for (const cue of cpl.cues) {
			const uuidCue = instance.cleanUUID(cue.uuid)
			variables.push({ variableId: `cue_${uuidCue}_name`, name: `Cue Name` })
			variables.push({ variableId: `cue_${uuidCue}_color`, name: `Cue Color` })
		}
	}

	// TASKS
	const tls = instance.tasksList
	for (const tl of tls) {
		const tlUuid = instance.cleanUUID(tl.uuid)
		variables.push({ variableId: `tl_${tlUuid}_name`, name: `Task Name` })
		variables.push({ variableId: `tl_${tlUuid}_color`, name: `Task Color` })
	}

	if (instance.sdConnected) {
		// SPYDOG STATIC INFO
		variables.push({ variableId: 'CPU', name: 'CPU' })
		variables.push({ variableId: 'GpuBrand', name: 'GPU Brand' })
		variables.push({ variableId: 'GpuDriver', name: 'GPU Driver' })
		variables.push({ variableId: 'GpuName', name: 'GPU Name' })
		variables.push({ variableId: 'ModuloPlayer', name: 'ModuloPlayer' })
		variables.push({ variableId: 'OS', name: 'OS' })
		variables.push({ variableId: 'processorCount', name: 'Processor Count' })
		variables.push({ variableId: 'totalMemory', name: 'Total Memory' })

		// SPYDOG DYNAMIC INFO
		variables.push({ variableId: 'clusterId', name: 'Cluster Id' })
		variables.push({ variableId: 'color', name: 'Color' })
		variables.push({ variableId: 'cpuTemperature', name: 'CPU Temperature' })
		variables.push({ variableId: 'cpuUse', name: 'CPU Use' })
		variables.push({ variableId: 'detacastTemperature', name: 'Detacast Temperature' })
		variables.push({ variableId: 'fps', name: 'FPS' })
		variables.push({ variableId: 'fpsOk', name: 'FPS Ok' })
		variables.push({ variableId: 'gpuTemperature', name: 'GPU TEMPARATURE' })
		variables.push({ variableId: 'lockStatus', name: 'Lock Status' })
		variables.push({ variableId: 'master', name: 'Master' })
		variables.push({ variableId: 'maxAutocalibOutputs', name: 'Max Autocalib Outputs' })
		variables.push({ variableId: 'maxOutputs', name: 'Max Outputs' })
		variables.push({ variableId: 'memoryUse', name: 'Memory Use' })
		variables.push({ variableId: 'motherboardTemperature', name: 'Motherboard Temperature' })
		variables.push({ variableId: 'serverIp', name: 'Server Ip' })
		variables.push({ variableId: 'serverName', name: 'Server Name' })
		variables.push({ variableId: 'serverTime', name: 'Server Time' })
		variables.push({ variableId: 'status', name: 'Status' })
		variables.push({ variableId: 'upTime', name: 'UP Time' })
	}

	instance.setVariableDefinitions(variables)
}

export function InitVariableDefinitions(instance: MPinstance): void {
	const variables: CompanionVariableValues = {}

	// CUES
	const pls = instance.playLists
	for (const cpl of pls) {
		for (const [cueIndex, cue] of cpl.cues.entries()) {
			const uuidCue = instance.cleanUUID(cue.uuid)
			const name = cue.name !== '' ? cue.name : `Cue ${cueIndex + 1}`
			const couleurRgb = instance.getColorFromHex(cue.uiColor)
			variables[`cue_${uuidCue}_name`] = name
			if (couleurRgb !== null) {
				variables[`cue_${uuidCue}_color`] = combineRgb(couleurRgb[0], couleurRgb[1], couleurRgb[2]).toString()
			} else {
				variables[`cue_${uuidCue}_color`] = combineRgb(0, 0, 0).toString()
			}
		}
	}

	// TASKS
	const tls = instance.tasksList
	for (const tl of tls) {
		const tlUuid = instance.cleanUUID(tl.uuid)
		const couleurRgb = instance.getColorFromHex(tl.uiColor)
		variables[`tl_${tlUuid}_name`] = tl.name
		if (couleurRgb !== null) {
			variables[`tl_${tlUuid}_color`] = combineRgb(couleurRgb[0], couleurRgb[1], couleurRgb[2]).toString()
		} else {
			variables[`tl_${tlUuid}_color`] = combineRgb(0, 0, 0).toString()
		}
	}

	// Restore Spydog values from the states cache (avoids $NA after each updateInstance)
	for (const [key, value] of Object.entries(instance.states)) {
		variables[key] = value
	}
	if (instance.sdConnected && !('detacastTemperature' in instance.states)) {
		variables['detacastTemperature'] = 'No Deltacast'
	}

	instance.setVariableValues(variables)
}
