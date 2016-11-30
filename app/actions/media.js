import * as types from './types'

export function updateMediaState(bool) {
	return {
		type: types.UPDATE_MEDIA_STATE,
		mediaIsPlaying: bool,
	}
}