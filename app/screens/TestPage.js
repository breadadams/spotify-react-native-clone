'use strict'
import React, {Component} from 'react'
import {
	View,
	ScrollView,
	Text,
	Linking,
	Image,
	StyleSheet,
	AsyncStorage,
	TouchableOpacity
} from 'react-native'

import { connect } from 'react-redux'
import CookieManager from 'react-native-cookies'
import { Actions } from 'react-native-router-flux'

import SpotifyWebApi from '../services/Spotify'

import PullBlurHeader from '../components/PullBlurHeader'
import MainButton from '../components/MainButton'

class TestPage extends Component {

	constructor() {
		super()
		this.state = {
			name: '',
			img: '',
			headerHeight: 0,
			negativeTopScroll: 0,
		}
	}

	_handleScroll = (event) => {

		if ( event.nativeEvent.contentOffset.y < 0 ) {
			this.setState({negativeTopScroll: event.nativeEvent.contentOffset.y})
		} else {
			if ( this.state.negativeTopScroll !== 0 ) {
				this.setState({negativeTopScroll: 0})
			}

			if ( event.nativeEvent.contentOffset.y > 220 ) {
				Actions.refresh({ navigationBarStyle: {opacity: ((event.nativeEvent.contentOffset.y - 220) / 40)} })
			} else {
				Actions.refresh({ navigationBarStyle: {opacity: 0} })
			}
		}
	}

	_getProfile(accessToken = this.props.accessToken) {
		SpotifyWebApi.getProfileDetails(accessToken)
		.then( res => {
			if ( !res.error ) {
				this.setState({
					name: res.display_name,
					img: res.images[0].url
				}, () => {
					Actions.refresh({title: this.state.name})
				})
			}
		})
	}

	componentWillMount() {
		this._getProfile()
	}

	render() {
		return(
			<ScrollView
				style={{backgroundColor: '#222222'}}
				automaticallyAdjustContentInsets={false}
				scrollEventThrottle={16}
				onScroll={(event) => {this._handleScroll(event)}}>

				{(this.state.img

				? <PullBlurHeader
					title={this.state.name}
					img={this.state.img}
					topScroll={this.state.negativeTopScroll}/>

				: null

				)}

				<MainButton
					label='SHUFFLE PLAY'
					onPress={() => {alert('Button pressed')}}/>

				<View
					style={{paddingTop: 15,}}>

					<Text
						style={{color: 'white'}}>

						<Text
							onPress={() => Actions.splashScreen()}>
							{`Spotify Login \n\n`}
						</Text>


						<Text>{`Access Token: \n`}</Text>
						<Text>{this.props.accessToken + '\n\n'}</Text>
						<Text style={{marginTop: 20,}}>{`Refresh Token: \n`}</Text>
						<Text style={{marginBottom: 400}}>{this.props.refreshToken + '\n'}</Text>
					</Text>

				</View>

				<View style={{height: 500}}>

					<TouchableOpacity
						style={{width: 200, height: 200, backgroundColor: 'green'}}
						onLongPress={() => {console.log('long press!')}}>

					</TouchableOpacity>
				</View>

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

export default connect(mapStateToProps)(TestPage)