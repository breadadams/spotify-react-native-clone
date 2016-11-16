'use strict'
import React, { Component } from 'react'
import {
	View,
	Linking
} from 'react-native'

import queryString from 'query-string'
import CookieManager from 'react-native-cookies'

var Buffer = require('buffer/').Buffer

const client_id = 'b8c236abd67a4bf98cb2d3ca1859e093'; // Your client id
const client_secret = 'a3a2d358c1864351a5baaec4f691a3ac'; // Your secret
const redirect_uri = 'spotifyrn:/'; // Your redirect uri
const cookie_domain = 'com.spotifyrn';

const stateKey = 'spotify_auth_state';
const scope = 'user-read-private';

const spotifyAccountURL = 'https://accounts.spotify.com/authorize?'
const spotifyTokenURL = 'https://accounts.spotify.com/api/token'

export default class SpotifyWebApi extends Component {

	static generateRandomString(length) {
		var text = '';
		var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		for (var i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}

	static authenticate() {

		CookieManager.clearAll((err, res) => {
			console.log('cookies cleared, authenticating time!')
		})

		var state = SpotifyWebApi.generateRandomString(16)

		// set a cookie
		CookieManager.set({
			name: stateKey,
			value: state,
			domain: cookie_domain,
			origin: 'spotifyrn',
			path: '/',
			version: '1',
			expiration: '2017-05-30T12:30:00.00-05:00'
		}, (err, res) => {
			console.log('cookie set!');

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
							return Linking.openURL(response.url)
						}
					}).catch(err => console.error(err))
				}
			}).done()
		});	
	}

	static getAccessToken(event, callback) {

		if ( event ) {
			const queryVars = queryString.parse(event.url)

			CookieManager.getAll((err, res) => {
				if ( res[stateKey].value == queryVars.state ) {
			  		CookieManager.clearByName(stateKey, (err, res) => {

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
							console.log('saving token cookies')
					        if ( res.access_token && res.refresh_token ) {
					        	CookieManager.set({
									name: 'access_token',
									value: res.access_token,
									domain: cookie_domain,
									origin: 'spotifyrn',
									path: '/',
									version: '1',
									expiration: '2017-05-30T12:30:00.00-05:00'
								}, () => {
						        	CookieManager.set({
										name: 'refresh_token',
										value: res.refresh_token,
										domain: cookie_domain,
										origin: 'spotifyrn',
										path: '/',
										version: '1',
										expiration: '2017-05-30T12:30:00.00-05:00'
									}, () => {

										var tokens = {
											access_token: res.access_token,
											refresh_token: res.refresh_token,
										}

							        	return callback(tokens)
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
		fetch(spotifyTokenURL, {
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
		        	CookieManager.set({
						name: 'access_token',
						value: res.access_token,
						domain: cookie_domain,
						origin: 'spotifyrn',
						path: '/',
						version: '1',
						expiration: '2017-05-30T12:30:00.00-05:00'
					}, () => {
			        	return callback(res.access_token)
			        })
		        } else {
		        	
		        }
		    }).done()
	}

	static getProfileDetails(accessToken, callback) {

		fetch('https://api.spotify.com/v1/me', {
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
	    }).done()
	}

	static getPlaylists(accessToken) {
		fetch('https://api.spotify.com/v1/me/playlists', {
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
	    }).done()
	}

	static getFeaturedPlaylists(accessToken, countryCode, callback) {
		
		let countryCodeQuery

		if ( countryCode) {
			countryCodeQuery = '?country='+countryCode
		} else {
			countryCodeQuery = '';
		}

		fetch('https://api.spotify.com/v1/browse/featured-playlists' + countryCodeQuery, {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + accessToken
			}
		})
		.then(res => res.json())
		.then(res => {
	        if ( res && callback ) {
	        	return callback(res)
	        }
	    }).done()
	}

	static getCategories(accessToken, callback) {
		fetch('https://api.spotify.com/v1/browse/categories', {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + accessToken
			}
		})
		.then(res => res.json())
		.then(res => {
	        if ( res && callback ) {
	        	return callback(res)
	        }
	    }).done()
	}


}