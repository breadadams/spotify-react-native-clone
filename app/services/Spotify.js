'use strict'
import {
	View,
	Linking,
	AsyncStorage
} from 'react-native'

import queryString from 'query-string'

var Buffer = require('buffer/').Buffer

const client_id = 'b8c236abd67a4bf98cb2d3ca1859e093'; // Your client id
const client_secret = 'a3a2d358c1864351a5baaec4f691a3ac'; // Your secret
const redirect_uri = 'spotifyrn:/'; // Your redirect uri
const cookie_domain = 'com.spotifyrn';

const stateKey = 'spotify_auth_state';
const scope = 'user-read-private';

const spotifyAccountURL = 'https://accounts.spotify.com/authorize?'
const spotifyTokenURL = 'https://accounts.spotify.com/api/token'

class SpotifyWebApi {

	static generateRandomString(length) {
		var text = '';
		var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		for (var i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}

	static authenticate(callback) {

		const keysToRemove = [
			stateKey,
			'access_token',
			'refresh_token'
		]

		AsyncStorage.multiRemove(keysToRemove, (err) => {

			var state = SpotifyWebApi.generateRandomString(16)

			// Set spotify_auth_state in AsyncStorage
			AsyncStorage.setItem(stateKey, state, () => {
				fetch(spotifyAccountURL+
					queryString.stringify({
						response_type: 'code',
						client_id: client_id,
						scope: scope,
						redirect_uri: redirect_uri,
						state: state
					})
				)
				.then((response) => {
					if ( response.ok ) {
						Linking.canOpenURL(response.url).then(supported => {
							if( supported ) {
								SpotifyWebApi.listenForResponse(callback)
								return Linking.openURL(response.url)
							}
						}).catch(err => console.error(err))
					}
				}).done()
			})
		})
	}

	static listenForResponse(callback) {
		Linking.addEventListener('url', (event) => {
			if ( event.url ) {
				SpotifyWebApi.getAccessTokenFromScheme(event, (tokens) => {
					if ( callback && tokens ) {
						return callback(tokens)
					}
				})
			}
		});
	}

	static getAccessTokenFromScheme(event, callback) {

		if ( event ) {
			const queryVars = queryString.parse(event.url)

			AsyncStorage.getItem(stateKey, (err, result) => {
				if ( result == queryVars.state ) {
					AsyncStorage.removeItem(stateKey, (err, result) => {
						fetch(spotifyTokenURL, {
							method: 'POST',
							headers: {
								'Content-Type':'application/x-www-form-urlencoded',
								'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
							},
							body: queryString.stringify({
								code: queryVars['spotifyrn:/?code'],
								redirect_uri: redirect_uri,
						        grant_type: 'authorization_code'
							})
						})
						.then(res => res.json())
						.then(res => {
							console.log('saving tokens')
					        if ( res.access_token && res.refresh_token ) {
					        	AsyncStorage.setItem('access_token', res.access_token, () => {
					        		AsyncStorage.setItem('refresh_token', res.refresh_token, () => {
					        			if ( callback ) {
					        				var tokens = {
												access_token: res.access_token,
												refresh_token: res.refresh_token,
											}

								        	return callback(tokens)
					        			}
					        		})
					        	})
					        }
					    }).done()
				    })
				} else {
			  		// Do something ???
			  	}
			})

		} else {
			console.log('no scheme content yet')
		}
	}

	static refreshAccessToken(refreshToken, callback) {
		return fetch(spotifyTokenURL, {
			method: 'POST',
			headers: {
				'Content-Type':'application/x-www-form-urlencoded',
				'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
			},
			body: queryString.stringify({
		        grant_type: 'refresh_token',
		        refresh_token: refreshToken,
			})
		})
		.then(res => res.json())
		.then(res => {
			console.log('getting new access token')
	        if ( res.access_token ) {
	        	AsyncStorage.setItem('access_token', res.access_token, () => {
		        	if ( callback ) {
		        		return callback(res.access_token)
		        	}
		        })
	        } else {
	        	// No access token returned
	        }
	    })
	}

	static getProfileDetails(accessToken, callback) {

		return fetch('https://api.spotify.com/v1/me', {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + accessToken
			},
		})
		.then(res => res.json())
		.then(res => {
	        if ( res && callback ) {
	        	return callback(res)
			}    	
	    })
	}

	static getPlaylists(accessToken) {
		return fetch('https://api.spotify.com/v1/me/playlists', {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + accessToken
			},
		})
		.then(res => res.json())
		.then(res => {
	        if ( res ) {
	        	console.log(res)
	        }
	    })
	}

	static getFeaturedPlaylists(accessToken, countryCode, callback) {
		
		let countryCodeQuery

		if ( countryCode) {
			countryCodeQuery = '?country='+countryCode
		} else {
			countryCodeQuery = '';
		}

		return fetch('https://api.spotify.com/v1/browse/featured-playlists' + countryCodeQuery, {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + accessToken
			}
		})
		.then(res => res.json())
		.then(res => {
	        if ( res && callback ) {
	        	callback(res)
	        }
	    })
	}

	static getCategories(accessToken, callback) {
		return fetch('https://api.spotify.com/v1/browse/categories', {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + accessToken
			}
		})
		.then(res => res.json())
		.then(res => {
	        if ( res && callback ) {
	        	callback(res)
	        }
	    })
	}

}

export default SpotifyWebApi