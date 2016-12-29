'use strict'
import React, { Component } from 'react'
import {
	View,
	ListView,
	Text,
	StyleSheet
} from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'

export default class TrackList extends Component {

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
		if ( this.props.popularTracks ) {
			return (
				<Text
					style={styles.trackMeta}
					numberOfLines={1}>
					{`${track.popularity}% popularity`}
				</Text>
			)
		} else {
			return (
				<Text
					style={styles.trackMeta}
					numberOfLines={1}>
					{track.artists[0].name}
				</Text>
			)
		}
	}

	renderTrack(trackObject, sectionID, rowID) {

		let track = trackObject['track'] || trackObject;

		return (
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
				<View style={styles.trackMore}>
					<Icon
						style={styles.trackMoreIcon}
						name='ios-more'/>
				</View>
			</View>
		)

	}

	render() {
		return (
			<View>

				{this.trackListTitle()}

				<ListView
					dataSource={this.props.tracks}
					renderRow={(trackObject, sectionID, rowID) => {return this.renderTrack(trackObject, sectionID, rowID)}}/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	trackListTitle: {
		textAlign: 'center',
		color: 'white',
		fontWeight: '700',
		fontSize: 18,
		marginTop: 20,
	},

	trackRow: {
		paddingVertical: 12,
		paddingHorizontal: 15,
		flexDirection: 'row',
		alignItems: 'center',
	},

	trackDetails: {
		flex: 1,
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

	trackTitle: {
		color: 'white',
		marginBottom: 3,
		fontSize: 16,
		fontWeight: '500',
	},

	trackMeta: {
		color: 'white',
		fontSize: 12,
		opacity: .8,
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
