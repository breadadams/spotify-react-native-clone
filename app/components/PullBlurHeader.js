'use strict'
import React, { Component } from 'react'
import {
	View,
	Image,
	Text,
	StyleSheet
} from 'react-native'

export default class PullBlurHeader extends Component {

	constructor() {
		super()
		this.state = {
			initialImgBlur: 15,
			imgBlur: 15,
		}
	}

	setImageBlur() {
		if ( Math.floor(this.state.initialImgBlur + (this.props.topScroll / 2)) <= 0 ) {
			this.setState({
				imgBlur: Math.floor(this.state.initialImgBlur + (this.props.topScroll / 4))
			})
		}
	}

	componentWillReceiveProps() {
		this.setImageBlur()
	}

	render() {
		return (
			<View
				style={[styles.headerOuterWrap, {
					transform: [{translateY: this.props.topScroll - (this.props.topScroll / -5)}]
				}]}
				onLayout={this.props.onLayout}>
				<Image
					style={[
						styles.headerImgWrap,
					]}
					resizeMode='cover'
					blurRadius={this.state.imgBlur}
					source={{uri: this.props.img}}/>

				<View
					style={{
						height: this.props.topScroll < 0 ? (this.props.topScroll * -1.15) : 0,
					}}/>

				<View
					style={{
						transform: [{translateY: this.props.topScroll * -1}],
						opacity: (1 - ((this.props.topScroll * -1)/40))
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
		)
	}
}

PullBlurHeader.propTypes = {
	title: React.PropTypes.string,
	img: React.PropTypes.string,
	topScroll: React.PropTypes.number,
	onLayout: React.PropTypes.func
}

const styles = StyleSheet.create({
	headerOuterWrap: {
		paddingVertical: 60,
		backgroundColor: '#0a0a0a',
		alignItems: 'center',
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
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
	},

	headerTitle: {
		backgroundColor: 'transparent',
		color: 'white',
		textAlign: 'center',
	}
})