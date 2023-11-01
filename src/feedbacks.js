const { combineRgb } = require('@companion-module/base')

module.exports = async function (self) {
	self.setFeedbackDefinitions({
		current_Cue: {
			name: 'PlayList Current Cue',
			type: 'boolean',
			label: 'PlayList Current Cue Change',
			defaultStyle: {
				bgcolor: combineRgb(0, 0, 0),
				color: combineRgb(255, 255, 255),
			},
			options: [
				{
					id: 'current_Cue',
					type: 'number',
					label: 'ID',
					default: 1,
				},
                {
                    id: 'pl',
                    type: 'number',
                    label: 'Playlist ID',
                    default: 1,
                },
			],
			callback: (feedback) => {
				//console.log('FEEDBACK | Current Cue ID Change State: ' + self.moduloPlayerData.states[`pl_${feedback.options.pl}_currentIndex`] + " / id: " + feedback.options.current_Cue)
				if ( self.moduloPlayerData.states[`pl_${feedback.options.pl}_currentIndex`] === feedback.options.current_Cue) {
					return true
				}
			},
		},
	})
}