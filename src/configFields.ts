import { Regex, type SomeCompanionConfigField } from '@companion-module/base'

export interface ModuloPlayConfig {
	host: string
	mpPort: number
	sdPort: number
	sdEnable: boolean
	pollInterval: number
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'static-text',
			id: 'websocket',
			width: 12,
			label: '',
			value: `<h5>Websockets</h5>
			Modulo Player Websockets
			`,
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 8,
			regex: Regex.IP,
		},
		{
			type: 'number',
			id: 'mpPort',
			label: 'Player Port',
			width: 4,
			min: 1,
			max: 65535,
			default: 8080,
		},
				{
			type: 'checkbox',
			id: 'sdEnable',
			label: 'Enable Spydog',
			width: 3,
			default: true,
		},
		{
			type: 'static-text',
			id: 'spacer01',
			label: '',
			width: 5,
			value: '',
		},
		{
			type: 'number',
			id: 'sdPort',
			label: 'Spydog Port',
			width: 4,
			min: 1,
			max: 65535,
			default: 8081,
		},
		{
			type: 'static-text',
			id: 'pollInfo',
			width: 12,
			label: '',
			value: `<h5>Poll Interval warning</h5>
				Adjusting the Polling Interval can impact performance. 
				<br>
				<strong>A lower invterval allows for more responsive feedback, but may impact CPU usage.</strong>
				<br>
				`,
		},
		{
			type: 'number',
			id: 'pollInterval',
			label: 'Polling interval (ms) (default: 250, min: 100, 0 for disabled)',
			width: 12,
			default: 1000,
			min: 0,
			max: 60000,
		},
	]
}
