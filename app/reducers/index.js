import { combineReducers } from 'redux'
import * as userReducer from './user'
import * as mediaReducer from './media'

export default combineReducers(Object.assign(
	userReducer,
	mediaReducer,
))