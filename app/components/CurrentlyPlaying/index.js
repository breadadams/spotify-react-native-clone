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
	StatusBar,
	TouchableOpacity
} from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'
import { Actions } from 'react-native-router-flux'

import MiniPlayer from './MiniPlayer'
import Player from './Player'

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
			playerInView: false,
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
			onMoveShouldSetPanResponder: (evt, gestureState) => true,
			onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

			onPanResponderGrant: (evt, gestureState) => {
				// The guesture has started. Show visual feedback so the user knows
				// what is happening!

				// gestureState.d{x,y} will be set to zero now
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

				let dragPosition, togglePlayer

				dragPosition = this.state.draggedLocation + gestureState.dy

				// If we've dragged DOWN
				if ( gestureState.dy > 0 ) {

					// If velocity is larger than 1, use it to calculate a new dragPosition
					dragPosition = (gestureState.vy > 1) ? (dragPosition - (dragPosition * gestureState.vy)) : dragPosition

					// If we've reached the threshold
					if ( dragPosition > SLIDE_DOWN_THRESHOLD) {
						// Slide back to bottom and fade miniplayer in
						togglePlayer = false
					} else {
						// Slide back to top and fade miniplayer out
						togglePlayer = true
					}

				// Else if we've dragged UP
				} else {

					// If velocity is less than -1, use it to calculate a new dragPosition
					dragPosition = (gestureState.vy < -1) ? (dragPosition * (gestureState.vy * -1)) : dragPosition

					// If we've reached the threshold
					if ( dragPosition < SLIDE_UP_THRESHOLD) {
						// Slide to top and fade mini player out
						togglePlayer = true
					} else {
						// Slide back to bottom and fade miniplayer in
						togglePlayer = false
					}

				}

				this.togglePlayer(togglePlayer)

			}
		})

	}

	togglePlayer(bool) {

		let animations = [
			Animated.timing(
				this.state.draggedUp,
				{
					duration: 350,
					toValue:  bool == true ? (TOP_COORD * -1) : 0 
				}
			),
			Animated.timing(
				this.state.miniPlayerOpacity,
				{
					duration: 300,
					toValue: bool == true ? 0 : 1
				}
			)
		]

		if ( bool == true ) {
			let navBarAnimation = Animated.timing(
				this.state.navbarOpacity,
				{
					duration: 100,
					toValue: bool == true ? 0 : 1
				}
			)
			animations.push(navBarAnimation)
			this.toggleNavAndStatusBars(bool)
		}
		
		Animated.parallel(animations).start(() => {

			if ( bool == false ) {
				this.toggleNavAndStatusBars(bool)
			}

			this.setState({
				draggedLocation: bool == true ? (TOP_COORD * -1) : 0,
				playerInView: bool,
			})
		})
	}

	toggleNavAndStatusBars(bool) {

		if ( bool == false ) {
			Animated.timing(
				this.state.navbarOpacity,
				{
					duration: 100,
					toValue: bool == true ? 0 : 1
				}
			).start()
		}

		StatusBar.setHidden(bool, 'slide')
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

				{(
					!this.state.playerInView

					? <MiniPlayer
						opacity={this.state.miniPlayerOpacity}
						openPlayer={this.togglePlayer.bind(this, true)}
						location={currentPlaying.location}
						artist={currentPlaying.artist}
						track={currentPlaying.track}/>

					: null
				)}

				<Player
					height={SCREEN_HEIGHT}
					closePlayer={this.togglePlayer.bind(this, false)}/>

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
	}

})

export default CurrentlyPlaying