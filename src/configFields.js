const { Regex } = require('@companion-module/base')
module.exports = {
	getConfigFields() {
		return [
			{
				id: 'info',
				type: 'static-text',
				width: 12,
				label: 'Control Information',
				value:
					'This module controls an Modulo Player.  <a href="https://www.modulo-pi.com/media-servers/modulo-player/" target="_new">Product</a>',
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 8,
				regex: Regex.IP,
			},
			{
				id: 'pollinginfo',
				type: 'static-text',
				width: 12,
				label: 'Polling',
				value: 'Polling Interval for presets and actions',
			},
			{
				type: 'number',
				id: 'pollingInterval',
				label: 'Polling Interval (in seconds)',
				width: 3,
				default: 5,
			},
		]
	},
}
