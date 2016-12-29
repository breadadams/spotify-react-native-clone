'use strict'
import React, { Component } from 'react'
import {
	View,
	Image,
	StyleSheet,
	Text,
	ProgressViewIOS,
	TouchableOpacity
} from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'

import { ReactNativeAudioStreaming } from 'react-native-audio-streaming'

let currentAudioTrack

class Player extends Component {

	constructor() {
		super()
		this.state = {
			audioFile: 'https://ia802508.us.archive.org/5/items/testmp3testfile/mpthreetest.mp3'
		}
	}

	playAudioTrack(track) {
		console.log('clicked')

		ReactNativeAudioStreaming.play(this.state.audioFile, {showIniOSMediaCenter: true});
	}

	render() {
		return (
			<View
				style={[styles.playerWrap, {
					height: this.props.height,
				}]}>

				<Image
					source={{uri: 'http://resources.wimpmusic.com/images/9444c677/0309/46ce/a238/a6928b1babf6/1280x1280.jpg'}}
					style={styles.playerBg}
					blurRadius={50}/>

				<View
					style={styles.playerHeader}>

					<TouchableOpacity
						style={styles.downArrowWrap}
						activeOpacity={.6}
						onPress={() => this.props.closePlayer()}>
						<Icon
							style={styles.downArrow}
							name='ios-arrow-down'/>
					</TouchableOpacity>

					<View
						style={styles.headerTextWrap}>
						<Text
							style={[styles.headerText, styles.headerTextSmall]}
							numberOfLines={1}>
							{`PLAYING FROM ALBUM \n`}
						</Text>
						<Text
							style={styles.headerText}
							numberOfLines={1}>
							{`If You Can Believe Your Eyes and Ears`}
						</Text>
					</View>

					<View
						style={styles.queueIconWrap}>
						<Icon
							style={styles.queueIcon}
							name='ios-list'/>
					</View>

				</View>

				<View style={{flex: 1}}/>

				<View
					style={{
						zIndex: 3,
						backgroundColor: 'transparent',
						alignItems: 'center',
						paddingVertical: 5,
					}}>
					<TouchableOpacity
						onPress={() => {this.playAudioTrack()}}>
						<Icon
							name='ios-play'
							style={{
								fontSize: 40,
								color: 'white',
							}}/>
					</TouchableOpacity>
				</View>

			</View>
		)
	}
}

const styles = StyleSheet.create({

	playerWrap: {
		paddingBottom: 50,
		backgroundColor: '#000',
		top: 0,
		position: 'absolute',
		left: 0,
		right: 0,
	},

	playerBg: {
		...StyleSheet.absoluteFillObject,
		opacity: .5,
		zIndex: 3
	},

	playerHeader: {
		flexDirection: 'row',
		paddingHorizontal: 15,
		paddingTop: 15,
		alignItems: 'center',
		zIndex: 4,
	},

	downArrowWrap: {
		backgroundColor: 'transparent',
		width: 24,
		alignItems: 'center',
	},

	downArrow: {
		color: 'rgba(255,255,255,.5)',
		fontSize: 22,
		left: -1
	},

	headerTextWrap: {
		flexDirection: 'column',
		flex: 1,
		backgroundColor: 'transparent',
		paddingHorizontal: 35,
	},

	headerText: {
		color: 'rgba(255,255,255,.5)',
		textAlign: 'center',
		fontWeight: '700',
		fontSize: 12,
		lineHeight: 12,
		flex: 1,
	},

	headerTextSmall: {
		fontWeight: '500',
		fontSize: 11,
		marginBottom: -2
	},

	queueIconWrap: {
		backgroundColor: 'transparent',
		width: 24,
		alignItems: 'center',
	},

	queueIcon: {
		color: 'rgba(255,255,255,.5)',
		fontSize: 32,
	},

})


export default Player