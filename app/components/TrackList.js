'use strict'
import React, { Component } from 'react'
import {
	View,
	ListView,
	Text,
	StyleSheet,
	TouchableHighlight,
	TouchableOpacity
} from 'react-native'

import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import { ReactNativeAudioStreaming } from 'react-native-audio-streaming'

class TrackList extends Component {

	trackListTitle() {
		if ( this.props.title ) {
			return(
				<Text style={styles.trackListTitle}>{this.props.title}</Text>
			)
		}
	}

	trackNumber(num) {
		if ( this.props.popularTracks && num ) {
			return(
				<View style={styles.trackNumber}>
					<Text
						style={styles.trackNumberLabel}>
						{parseFloat(num) + 1}
					</Text>
				</View>
			)
		}
	}

	trackMetaRow(track) {
		if ( this.props.popularTracks && track.popularity ) {
			return (
				<View
					style={styles.trackPopularity}>
					<Icon
						name='ios-thumbs-up'
						style={styles.trackPopularityIcon}/>
					<View
						style={[styles.ratingBar, {
							paddingRight: 10 + (parseFloat(100 - track.popularity))
						}]}>
						<View style={styles.ratingBarMarker}/>
					</View>
				</View>
			)
		} else {
			return (
				<Text
					style={styles.trackArtist}
					numberOfLines={1}>
					{track.artists[0].name}
				</Text>
			)
		}
	}

	playTrackPreview(previewURL) {

		ReactNativeAudioStreaming.play(previewURL, {showIniOSMediaCenter: false});

	}

	stopTrackPreview() {
		ReactNativeAudioStreaming.stop();
	}

	playTrack(track) {

		let queuePreperation = []

		queuePreperation.push(track)

		this.props.updateTrackQueue(queuePreperation, this.props.trackQueue)

		// console.log(this.props.trackQueue)
		// console.log(queuePreperation)
	}

	renderTrack(trackObject, sectionID, rowID) {

		let track = trackObject['track'] || trackObject;

		return (
			<TouchableHighlight
				activeOpacity={.75}
				underlayColor={'rgba(255,255,255,.075)'}
				onLongPress={() => {this.playTrackPreview(track.preview_url)}}
				onPressOut={() => {this.stopTrackPreview()}}
				onPress={() => {this.playTrack(track)}}>

				<View style={styles.trackRow}>

					{this.trackNumber(rowID)}
					<View style={styles.trackDetails}>
						<Text
							style={styles.trackTitle}
							numberOfLines={1}>
							{track.name}
						</Text>
						{this.trackMetaRow(track)}
					</View>
					<TouchableOpacity
						style={styles.trackMore}
						activeOpacity={.75}
						onPress={() => alert('test')}>
						<Icon
							style={styles.trackMoreIcon}
							name='ios-more'/>
					</TouchableOpacity>
				</View>
			</TouchableHighlight>
		)

	}

	render() {

		return (
			<View
				style={styles.trackListWrap}>

				{this.trackListTitle()}

				<ListView
					dataSource={this.props.tracks}
					renderRow={(trackObject, sectionID, rowID) => {return this.renderTrack(trackObject, sectionID, rowID)}}/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	trackListWrap: {
		marginTop: 10,
	},

	trackListTitle: {
		textAlign: 'center',
		color: 'white',
		fontWeight: '700',
		fontSize: 18,
		marginTop: 15,
		marginBottom: 10,
	},

	trackRow: {
		paddingVertical: 12,
		paddingHorizontal: 15,
		flexDirection: 'row',
		alignItems: 'center',
	},

	trackNumber: {
		width: 20,
		alignItems: 'stretch',
		marginRight: 15,
	},

	trackNumberLabel: {
		color: 'rgba(255,255,255,.7)',
		fontWeight: '600',
		textAlign: 'center',
		fontSize: 16,
	},

	trackDetails: {
		flex: 1,
		alignItems: 'flex-start',
	},

	trackTitle: {
		color: 'white',
		marginBottom: 2,
		fontSize: 16,
		fontWeight: '500',
	},

	trackArtist: {
		color: 'rgba(255,255,255,.75)',
		fontSize: 13,
	},

	trackPopularity: {
		marginTop: 4,
		backgroundColor: 'rgba(255,255,255,.2)',
		borderRadius: 12,
		paddingLeft: 8,
		paddingVertical: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},

	trackPopularityIcon: {
		color: 'rgba(255,255,255,.5)',
		fontSize: 12,
		marginRight: 10,
		top: .5,
	},

	ratingBar: {
		width: 100,
		justifyContent: 'center',
	},

	ratingBarMarker: {
		height: 8,
		backgroundColor: 'rgba(255,255,255,.75)',
		borderRadius: 10,
	},

	trackMore: {
		marginLeft: 30,
		width: 26,
		height: 26,
		backgroundColor: 'transparent',
		alignItems: 'center',
		justifyContent: 'center',
	},

	trackMoreIcon: {
		color: 'rgba(255,255,255,.6)',
		fontSize: 24,
		top: 1,
	}
})

function mapStateToProps(state) {
	return {
		trackQueue: state.trackQueue
	}
}

export default connect(mapStateToProps)(TrackList)
