import createReducer from '../lib/createReducer'
import * as types from '../actions/types'

export const userTokens = createReducer({
	accessToken: null,
	refreshToken: null
},
{
	[types.SET_USER_TOKENS](state, action) {
		return {
			accessToken: action.accessToken,
			refreshToken: action.refreshToken,
		}
	}
})