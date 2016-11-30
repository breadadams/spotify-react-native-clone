'use strict'
import React, { Component } from 'react'
import {
	View,
	Text,
	LoadingIndicator,
	StyleSheet,
	Animated
} from 'react-native'

const WRAP_INITIAL_OPACITY = 0
const WRAP_TARGET_OPACITY = 1
const WRAP_ANIMATION_DURATION = 220

const BOX_INITIAL_SCALE = 0
const BOX_INITIAL_OPACITY = 0
const BOX_TARGET_SCALE = 1
const BOX_TARGET_OPACITY = 1
const BOX_ANIMATION_DURATION = 320

const DOT_INITIAL_SCALE = 1
const DOT_TARGET_SCALE = 1.4
const DOT_ANIMATION_DURATION = 240

export default class LoadingView extends Component {

	constructor() {
		super()
		this.state = {
			hideLoader: false,
			loadingWrapOpacity: new Animated.Value(WRAP_INITIAL_OPACITY),
			dotBox: {
				scale: new Animated.Value(BOX_INITIAL_SCALE),
				opacity: new Animated.Value(BOX_INITIAL_OPACITY),
			},
			dotScale: {
				dotOne: new Animated.Value(DOT_INITIAL_SCALE),
				dotTwo: new Animated.Value(DOT_INITIAL_SCALE),
				dotThree: new Animated.Value(DOT_INITIAL_SCALE),
			}
		}
	}

	animateLoadingWrap(bool, callback) {

		let opacityTarget = bool ? WRAP_TARGET_OPACITY : WRAP_INITIAL_OPACITY;

		Animated.timing(
			this.state.loadingWrapOpacity,
			{
				toValue: opacityTarget,
				duration: WRAP_ANIMATION_DURATION,
			}
		).start(() => { return callback ? callback() : null })
	}

	animateDotBox() {
		let animations = [
			Animated.timing(
				this.state.dotBox.opacity,
				{
					toValue: BOX_TARGET_OPACITY,
					duration: BOX_ANIMATION_DURATION,
				}
			),
			Animated.spring(
				this.state.dotBox.scale,
				{
					toValue: BOX_TARGET_SCALE,
					velocity: 5,
					friction: 5,
				}
			),
		]

		Animated.parallel(animations).start()
	}

	animateDots() {
		let animations = [
			Animated.timing(
				this.state.dotScale.dotOne,
				{
					toValue: DOT_TARGET_SCALE,
					duration: DOT_ANIMATION_DURATION,
				}
			),
			Animated.timing(
				this.state.dotScale.dotOne,
				{
					toValue: DOT_INITIAL_SCALE,
					duration: DOT_ANIMATION_DURATION,
				}
			),
			Animated.timing(
				this.state.dotScale.dotTwo,
				{
					toValue: DOT_TARGET_SCALE,
					duration: DOT_ANIMATION_DURATION,
				}
			),
			Animated.timing(
				this.state.dotScale.dotTwo,
				{
					toValue: DOT_INITIAL_SCALE,
					duration: DOT_ANIMATION_DURATION,
				}
			),
			Animated.timing(
				this.state.dotScale.dotThree,
				{
					toValue: DOT_TARGET_SCALE,
					duration: DOT_ANIMATION_DURATION,
				}
			),
			Animated.timing(
				this.state.dotScale.dotThree,
				{
					toValue: DOT_INITIAL_SCALE,
					duration: DOT_ANIMATION_DURATION,
				}
			)
		]

		Animated.sequence(animations).start(() => {
			this.animateDots()
		})
	}

	componentWillReceiveProps(nextProps) {
		let isVisible = this.props.visible;
		let shouldBeVisible = nextProps.visible;

		// If fading in
		if ( !isVisible && shouldBeVisible ) {
			this.setState({ hideLoader: false }, () => {
				this.animateLoadingWrap(true, () => {
					this.animateDots()
					this.animateDotBox()
				})
			})
		// Else if fading out
		} else if ( isVisible && !shouldBeVisible ) {
			this.animateLoadingWrap(false, () => {
				this.setState({ hideLoader: true })
			})
		}
	}

	componentWillMount() {
		this.animateLoadingWrap(true, () => {
			this.animateDots()
			this.animateDotBox()
		})
	}

	render() {
		if ( !this.state.hideLoader ) {
			return (
				<Animated.View
					style={[styles.loadingWrap, {
						opacity: this.state.loadingWrapOpacity
					}]}>

					<Animated.View
						style={[styles.dotBox, {
							opacity: this.state.dotBox.opacity,
							transform: [{
								scale: this.state.dotBox.scale
							}]
						}]}>
					
						<Animated.View
							style={[styles.loadingDot, {
								transform: [{
									scale: this.state.dotScale.dotOne
								}]
							}]}/>
						<Animated.View
							style={[styles.loadingDot, {
								transform: [{
									scale: this.state.dotScale.dotTwo
								}]
							}]}/>
						<Animated.View
							style={[styles.loadingDot, styles.loadingDotLast, {
								transform: [{
									scale: this.state.dotScale.dotThree
								}]
							}]}/>

					</Animated.View>

				</Animated.View>
			)
		} else {
			return null
		}
	}
}

LoadingView.propTypes = {
	visible: React.PropTypes.bool
}

const styles = StyleSheet.create({
	loadingWrap: {
		position: 'absolute',
		left: 0,
		top: 0,
		right: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0,0,0,.6)',
	},

	dotBox: {
		width: 150,
		height: 150,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		backgroundColor: 'rgba(255,255,255,.35)',
		borderRadius: 20,
	},

	loadingDot: {
		width: 20,
		height: 20,
		backgroundColor: 'rgba(0,0,0,.8)',
		borderRadius: 10,
		marginRight: 10,
	},

	loadingDotLast: {
		marginRight: 0,
	}
})