import React, { Component } from 'react'
import {
	View,
	Text,
	TouchableWithoutFeedback,
	TouchableOpacity,
	StyleSheet,
	Image
} from 'react-native'

const FOLLOW_BTN_BORDER = 'rgba(255,255,255,.5)'
const FOLLOW_BTN_BORDER_ACTIVE = '#1ED760'
const FOLLOW_BTN_BORDER_TOUCH = 'rgba(255,255,255,1)'

import PullBlurHeader from './PullBlurHeader'

import SpotifyWebApi from '../services/Spotify'

export default class PlaylistHeader extends Component {

	constructor(props) {
		super(props)
		this.state = {
			isFollowing: this.props.isFollowing,
			followButtonBorderColor: FOLLOW_BTN_BORDER,
		}
	}

	toggleFollowing(currentStatus) {

		// If we're already following, unfollow
		if ( currentStatus == true ) {
			console.log('unfollowed')
			this.setState({isFollowing: false})
		// Else if we're not alrady following, follow
		} else {
			SpotifyWebApi.followPlaylist(this.props.accessToken, this.props.playlistOwnerID, this.props.playlistID)
			.then(result => {console.log(result)})
			.catch(err => {
				console.log(err)
			})
			.done(result => {
				if ( result ) {
					console.log('following')
					this.setState({isFollowing: true})
				} else {
					alert('there was an error')
				}
				console.log(result)
			})
			
		}
	}

	// componentWillMount() {
	// 	console.log(this.props.accessToken)
	// 	console.log(this.props.playlistOwnerID)
	// 	console.log(this.props.playlistID)
	// 	console.log( 'Are we following? ' + this.props.isFollowing )
	// }

	componentWillReceiveProps() {
		this.setState({
			isFollowing: this.props.isFollowing
		})
	}

	render() {
		return (
			<PullBlurHeader
				img={this.props.img}
				topScroll={0}>

				<Image
					style={styles.headerImg}
					resizeMode='cover'
					source={{uri: this.props.img}}/>

				<Text
					style={styles.headerTitle}>
					{this.props.title}
				</Text>

				<View
					style={styles.followWrap}>

					<TouchableWithoutFeedback
						onPress={() => {this.toggleFollowing(this.state.isFollowing)}}
						onPressIn={() => {this.setState({followButtonBorderColor: FOLLOW_BTN_BORDER_TOUCH})}}
						onPressOut={() => {this.setState({followButtonBorderColor: FOLLOW_BTN_BORDER})}}>
						<View
							style={[styles.followBtn, {
								borderColor: this.state.followButtonBorderColor
							}]}>
							<Text style={styles.followBtnLabel}>{this.state.isFollowing ? `FOLLOWING` : `FOLLOW`}</Text>
						</View>
					</TouchableWithoutFeedback>
				</View>

			</PullBlurHeader>
		)
	}
}

PlaylistHeader.propTypes = {
	img: React.PropTypes.string,
	title: React.PropTypes.string,
	isFollowing: React.PropTypes.bool,
}

const styles = StyleSheet.create({
	headerImg: {
		width: 120,
		height: 120,
		marginBottom: 10,
		backgroundColor: '#adadad',
		alignSelf: 'center',
	},

	headerTitle: {
		backgroundColor: 'transparent',
		color: 'white',
		textAlign: 'center',
	},

	followWrap: {
		alignItems: 'center',
		marginTop: 10,
	},

	followBtn: {
		backgroundColor: 'transparent',
		borderWidth: 1,
		paddingHorizontal: 20,
		paddingVertical: 4,
		borderRadius: 14,
	},

	followBtnLabel: {
		color: 'white',
		fontSize: 13,
		fontWeight: '700',
	},
})