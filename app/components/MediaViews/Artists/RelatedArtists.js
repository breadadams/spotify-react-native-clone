'use strict'
import React, { Component } from 'react'
import {
	View,
	Text,
	StyleSheet
} from 'react-native'

import SpotifyWebApi from '../../../services/Spotify'

export default class RelatedArtists extends Component {

	constructor() {
		super()
		this.state = {
			relatedArtists: '',
		}
	}

	componentWillMount() {
		SpotifyWebApi.getArtistsRelatedArtists(this.props.accessToken, this.props.artistID)
		.then(response => {

			let relatedArtists = [];

			response.artists.forEach(artist => {
				relatedArtists.push(artist.name);
			})

			this.setState({
				relatedArtists: relatedArtists.join(', ')
			})
		})
		.done()
	}

	render() {
		return(
			<View
				style={styles.relatedArtistsWrap}>
				<Text style={styles.relatedArtistsTitle}>{`Related Artists`}</Text>
				<Text
					style={styles.relatedArtistText}
					numberOfLines={2}>
					{this.state.relatedArtists}
				</Text>
			</View>
		)
	}
}


RelatedArtists.propTypes = {
	artistID: React.PropTypes.string,
	accessToken: React.PropTypes.string
}

const styles = StyleSheet.create({
	relatedArtistsWrap: {
		paddingHorizontal: 10,
		marginTop: 40,
		marginBottom: 30,
	},

	relatedArtistsTitle: {
		textAlign: 'center',
		color: 'white',
		fontWeight: '700',
		fontSize: 18,
		marginBottom: 15,
	},

	relatedArtistText: {
		color: 'white',
		lineHeight: 16,
		fontSize: 13,
		fontWeight: '500',
	}
})