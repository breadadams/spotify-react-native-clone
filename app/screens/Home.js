'use strict'
import React, {Component} from 'react'
import {
	View,
	ScrollView,
	Text,
	Linking,
	Image,
	StyleSheet,
	AsyncStorage
} from 'react-native'

import { connect } from 'react-redux'
import CookieManager from 'react-native-cookies'
import { Actions } from 'react-native-router-flux'

import SpotifyWebApi from '../services/Spotify'

import PullBlurHeader from '../components/PullBlurHeader'

class Home extends Component {

	constructor() {
		super()
		this.state = {
			name: '',
			img: '',
			headerHeight: 0,
			negativeTopScroll: 0,
		}
	}

	handleScroll = (event) => {

		if ( event.nativeEvent.contentOffset.y < 0 ) {
			this.setState({negativeTopScroll: event.nativeEvent.contentOffset.y})
		} else {
			if ( this.state.negativeTopScroll !== 0 ) {
				this.setState({negativeTopScroll: 0})
			}

			if ( event.nativeEvent.contentOffset.y > (this.state.headerHeight - 200) ) {
				Actions.refresh({ navigationBarStyle: {opacity: (event.nativeEvent.contentOffset.y - (this.state.headerHeight - 104)) / 30} })
			} else {
				Actions.refresh({ navigationBarStyle: {opacity: 0} })
			}
		}
	}

	componentWillMount() {
		// console.log(this.props)
		AsyncStorage.getItem('refresh_token', (err, result) => {
			if (result) {
				console.log('retrieved refresh_token')
				SpotifyWebApi.refreshAccessToken(result, (accessToken) => {
					AsyncStorage.setItem('access_token', accessToken, () => {

						const tokens = {
							access_token: accessToken,
							refresh_token: result
						}

						this.props.setUserTokens(tokens, () => {
							SpotifyWebApi.getProfileDetails(this.state.accessToken, (res) => {
								if ( !res.error ) {
									this.setState({
										name: res.display_name,
										img: res.images[0].url
									}, () => {
										Actions.refresh({title: this.state.name})
									})
								} else {
									// if ( res.error.status === 401 ) {
									// 	SpotifyWebApi.refreshAccessToken(res.refresh_token)
									// }
								}
							})
						})
					})
				})
			}
		})
	}

	render() {
		return(
			<ScrollView
				automaticallyAdjustContentInsets={false}
				scrollEventThrottle={1}
				onScroll={(event) => {this.handleScroll(event)}}>

				{(this.state.img

				? <PullBlurHeader
					title={this.state.name}
					img={this.state.img}
					topScroll={this.state.negativeTopScroll}
					onLayout={(event) => {
						this.setState({headerHeight: event.nativeEvent.layout.height})
					}}/>

				: null

				)}

				<Text
					style={{marginTop: 247}}
					onPress={() => Actions.splashScreen()}>{`Spotify Login`}</Text>

				<Text>ACCESS TOKEN:</Text>
				<Text>{this.props.accessToken}</Text>
				<Text style={{marginTop: 20,}}>REFRESH TOKEN:</Text>
				<Text style={{marginBottom: 400}}>{this.props.refreshToken}</Text>

			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({


})

function mapStateToProps(state) {
	return {
		accessToken: state.userTokens.accessToken,
		refreshToken: state.userTokens.refreshToken
	}
}

export default connect(mapStateToProps)(Home)