'use strict'
import React, { Component } from 'react'
import {
	View,
	Text,
	StyleSheet,
	TouchableHighlight
} from 'react-native'

import { Actions } from 'react-native-router-flux'

import SpotifyWebApi from '../../../../services/Spotify'

export default class MiniRelatedArtists extends Component {

	constructor() {
		super()
		this.state = {
			relatedArtists: '',
			relatedArtistsObject: {}
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
				relatedArtists: relatedArtists.join(', '),
				relatedArtistsObject: response.artists,
			})
		})
		.done()
	}

	render() {
		return(
			<TouchableHighlight
				activeOpacity={.75}
				underlayColor={'rgba(255,255,255,.1)'}
				onPress={() => {
					Actions.homeRelatedArtists({
						title: 'RELATED ARTISTS',
						artistsData: this.state.relatedArtistsObject
					})
				}}
				style={styles.relatedArtistsWrap}>
				<View
					style={{backgroundColor: 'transparent'}}>
					<Text style={styles.relatedArtistsTitle}>{`Related Artists`}</Text>
					<Text
						style={styles.relatedArtistText}
						numberOfLines={2}>
						{this.state.relatedArtists}
					</Text>
				</View>
			</TouchableHighlight>
		)
	}
}


MiniRelatedArtists.propTypes = {
	artistID: React.PropTypes.string,
	accessToken: React.PropTypes.string
}

const styles = StyleSheet.create({
	relatedArtistsWrap: {
		padding: 10,
		marginTop: 30,
		marginBottom: 20,
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