'use strict'
import React, { Component } from 'react'
import {
	View,
	Image,
	Text,
	TouchableOpacity,
	StyleSheet
} from 'react-native'

const HEADER_HEIGHT = 300
const IMAGE_BLUR = 25

export default class PullBlurHeader extends Component {

	constructor() {
		super()
		this.state = {
			initialImgBlur: IMAGE_BLUR,
			imgBlur: IMAGE_BLUR,
		}
	}

	setImageBlur() {
		if ( Math.floor(this.state.initialImgBlur - (this.props.topScroll / -2)) >= this.state.initialImgBlur ) {
			this.setState({
				imgBlur: this.state.initialImgBlur,
			})
		} else if ( Math.floor(this.state.initialImgBlur - (this.props.topScroll / -2)) >= 0 ) {
			this.setState({
				imgBlur: Math.floor(this.state.initialImgBlur - (this.props.topScroll / -2))
			})
		} else {
			if ( this.state.imgBlur !== 0 ) {
				this.setState({
					imgBlur: 0,
				})
			}
		}
	}

	componentWillReceiveProps() {
		this.setImageBlur()
	}

	render() {
		return (
			<View
				style={styles.headerOuterWrap}>

				<View
					style={[styles.headerInnerWrap, {
						transform: [{
							translateY: this.props.topScroll - (this.props.topScroll / -5)
						}],
						height: this.props.topScroll < 0 ? HEADER_HEIGHT + (this.props.topScroll * -1.2) : HEADER_HEIGHT,
					}]}>

					<Image
						style={styles.headerImgWrap}
						resizeMode='cover'
						blurRadius={this.state.imgBlur}
						source={{uri: this.props.img}}/>

					<View
						style={{
							transform: [{translateY: this.props.topScroll * -.1}],
							opacity: 1 - (this.props.topScroll/-40)
						}}>
						<Image
							style={styles.headerImg}
							resizeMode='cover'
							source={{uri: this.props.img}}/>

						<Text
							style={styles.headerTitle}>
							{this.props.title}
						</Text>
					</View>
				</View>
			</View>
		)
	}
}

PullBlurHeader.propTypes = {
	title: React.PropTypes.string,
	img: React.PropTypes.string,
	topScroll: React.PropTypes.number
}

const styles = StyleSheet.create({
	headerOuterWrap: {
		height: HEADER_HEIGHT,
		backgroundColor: '#222222',
		position: 'relative',
	},

	headerInnerWrap: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'stretch',
		justifyContent: 'center',
		backgroundColor: '#222222',
	},

	headerImgWrap: {
		position: 'absolute',
		left: 0,
		top: 0,
		bottom: 0,
		right: 0,
	},

	headerImg: {
		width: 100,
		height: 100,
		borderRadius: 50,
		marginBottom: 10,
		backgroundColor: '#adadad',
		alignSelf: 'center',
	},

	headerTitle: {
		backgroundColor: 'transparent',
		color: 'white',
		textAlign: 'center',
	}
})