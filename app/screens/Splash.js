'use strict'
import React, { Component } from 'react'
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	StyleSheet
} from 'react-native'

import Swiper from 'react-native-swiper'
import Video from 'react-native-video'
import { Actions } from 'react-native-router-flux'

import SpotifyWebApi from '../services/Spotify'

export default class Splash extends Component {

	authorizeUser() {
		SpotifyWebApi.authenticate()
		Actions.homeScreen({type: 'replace'})
	}

	render() {
		return(
			<View
				style={styles.outerWrap}>
				<Video
					source={{uri: 'https://static.videezy.com/system/resources/previews/000/004/969/original/blowing_wind.mp4'}}
					repeat
					style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0}}
					muted={true}
					volume={0}
					resizeMode='cover'/>

				<View
					style={styles.logoWrap}>

					<Image
						style={styles.logo}
						source={require('../images/spotify_logo.png')}/>

				</View>

				<View style={styles.spaceFill}/>

				<Swiper
					height={125}
					style={styles.swiperBg}
					dot={<View style={{backgroundColor: 'rgba(255,255,255,.5)', width: 6, height: 6, borderRadius: 3, marginLeft: 4, marginRight: 4, marginTop: 3, marginBottom: 3}} />}
	         		activeDot={<View style={{backgroundColor: '#fff', width: 6, height: 6, borderRadius: 3, marginLeft: 4, marginRight: 4, marginTop: 3, marginBottom: 3}} />}
	         		autoplay
	         		autoplayTimeout={7.5}>
					<View
						style={styles.swiperItem}>
						<Text
							style={styles.swiperItemTitle}>
							{`Welcome`}
						</Text>
						<Text
							style={styles.swiperItemText}>
							{`Sign up for free music on your phone, tablet and computer.`}
						</Text>
					</View>
					<View
						style={styles.swiperItem}>
						<Text
							style={styles.swiperItemTitle}>
							{`Browse`}
						</Text>
						<Text
							style={styles.swiperItemText}>
							{`Explore top tracks, new releases and the right playlist for every moment.`}
						</Text>
					</View>
					<View
						style={styles.swiperItem}>
						<Text
							style={styles.swiperItemTitle}>
							{`Search`}
						</Text>
						<Text
							style={styles.swiperItemText}>
							{`Looking for that special album or artist? Just search and hit play!`}
						</Text>
					</View>
					<View
						style={styles.swiperItem}>
						<Text
							style={styles.swiperItemTitle}>
							{`Running`}
						</Text>
						<Text
							style={styles.swiperItemText}>
							{`Music that perfectly matches your tempo.`}
						</Text>
					</View>
					<View
						style={styles.swiperItem}>
						<Text
							style={styles.swiperItemTitle}>
							{`Your Library`}
						</Text>
						<Text
							style={styles.swiperItemText}>
							{`Save any song, album or artist to your own music collection.`}
						</Text>
					</View>
				</Swiper>

				<View
					style={styles.buttonsWrap}>
					<TouchableOpacity
						activeOpacity={.8}
						onPress={() => this.authorizeUser()}
						style={styles.button}>
						<Text
							style={styles.buttonLabel}>
							{`LOG IN`}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={.8}
						onPress={() => this.authorizeUser()}
						style={[styles.button, styles.buttonGreen]}>
						<Text
							style={styles.buttonLabel}>
							{`SIGN UP`}
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({

	outerWrap: {
		flex: 1,
		paddingTop: 60,
	},

	logoWrap: {
		alignItems: 'center',
	},

	spaceFill: {
		flex: 1,
	},

	swiperBg: {
		backgroundColor: 'transparent',
	},

	swiperItem: {
		flex: 1,
		alignItems: 'center',
		paddingHorizontal: 45,
	},

	swiperItemTitle: {
		color: 'white',
		fontWeight: 'bold',
		marginBottom: 6,
		fontSize: 20,
	},

	swiperItemText: {
		textAlign: 'center',
		color: 'white',
		fontSize: 15,
		letterSpacing: .5,
		lineHeight: 20,
	},

	buttonsWrap: {
		flexDirection: 'row',
		backgroundColor: 'white',
	},

	button: {
		backgroundColor: '#0a0a0a',
		height: 44,
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
	},

	buttonGreen: {
		backgroundColor: '#1ED760',
	},

	buttonLabel: {
		color: 'white',
		fontSize: 16,
		letterSpacing: .25,
		fontWeight: 'bold',
	},
})