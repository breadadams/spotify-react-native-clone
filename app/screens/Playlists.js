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

import PullBlurHeader from '../components/PullBlurHeader'
import HorizontalScrollBlocks from '../components/HorizontalScrollBlocks'
import VerticalBlockList from '../components/VerticalBlockList'
import SpotifyWebApi from '../services/Spotify'

import CookieManager from 'react-native-cookies'

export default class Playlists extends Component {

	constructor() {
		super()
		this.state = {
			headerHeight: 0,
			playlistItems: new ListView.DataSource({
				rowHasChanged: (r1, r2) => r1 !== r2
			}),
			categoryItems: new ListView.DataSource({
				rowHasChanged: (r1, r2) => r1 !== r2
			}),
		}
	}

	componentDidMount() {
		CookieManager.getAll((err, res) => {
			if ( res.access_token && res.refresh_token ) {
				this.setState({
					accessToken: res.access_token.value,
					refreshToken: res.refresh_token.value,
				}, () => {
					SpotifyWebApi.getFeaturedPlaylists(this.state.accessToken, 'ES', (res) => {
						this.setState({
							playlistItems: this.state.playlistItems.cloneWithRows(res.playlists.items),
							sectionTitle: res.message
						})

						SpotifyWebApi.getCategories(this.state.accessToken, (res) => {
							console.log(res.categories.items)
							this.setState({
								categoryItems: this.state.categoryItems.cloneWithRows(res.categories.items),
							})
						})
					})
				})
			}
		})
	}

	render() {
		return(
			<ScrollView
				contentContainerStyle={[styles.mainOuterScroll, {paddingTop: this.state.headerHeight}]}
				automaticallyAdjustContentInsets={false}>

				<PullBlurHeader
					title={'Playlists'}
					topScroll={0}
					onLayout={(event) => {
						this.setState({headerHeight: event.nativeEvent.layout.height})
					}}/>

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
		paddingTop: 84,
		paddingBottom: 100,
	}
})

