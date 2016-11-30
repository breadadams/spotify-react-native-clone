'use strict'
import React, { Component } from 'react'
import {
	View,
	StyleSheet,
	Text,
	ProgressViewIOS,
	Animated,
	TouchableOpacity
} from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'

class MiniPlayer extends Component {

	render() {
		return (
			<Animated.View
				style={[styles.miniPlayer, {
					opacity: this.props.opacity
				}]}>

				<ProgressViewIOS
					progress={.175}
					progressTintColor='white'
					progressViewStyle={'bar'}
					trackTintColor='grey'/>

				<View
					style={styles.miniPlayerInner}>

					<View
						style={styles.upArrowWrap}>
						<Icon
							style={styles.upArrow}
							name='ios-arrow-up'/>
					</View>

					<View
						style={styles.trackDetails}>
						<Text
							style={styles.title}
							numberOfLines={1}>
							{`${this.props.track} · `}
							<Text
								style={styles.artist}>
								{this.props.artist}
							</Text>
						</Text>
						<Text
							style={styles.playingLocation}>
							<Icon
								name='ios-radio'/>
							{` ${this.props.location}`}
						</Text>
					</View>

					<TouchableOpacity
						activeOpacity={1}
						style={styles.touchableBar}
						onPress={() => this.props.openPlayer()}/>

					<TouchableOpacity
						onPress={() => {this.props.updateMediaState(!this.props.mediaIsPlaying)}}
						style={styles.playBtnWrap}
						activeOpacity={.85}>

						<Icon
							style={styles.playBtn}
							name={this.props.mediaIsPlaying ? 'ios-pause' : 'ios-play'}/>
					</TouchableOpacity>
				</View>

			</Animated.View>
		)
	}
}

const styles = StyleSheet.create({

	miniPlayer: {
		height: 50,
		backgroundColor: 'black',
		alignItems: 'stretch',
		zIndex: 5,
	},

	miniPlayerInner: {
		backgroundColor: 'black',
		alignSelf: 'stretch',
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 10,
		zIndex: 5,
		flex: 1,
	},

	upArrowWrap: {
		width: 30,
		height: 30,
		backgroundColor: 'transparent',
		alignItems: 'center',
		justifyContent: 'center',
	},

	upArrow: {
		color: 'white',
		fontSize: 28,
	},

	trackDetails: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'stretch',
		paddingHorizontal: 10,
	},

	title: {
		color: 'white',
		fontSize: 12,
		fontWeight: '600',
	},

	artist: {
		opacity: .85,
		fontWeight: '500'
	},

	playingLocation: {
		color: 'green',
		fontSize: 11,
		marginTop: 3,
		lineHeight: 15,
	},

	playBtnWrap: {
		width: 30,
		height: 30,
		backgroundColor: 'transparent',
		borderRadius: 15,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: 'white',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 7,
	},

	playBtn: {
		color: 'white',
		fontSize: 20,
		textAlign: 'center',
		top: 1,
		left: 0,
	},

	touchableBar: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'transparent',
		zIndex: 6,
	}

})


export default MiniPlayer