import * as types from './types'

export function setUserTokens({access_token, refresh_token}) {
	return {
		type: types.SET_USER_TOKENS,
		accessToken: access_token,
		refreshToken: refresh_token,
	}
}