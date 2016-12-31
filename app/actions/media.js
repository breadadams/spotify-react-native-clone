import * as types from './types'

export function updateMediaState(bool) {
	return {
		type: types.UPDATE_MEDIA_STATE,
		mediaIsPlaying: bool,
	}
}

export function updateTrackQueue(newItems = {}, currentQueue = {}) {

	// console.log(newItems)

	// const newItemsArray = Array.from(newItems)

	// console.log(newItemsArray)

	const newQueue = []

	newItems.map(newItem => {
		newQueue.push(newItem)
	})

	currentQueue.map((queueItem, i) => {
		i == 0 ? '' : newQueue.push(queueItem)
	})

	console.log(newQueue)

	return {
		type: types.UPDATE_TRACK_QUEUE,
		trackQueue: newQueue
	}
}