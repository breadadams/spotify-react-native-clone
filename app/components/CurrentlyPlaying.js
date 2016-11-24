'use strict'
import React, { Component } from 'react'
import {
	View,
	StyleSheet,
	Text,
	ProgressViewIOS,
	PanResponder,
	Animated,
	Dimensions,
	Image,
	StatusBar
} from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'
import { Actions } from 'react-native-router-flux'

let currentPlaying = {
	track: 'California Dreamin\'',
	artist: 'The Mamas & The Papas',
	location: 'BRADMACBOOKPRO'
}

const SCREEN_HEIGHT = Dimensions.get('window').height
const TOP_COORD = SCREEN_HEIGHT - 100
const SLIDE_DOWN_THRESHOLD = (TOP_COORD - 180) * -1
const SLIDE_UP_THRESHOLD = -150


class CurrentlyPlaying extends Component {

	constructor() {
		super()
		this.state = {
			draggedUp: new Animated.Value(0),
			draggedLocation: 0,
			miniPlayerOpacity: new Animated.Value(1),
			navbarOpacity: new Animated.Value(1),
		}
	}

	componentWillMount() {

		this.state.navbarOpacity.addListener(({value}) => {
			Actions.refresh({ navigationBarStyle: {opacity: value} })

			if ( value == 0 ) {
				Actions.refresh({ hideNavBar: true })
			} else {
				Actions.refresh({ hideNavBar: false })
			}
		})

		this._panResponder = PanResponder.create({
			// Ask to be the responder:
			onStartShouldSetPanResponder: (evt, gestureState) => true,
			onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
			onMoveShouldSetPanResponder: (evt, gestureState) => true,
			onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

			onPanResponderGrant: (evt, gestureState) => {
				// The guesture has started. Show visual feedback so the user knows
				// what is happening!

				// gestureState.d{x,y} will be set to zero now
				// console.log(gestureState)
			},
			onPanResponderMove: (evt, gestureState) => {

				let dragPosition, dragUpAmount, miniPlayerOpacity

				let dragDistance = this.state.draggedLocation + gestureState.dy

				let pullUpAmount

				if ( (dragDistance * -1) >= TOP_COORD ) {
					pullUpAmount = TOP_COORD * -1
				} else if ( dragDistance < 0) {
					pullUpAmount = dragDistance
					this.state.miniPlayerOpacity.setValue( gestureState.dy > 0 ? gestureState.dy/400 : ( 1 - gestureState.dy/-100));
				} else {
					pullUpAmount = 0
				}

				this.state.draggedUp.setValue(pullUpAmount);

			},
			onPanResponderTerminationRequest: (evt, gestureState) => true,
			onPanResponderRelease: (evt, gestureState) => {
				// The user has released all touches while this view is the
				// responder. This typically means a gesture has succeeded

				let dragPosition, dragUpAmount, miniPlayerOpacity;

				dragPosition = this.state.draggedLocation + gestureState.dy

				// If we've dragged DOWN
				if ( gestureState.dy > 0 ) {

					// If velocity is larger than 1, use it to calculate a new dragPosition
					dragPosition = (gestureState.vy > 1) ? (dragPosition - (dragPosition * gestureState.vy)) : dragPosition

					// If we've reached the threshold
					if ( dragPosition > SLIDE_DOWN_THRESHOLD) {
						// Slide back to bottom and fade miniplayer in
						dragUpAmount = 0
						miniPlayerOpacity = 1
					} else {
						// Slide back to top and fade miniplayer out
						dragUpAmount = TOP_COORD * -1
						miniPlayerOpacity = 0
					}

				// Else if we've dragged UP
				} else {

					// If velocity is less than -1, use it to calculate a new dragPosition
					dragPosition = (gestureState.vy < -1) ? (dragPosition * (gestureState.vy * -1)) : dragPosition

					// If we've reached the threshold
					if ( dragPosition < SLIDE_UP_THRESHOLD) {
						// Slide to top and fade mini player out
						dragUpAmount = TOP_COORD * -1
						miniPlayerOpacity = 0
					} else {
						// Slide back to bottom and fade miniplayer in
						dragUpAmount = 0
						miniPlayerOpacity = 1
					}

				}

				Animated.parallel([
					Animated.timing(
						this.state.draggedUp,
						{
							duration: 350,
							toValue: dragUpAmount
						}
					),
					Animated.timing(
						this.state.miniPlayerOpacity,
						{
							duration: 300,
							toValue: miniPlayerOpacity
						}
					)
				]).start(() => {
					
					Animated.timing(
						this.state.navbarOpacity,
						{
							duration: 100,
							toValue: miniPlayerOpacity
						}
					).start()

					StatusBar.setHidden(!+miniPlayerOpacity, 'slide')

					this.setState({
						draggedLocation: dragUpAmount
					})
				})

			},
			onPanResponderTerminate: (evt, gestureState) => {
				// Another component has become the responder, so this gesture
				// should be cancelled
			}
		})

	}

	render() {
		return (
			<Animated.View
				style={[styles.currentlyPlayingOuter, {
					transform: [{
						translateY: this.state.draggedUp
					}]
				}]}
				{...this._panResponder.panHandlers}>

				<Animated.View
					style={[styles.currentlyPlayingMini, {
						opacity: this.state.miniPlayerOpacity
					}]}>

					<ProgressViewIOS
						progress={.175}
						progressTintColor='white'
						progressViewStyle={'bar'}
						trackTintColor='grey'/>

					<View
						style={styles.currentlyPlayingInner}>

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
								{`${currentPlaying.track} · `}
								<Text
									style={styles.artist}>
									{currentPlaying.artist}
								</Text>
							</Text>
							<Text
								style={styles.playingLocation}>
								<Icon
									name='ios-radio'/>
								{` ${currentPlaying.location}`}
							</Text>
						</View>

						<View
							style={styles.playBtnWrap}>

							<Icon
								style={styles.playBtn}
								name='ios-pause'/>
						</View>
					</View>

				</Animated.View>

				<View
					style={{
						height: SCREEN_HEIGHT,
						backgroundColor: '#222',
						top: 0,
						position: 'absolute',
						left: 0,
						right: 0
					}}>

					<Image
						source={{uri: 'http://resources.wimpmusic.com/images/9444c677/0309/46ce/a238/a6928b1babf6/1280x1280.jpg'}}
						style={StyleSheet.absoluteFill}
						blurRadius={50}/>


				</View>

			</Animated.View>
		)
	}
}

const styles = StyleSheet.create({

	currentlyPlayingOuter: {
		height: 50,
		backgroundColor: 'black',
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
	},

	currentlyPlayingMini: {
		height: 50,
		backgroundColor: 'black',
		alignItems: 'stretch',
		zIndex: 5,
	},

	currentlyPlayingInner: {
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
	},

	playBtn: {
		color: 'white',
		fontSize: 20,
		textAlign: 'center',
		top: 1,
		left: 0,
	},

})

export default CurrentlyPlaying