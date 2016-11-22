'use strict'
import {
	View,
	Linking,
	AsyncStorage
} from 'react-native'

import queryString from 'query-string'

var Buffer = require('buffer/').Buffer

const CLIENT_ID = 'b8c236abd67a4bf98cb2d3ca1859e093'; // Your client id
const CLIENT_SECRET = 'a3a2d358c1864351a5baaec4f691a3ac'; // Your secret
const REDIRECT_URI = 'spotifyrn:/'; // Your redirect uri

const stateKey = 'spotify_auth_state';
const SCOPE = 'user-read-private playlist-read-private user-top-read user-library-read';

const SPOTIFY_API_URL = 'https://api.spotify.com/v1'
const spotifyAccountURL = 'https://accounts.spotify.com/authorize?'
const spotifyTokenURL = 'https://accounts.spotify.com/api/token'

class SpotifyWebApi {

	static headers(accessToken) {

		let headers

		if ( accessToken ) {
			headers = {
				'Authorization': 'Bearer ' + accessToken,
			}
		} else {
			headers = {
				'Accept': 'application/x-www-form-urlencoded',
				'Content-Type':'application/x-www-form-urlencoded',
				'Authorization': 'Basic ' + (new Buffer(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')),
			}
		}

		return headers
	}

	static get(url, route, accessToken) {
		return this.xhr(url, route, null, 'GET', accessToken)
	}

	static xhr(url, route, params, verb, accessToken) {
		const targetUrl = (url ? url : SPOTIFY_API_URL) + route
		let options = Object.assign(
			{ method: verb },
			params ? { body: JSON.stringify(params) } : null
		)
		options.headers = SpotifyWebApi.headers(accessToken)
		return fetch(targetUrl, options).then( resp => {
			let json = resp.json()
			if ( resp.ok ) {
				return json
			}
			return json.then(err => {throw err})
		})
	}

	static _generateRandomString(length) {
		let text = '';
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

		for (let i = 0; i < length; i++) {
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

			let state = SpotifyWebApi._generateRandomString(16);

			// Set spotify_auth_state in AsyncStorage
			AsyncStorage.setItem(stateKey, state, () => {
				fetch(spotifyAccountURL+
					queryString.stringify({
						response_type: 'code',
						client_id: CLIENT_ID,
						scope: SCOPE,
						redirect_uri: REDIRECT_URI,
						state: state
					})
				)
				.then((response) => {
					if ( response.ok ) {
						Linking.canOpenURL(response.url).then(supported => {
							if( supported ) {
								SpotifyWebApi._listenForResponse(callback)
								return Linking.openURL(response.url)
							}
						}).catch(err => console.error(err))
					}
				}).done()
			})
		})
	}

	static _listenForResponse(callback) {
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
								'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
							},
							body: queryString.stringify({
								code: queryVars['spotifyrn:/?code'],
								redirect_uri: REDIRECT_URI,
						        grant_type: 'authorization_code'
							})
						})
						.then(res => res.json())
						.then(res => {
							console.log('saving tokens')
					        if ( res.access_token && res.refresh_token ) {

					        	let tokens = [['access_token', res.access_token], ['refresh_token', res.refresh_token]]

					        	console.log(res)

					        	AsyncStorage.multiSet(tokens, () => {
				        			if ( callback ) {
				        				var tokens = {
											access_token: res.access_token,
											refresh_token: res.refresh_token,
										}

							        	return callback(tokens)
				        			}
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
				'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
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

	static getProfileDetails(accessToken) {
		return this.get(null, '/me/', accessToken)
	}

	// Return users playlists
	static getPlaylists(accessToken) {
	    return this.get(null, '/me/playlists', accessToken)
	}

	// Get users top content (takes artists/tracks as type)
	static getUserTop(accessToken, type = '') {
		return this.get(null, `/me/top${type ? `/${type}` : null}`, accessToken)
	}

	// Get recommendations based on seeds, takes an object with artists, tracks & genres
	static getRecommendations(accessToken, {artists, tracks, genres} = {}) {
		const params = [
			`seed_artists=${artists ? artists : ''}`,
			`seed_genres=${genres ? genres : ''}`,
			`seed_tracks=${tracks ? tracks : ''}`
		].join('&');

		return this.get(null, `/recommendations?${params}`, accessToken)
	}

	// Get featured playlists
	static getFeaturedPlaylists(accessToken, countryCode) {

		let countryCodeQuery = countryCode ? `?country=${countryCode}` : ''

		return this.get(null, `/browse/featured-playlists${countryCodeQuery}`, accessToken)

	}

	// Get new releases, takes optional countryCode 
	static getNewReleases(accessToken, countryCode, limit = 15, offset = 0) {

		this._doesHaveAccessToken(accessToken, 'getNewReleases')

		const params = [
			countryCode ? `country=${countryCode}` : null,
			`limit=${limit}`,
			`offset=${offset}`
		].join('&');

		return this.get(null, `/browse/new-releases?${params}`, accessToken)
	}

	// Get spotify categories
	static getCategories(accessToken) {
		return this.get(null, '/browse/categories', accessToken)
	}

}

export default SpotifyWebApi