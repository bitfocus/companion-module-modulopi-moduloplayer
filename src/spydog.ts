import { MPinstance } from './main.js'
import { RPC_ID, msgSpydogStaticInfo, msgSpydogDynamicInfo, msgComputerAction } from './messages.js'
import type { SpydogStaticInfo, SpydogDynamicInfo } from './types.js'

interface RpcResponse {
	id: number
	result: unknown
}

export class SpyDog {
	instance: MPinstance

	constructor(instance: MPinstance) {
		this.instance = instance
	}

	public messageManager(data: string): void {
		const datas = JSON.parse(data) as RpcResponse
		if (datas.id === RPC_ID.SPYDOG_DYNAMIC_INFO) {
			void this.setDynamicInfo(datas.result as [SpydogDynamicInfo])
		} else if (datas.id === RPC_ID.SPYDOG_STATIC_INFO) {
			void this.setStaticInfo(datas.result as [SpydogStaticInfo])
		}
	}

	async setStaticInfo(objs: [SpydogStaticInfo]): Promise<void> {
		const info = objs[0]
		if (!info) return
		this.instance.staticInfo = info
		for (const key of Object.keys(info) as (keyof SpydogStaticInfo)[]) {
			const raw = info[key]
			const value = typeof raw === 'number' ? raw : raw
			this.instance.states[key] = value
			this.instance.setVariableValues({ [key]: value })
			this.instance.checkFeedbacks(key)
		}
		this.instance.updateInstance()
	}

	async setDynamicInfo(objs: [SpydogDynamicInfo]): Promise<void> {
		const info = objs[0]
		if (!info) return
		this.instance.dynamicInfo = info
		for (const key of Object.keys(info) as (keyof SpydogDynamicInfo)[]) {
			const raw = info[key]
			const value =
				key === 'detacastTemperature' && (raw === null || raw === undefined || (typeof raw === 'number' && raw < 0))
					? 'No Deltacast'
					: raw
			if (this.instance.states[key] === value) continue
			this.instance.states[key] = value
			this.instance.setVariableValues({ [key]: value })
			this.instance.checkFeedbacks(key)
		}
		// If detacastTemperature is absent from the response (no Deltacast hardware)
		if (!('detacastTemperature' in info)) {
			const v = 'No Deltacast'
			if (this.instance.states['detacastTemperature'] !== v) {
				this.instance.states['detacastTemperature'] = v
				this.instance.setVariableValues({ detacastTemperature: v })
			}
		}
	}

	// SEND INFOS

	sendStaticInfo(): void {
		this.instance.sdConnection.sendJsonMessage(msgSpydogStaticInfo())
	}

	sendDynamicInfo(): void {
		this.instance.sdConnection.sendJsonMessage(msgSpydogDynamicInfo())
	}

	// SEND DOACTIONS

	sendStartModuloPlayer(): void {
		this.instance.sdConnection.sendJsonMessage(msgComputerAction('startModuloPlayer'))
	}

	sendStopModuloPlayer(): void {
		this.instance.sdConnection.sendJsonMessage(msgComputerAction('stopModuloPlayer'))
	}

	sendRebootComputer(): void {
		this.instance.sdConnection.sendJsonMessage(msgComputerAction('rebootComputer'))
	}

	sendPowerOffComputer(): void {
		this.instance.sdConnection.sendJsonMessage(msgComputerAction('powerOffComputer'))
	}
}
