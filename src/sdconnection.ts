import { MPinstance } from './main.js'
//import { InstanceStatus } from '@companion-module/base'

import WebSocket from 'ws'

export class SDconnection {
	instance: MPinstance
	public websocket: WebSocket | undefined | null
	private wsTimeout: NodeJS.Timeout | undefined
	private mpAddr: string | undefined
	private sdPort: any | null
	private readonly reconnectmin = 100
	private readonly reconnectmax = 16_500
	private reconnectinterval = this.reconnectmin
	private shouldBeConnected: boolean

	private pollAPI: NodeJS.Timeout | undefined

	constructor(instance: MPinstance) {
		this.instance = instance
		this.shouldBeConnected = false
	}

	async connect(addr: string | undefined, port: any): Promise<void> {
		this.mpAddr = addr
		this.sdPort = port
		//this.instance!.log('debug', `WEBSOCKET SD CONNECT ${this.mpAddr} ${this.sdPort}`)
		if (this.mpAddr === undefined || this.sdPort == null) return
		this.shouldBeConnected = true

		const urlObj = `ws://${this.mpAddr}:${this.sdPort}`
		if (urlObj === null) return

		//this.instance.updateStatus(InstanceStatus.Connecting, `Init Connection`)

		try {
			const setupMP = async () => {
				this.websocket = new WebSocket(urlObj)

				this.websocket.on('open', async () => {
					this.reconnectinterval = this.reconnectmin
					this.instance!.log('info', 'WEBSOCKET SPYDOG OPENED ' + this.websocket?.readyState)
					this.instance.sdConnected = this.websocket?.readyState === 1
					this.instance.isConnected()
					this.instance.initPolling()
				})

				this.websocket.on('close', (ev: { toString: () => any }) => {
					this.instance.sdConnected = this.websocket?.readyState === 1
					this.instance.isConnected()
					console.log(
						'ws closed',
						ev.toString(),
						this.shouldBeConnected ? 'should be connected' : 'should not be connected',
					)
					if (this.shouldBeConnected) {
						//this.instance.updateStatus(InstanceStatus.Disconnected)
						if (this.wsTimeout) clearTimeout(this.wsTimeout)
						this.wsTimeout = setTimeout(() => {
							this.connect(this.mpAddr, this.sdPort)
						}, this.reconnectinterval)
						this.reconnectinterval *= 1.2
						if (this.reconnectinterval > this.reconnectmax) this.reconnectinterval = this.reconnectmax
					}
				})

				this.websocket.on('error', (error: string) => {
					this.instance.log('error', 'Socket ' + error)
					this.instance.log('error', 'Check if Modulo Spydog is started ?')
					this.instance.sdConnected = this.websocket?.readyState === 1
					this.instance.isConnected()
				})

				this.websocket.on('message', (data: { toString: () => string }) => {
					//this.instance.log('debug', 'INCOMMING SPYDOG MESSAGE ' + data.toString())
					this.instance.spydog?.messageManager(data.toString())
				})
			}

			await setupMP()
		} catch (error) {
			this.disconnect()
			if (this.wsTimeout) clearTimeout(this.wsTimeout)
			this.wsTimeout = setTimeout(() => {
				this.connect(this.mpAddr, this.sdPort)
			}, this.reconnectinterval)
			this.reconnectinterval *= 1.2
			if (this.reconnectinterval > this.reconnectmax) this.reconnectinterval = this.reconnectmax
		}
	}

	sendJsonMessage(message: String) {
		if (this.websocket?.readyState === 1 && message !== '') {
			this.websocket?.send(message)
			//this.instance.log('debug', 'SPYDOD | SENDING WS MESSAGE LAUNCH TASK ' + this.websocket.url + ' ' + message)
		}
	}

	disconnect(): void {
		clearTimeout(this.wsTimeout)
		if (this.pollAPI !== undefined) {
			clearInterval(this.pollAPI)
		}
		this.shouldBeConnected = false
		this.websocket?.close()
		this.instance.sdConnected = false
		this.instance.isConnected()
	}

	destroy(): void {
		clearTimeout(this.wsTimeout)
		if (this.pollAPI !== undefined) {
			clearInterval(this.pollAPI)
		}
		this.shouldBeConnected = false
		this.websocket = null
		this.instance.sdConnected = false
		this.instance.isConnected()
	}
}
