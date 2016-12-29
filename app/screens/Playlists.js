'use strict'
import React, { Component } from 'react'
import {
	View,
	ScrollView,
	ListView,
	Text,
	Image,
	StyleSheet
} from 'react-native'

import { connect } from 'react-redux'

import HorizontalScrollBlocks from '../components/HorizontalScrollBlocks'
import VerticalBlockList from '../components/VerticalBlockList'
import SpotifyWebApi from '../services/Spotify'

class Playlists extends Component {

	constructor() {
		super()
		this.state = {
			playlistItems: new ListView.DataSource({
				rowHasChanged: (r1, r2) => r1 !== r2
			}),
			categoryItems: new ListView.DataSource({
				rowHasChanged: (r1, r2) => r1 !== r2
			}),
		}
	}

	componentDidMount() {
		SpotifyWebApi.getFeaturedPlaylists(this.props.accessToken, 'GB').then( res => {
			// console.log(res)
			if ( res && !(res.error) ) {
				this.setState({
					playlistItems: this.state.playlistItems.cloneWithRows(res.playlists.items),
					sectionTitle: res.message
				})
			}
		}).done()

		SpotifyWebApi.getCategories(this.props.accessToken, 'GB', 'es_ES', 4).then(res => {
			if ( res && !(res.error) ) {
				this.setState({
					categoryItems: this.state.categoryItems.cloneWithRows(res.categories.items),
				})
			}
		}).done()

		SpotifyWebApi.getUserTop(this.props.accessToken, 'artists', 5).then(res => {
			let artistsSeeds = [];
			for ( let artist of res.items ) {
				artistsSeeds.push(artist.id)
			}

			let seeds = {
				artists: artistsSeeds.join(',')
			}

			SpotifyWebApi.getRecommendations(this.props.accessToken, seeds).then(res => {
				console.log(res);
			})

		}).done()

		SpotifyWebApi.getNewReleases(this.props.accessToken, 'GB', 5, 5).then(res => {
			// console.log(res)
		})

	}

	render() {
		return(
			<ScrollView
				contentContainerStyle={[styles.mainOuterScroll]}
				automaticallyAdjustContentInsets={false}>

				<HorizontalScrollBlocks
					title={this.state.sectionTitle}
					dataSource={this.state.playlistItems}/>

				<HorizontalScrollBlocks
					title='Categories'
					dataSource={this.state.categoryItems}
					displayTitles/>

				<VerticalBlockList
					title='Categories'
					dataSource={this.state.categoryItems}
					displayTitles/>

			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	mainOuterScroll: {
		paddingTop: 64,
		paddingBottom: 50,
	}
})

function mapStateToProps(state) {
	return {
		accessToken: state.userTokens.accessToken,
		refreshToken: state.userTokens.refreshToken,
	}
}

export default connect(mapStateToProps)(Playlists)