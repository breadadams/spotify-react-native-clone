import createReducer from '../lib/createReducer'
import * as types from '../actions/types'

export const mediaIsPlaying = createReducer(true,
{
	[types.UPDATE_MEDIA_STATE](state, action) {
		return action.mediaIsPlaying
	}
})