import { CompanionVariableValues, combineRgb } from '@companion-module/base/dist/index.js'
import type { MPinstance } from './main.js'

export function UpdateVariableDefinitions(instance: MPinstance): void {
	//instance.log('info', 'VARIABLES DEFINITIONS !')
	// CUES
	const pls: any[] = instance.playLists
	const variables = []
	for (let pl = 0; pl < pls.length; pl++) {
		// CURRENT PL
		const cpl = pls[pl]
		const uuidPL: String = instance.cleanUUID(cpl['uuid'])
		variables.push({ variableId: `pl_${uuidPL}_currentIndex`, name: `${cpl['name']} Current Cue` })
		variables.push({ variableId: `pl_${uuidPL}_grandMasterFader`, name: `${cpl['name']} Grand Master Fader` })
		variables.push({ variableId: `pl_${uuidPL}_audioMaster`, name: `${cpl['name']} Audio Master` })

		// CUES LIST
		const cueslist: any = cpl['cues']
		//instance.log('warn', `VARIABLES DEFINITIONS | GET CUES LIST >>> ${instance.playLists}`)
		for (let cue = 0; cue < cueslist.length; cue++) {
			const c = cueslist[cue]
			const uuidCue: String = instance.cleanUUID(c['uuid'])
			variables.push({ variableId: `cue_${uuidCue}_name`, name: `Cue Name` })
			variables.push({ variableId: `cue_${uuidCue}_color`, name: `Cue Color` })
		}
	}

	// TASKS
	const tls: any[] = instance.tasksList
	for (let tl = 0; tl < tls.length; tl++) {
		let tlUuid: String = instance.cleanUUID(tls[tl]['uuid'])
		//instance.log('warn', `VARIABLES DEFINITIONS | GET TASK NAME >>> ${tlUuid} >>> ${tls[tl]['name']}`)
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
	//instance.log('info', 'INIT VARIABLES DEFINITIONS !')
	// CUES
	const pls: any[] = instance.playLists
	const variables: CompanionVariableValues = {}
	for (let pl = 0; pl < pls.length; pl++) {
		// CURRENT PL
		const cpl = pls[pl]
		// CUES LIST
		const cueslist: any = cpl['cues']
		//instance.log('warn', `VARIABLES DEFINITIONS | GET CUES LIST >>> ${instance.playLists}`)
		for (let cue = 0; cue < cueslist.length; cue++) {
			const c = cueslist[cue]
			const uuidCue: String = instance.cleanUUID(c['uuid'])
			let n = c['name']
			if (n === '') {
				n = `Cue ${cue + 1}`
			}
			const id = `cue_${uuidCue}_name`
			const idColor = `cue_${uuidCue}_color`
			const couleurRgb = instance.getColorFromHex(`${c['uiColor']}`)
			variables[id] = `${n}`
			if (couleurRgb !== null) {
				variables[idColor] = combineRgb(couleurRgb[0], couleurRgb[1], couleurRgb[2]).toString()
			} else {
				variables[idColor] = combineRgb(0, 0, 0).toString()
			}
		}
	}

	// TASKS
	const tls: any[] = instance.tasksList
	for (let tl = 0; tl < tls.length; tl++) {
		const tlUuid: String = instance.cleanUUID(tls[tl]['uuid'])
		const tlName: String = tls[tl]['name']
		//const tlColor: String = tls[tl]['uiColor']
		const id = `tl_${tlUuid}_name`
		const idColor = `tl_${tlUuid}_color`
		const couleurRgb = instance.getColorFromHex(`${tls[tl]['uiColor']}`)
		variables[id] = `${tlName}`
		if (couleurRgb !== null) {
			variables[idColor] = combineRgb(couleurRgb[0], couleurRgb[1], couleurRgb[2]).toString()
		} else {
			variables[idColor] = combineRgb(0, 0, 0).toString()
		}
	}

	instance.setVariableValues(variables)
}
