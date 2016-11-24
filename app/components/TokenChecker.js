'use strict'
import React, { Component } from 'react'
import {
	AsyncStorage
} from 'react-native'

import { Actions } from 'react-native-router-flux'

import SpotifyWebApi from '../services/Spotify'

export default class TokenChecker extends Component {

	static checkTokenExists(setTokens, callback) {

		console.log('**CHECKING TOKEN EXISTS**')

		let storageItemKeys = ['access_token', 'refresh_token', 'access_token_expiry']

		AsyncStorage.multiGet(storageItemKeys, (err, res) => {

			let storageItems = {}
			let tokens = {}

			if ( res ) {

				res.map((result) => {
					storageItems[ result[0] ] = result[1]
				})

				if ( storageItems.access_token && storageItems.refresh_token && storageItems.access_token_expiry ) {

					let expiryDate = parseInt(storageItems.access_token_expiry);
					let currentTime = new Date().getTime() / 1000;

					if ( currentTime >= expiryDate ) {
						SpotifyWebApi.refreshAccessToken(storageItems.refresh_token, (accessToken) => {
							AsyncStorage.setItem('access_token', accessToken, () => {

								tokens.access_token = accessToken
								tokens.refresh_token = storageItems.refresh_token

								setTokens(tokens)

								if ( callback ) {
									return callback()
								}
							})
						})
					} else {

						tokens.access_token = storageItems.access_token,
						tokens.refresh_token = storageItems.refresh_token,

						setTokens(tokens)

						if ( callback ) {
							return callback()
						}
					}
				} else {
					Actions.splashScreen()
				}
			} else {
				Actions.splashScreen()
			}
		})
	}

	render() {
		return null
	}
}