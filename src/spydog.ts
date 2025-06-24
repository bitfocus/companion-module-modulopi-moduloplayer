import { MPinstance } from './main.js'

// JSON ID
// 200 = SPYDOG DYNAMIC INFO
// 201 = SPYDOG STATIC INFO

export class SpyDog {
	instance: MPinstance

	constructor(instance: MPinstance) {
		this.instance = instance
	}

	public messageManager(data: String): void {
		const datas = JSON.parse(data.toString())
		//this.instance.log('debug', 'MODULO SPYDOG  | MESSAGE MANAGER | DATA ID >>> ' + datas['id'])
		if (datas['id'] == 200) {
			this.setDynamicInfo(datas['result'])
		} else if (datas['id'] == 201) {
			this.setStaticInfo(datas['result'])
		}
	}

	async getStaticInfo() {
		//this.instance.log('info', 'SPYDOG | GET STATIC INFO')
		var m = `{"jsonrpc":"2.0", "method":"get.computer.static.info", "id": ${201}}`
		this.instance.sdConnection.sendJsonMessage(m)
	}

	async getDynamicInfo() {
		//this.instance.log('info', 'SPYDOG | GET DYNAMIC INFO')
		var m = `{"jsonrpc":"2.0", "method":"get.computer.dynamic.info", "id": ${200}}`
		this.instance.sdConnection.sendJsonMessage(m)
	}

	async setStaticInfo(objs: any) {
		this.instance.staticInfo = objs[0]
		for (var key in objs[0]) {
			// this.instance.log(
			// 	'info',
			// 	`MODULO SPYDOG | SET STATIC INFO | ELEMENTS >>> ${key}: ${objs[0][key]} ${typeof objs[0][key]}`,
			// )
			var objTemp: any = {}
			if (typeof objs[0][key] === 'number') {
				objTemp = { [`${key}`]: parseInt(objs[0][key]) }
			} else {
				objTemp = { [`${key}`]: objs[0][key] }
			}
			this.instance.states[`${key}`] = objs[0][key]
			this.instance.setVariableValues(objTemp)
			this.instance.checkFeedbacks(`${key}`)
		}
		this.instance.updateInstance()
	}

	async setDynamicInfo(objs: any) {
		this.instance.dynamicInfo = objs[0]
		for (var key in objs[0]) {
			// this.instance.log(
			// 	'info',
			// 	`MODULO SPYDOG | SET DYNAMIC INFO | ELEMENTS >>> ${key}: ${objs[0][key]} ${typeof objs[0][key]}`,
			// )
			var objTemp: any = {}
			if (typeof objs[0][key] === 'number') {
				objTemp = { [`${key}`]: parseInt(objs[0][key]) }
			} else {
				objTemp = { [`${key}`]: objs[0][key] }
			}

			if (`${key}` === 'color') {
				this.instance.states[`${key}`] = objs[0][key]
			} else {
				this.instance.states[`${key}`] = objs[0][key]
			}
			this.instance.setVariableValues(objTemp)
			this.instance.checkFeedbacks(`${key}`)
		}
	}
}
