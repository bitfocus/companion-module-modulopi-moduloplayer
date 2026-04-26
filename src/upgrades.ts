import type {
	CompanionStaticUpgradeScript,
	CompanionUpgradeContext,
	CompanionStaticUpgradeProps,
	CompanionStaticUpgradeResult,
} from '@companion-module/base'
import type { ModuloPlayConfig } from './configFields.js'

export const UpgradeScripts: CompanionStaticUpgradeScript<ModuloPlayConfig>[] = [
	// v4.0.x → v4.1.x: migrate launch_task and color_cue to UUID-based options
	function (
		_context: CompanionUpgradeContext<ModuloPlayConfig>,
		props: CompanionStaticUpgradeProps<ModuloPlayConfig>,
	): CompanionStaticUpgradeResult<ModuloPlayConfig> {
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

	// v4.1.0 → v4.1.1: current_Cue feedback changed from numeric index to UUID string.
	// A numeric index cannot be converted to a UUID without live playlist data,
	// so old feedbacks are reset to empty — the user must reconfigure them.
	function (
		_context: CompanionUpgradeContext<ModuloPlayConfig>,
		props: CompanionStaticUpgradeProps<ModuloPlayConfig>,
	): CompanionStaticUpgradeResult<ModuloPlayConfig> {
		const updatedFeedbacks = props.feedbacks.map((feedback) => {
			if (feedback.feedbackId !== 'current_Cue') return feedback
			if (typeof feedback.options.current_Cue !== 'number') return feedback

			return {
				...feedback,
				options: {
					...feedback.options,
					current_Cue: '',
					pl: '',
				},
			}
		})

		return {
			updatedConfig: null,
			updatedActions: props.actions,
			updatedFeedbacks,
		}
	},
]
