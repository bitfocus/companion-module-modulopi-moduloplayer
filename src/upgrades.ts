import type { CompanionStaticUpgradeScript } from '@companion-module/base'
import type { ModuloPlayConfig } from './configFields.js'

export const UpgradeScripts: CompanionStaticUpgradeScript<ModuloPlayConfig>[] = [
	function (_context, props) {
		const updatedActions = props.actions.map((action) => {
			if (action.actionId !== 'launch_task') return action
			if (typeof action.options.task !== 'string' || action.options.tl !== undefined) return action

			return {
				...action,
				options: {
					...action.options,
					tl: action.options.task,
				},
			}
		})

		const updatedFeedbacks = props.feedbacks.map((feedback) => {
			if (feedback.feedbackId !== 'color_cue') return feedback
			if (typeof feedback.options.uuid !== 'string' || feedback.options.cue !== undefined) return feedback

			return {
				...feedback,
				options: {
					...feedback.options,
					cue: feedback.options.uuid,
				},
			}
		})

		return {
			updatedConfig: null,
			updatedActions,
			updatedFeedbacks,
		}
	},
]
