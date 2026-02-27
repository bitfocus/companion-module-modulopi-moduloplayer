import WebSocket from 'ws'
import type { MPinstance } from './main.js'
import type { OnConnectedCallback, OnMessageCallback } from './types.js'

export class WSConnection {
	private readonly instance: MPinstance
	private readonly label: string
	private readonly onConnectedCb: OnConnectedCallback
	private readonly onMessageCb: OnMessageCallback

	public websocket: WebSocket | undefined | null
	private wsTimeout: NodeJS.Timeout | undefined
	private addr: string | undefined
	private port: number | undefined
	private readonly reconnectmin = 100
	private readonly reconnectmax = 16_500
	private reconnectinterval = this.reconnectmin
	private shouldBeConnected = false

	constructor(
		instance: MPinstance,
		label: string,
		onConnected: OnConnectedCallback,
		onMessage: OnMessageCallback,
	) {
		this.instance = instance
		this.label = label
		this.onConnectedCb = onConnected
		this.onMessageCb = onMessage
	}

	async connect(addr: string | undefined, port: number | undefined): Promise<void> {
		this.addr = addr
		this.port = port
		if (this.addr === undefined || this.port === undefined) return
		this.shouldBeConnected = true

		const url = `ws://${this.addr}:${this.port}`

		try {
			this.websocket = new WebSocket(url)

			this.websocket.on('open', () => {
				this.reconnectinterval = this.reconnectmin
				this.instance.log('info', `WEBSOCKET ${this.label} OPENED ${this.websocket?.readyState}`)
				this.onConnectedCb(this.websocket?.readyState === WebSocket.OPEN)
			})

			this.websocket.on('close', (ev: { toString: () => string }) => {
				this.onConnectedCb(false)
				this.instance.log(
					'debug',
					`WEBSOCKET ${this.label} CLOSED — ${ev.toString()} — ${this.shouldBeConnected ? 'should reconnect' : 'intentional'}`,
				)
				if (this.shouldBeConnected) {
					this.scheduleReconnect()
				}
			})

			this.websocket.on('error', (error: Error) => {
				this.instance.log('error', `WEBSOCKET ${this.label} ERROR — ${error.message}`)
				this.onConnectedCb(false)
			})

			this.websocket.on('message', (data: { toString: () => string }) => {
				this.onMessageCb(data.toString())
			})
		} catch (error) {
			this.disconnect()
			this.scheduleReconnect()
		}
	}

	sendJsonMessage(message: string): void {
		if (this.websocket?.readyState === WebSocket.OPEN && message !== '') {
			this.websocket.send(message)
		}
	}

	disconnect(): void {
		if (this.wsTimeout) clearTimeout(this.wsTimeout)
		this.shouldBeConnected = false
		this.websocket?.close()
		this.onConnectedCb(false)
	}

	destroy(): void {
		if (this.wsTimeout) clearTimeout(this.wsTimeout)
		this.shouldBeConnected = false
		this.websocket = null
		this.onConnectedCb(false)
		this.instance.log('debug', `WEBSOCKET ${this.label} destroyed`)
	}

	private scheduleReconnect(): void {
		if (this.wsTimeout) clearTimeout(this.wsTimeout)
		this.wsTimeout = setTimeout(() => {
			void this.connect(this.addr, this.port)
		}, this.reconnectinterval)
		this.reconnectinterval = Math.min(this.reconnectinterval * 1.2, this.reconnectmax)
	}
}
