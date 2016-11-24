'use strict'
import React, {Component} from 'react'
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ListView
} from 'react-native'

import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'

import SpotifyWebApi from '../services/Spotify'

import TokenChecker from '../components/TokenChecker'
import ViewContainer from '../components/ViewContainer'
import ScrollableView from '../components/ScrollableView'
import HorizontalScrollBlocks from '../components/HorizontalScrollBlocks'
import CurrentlyPlaying from '../components/CurrentlyPlaying'

class Home extends Component {

	constructor() {
		super()
		this.state = {
			featuredPlaylists: new ListView.DataSource({
				rowHasChanged: (r1, r2) => r1 !== r2
			}),
			featuredPlaylistsTitle: '',
			recommendedArtists: new ListView.DataSource({
				rowHasChanged: (r1, r2) => r1 !== r2
			}),
			newReleases: new ListView.DataSource({
				rowHasChanged: (r1, r2) => r1 !== r2
			}),
		}
	}

	componentWillMount() {
		TokenChecker.checkTokenExists(this.props.setUserTokens, () => {

			SpotifyWebApi.getFeaturedPlaylists(this.props.accessToken).then( res => {
				if ( res && !(res.error) ) {
					this.setState({
						featuredPlaylists: this.state.featuredPlaylists.cloneWithRows(res.playlists.items),
						featuredPlaylistsTitle: res.message
					})
				}
			}).done()

			SpotifyWebApi.getUserTop(this.props.accessToken, 'artists', 10).then(res => {
				if ( res && !(res.error) ) {

					this.setState({
						recommendedArtists: this.state.recommendedArtists.cloneWithRows(res.items)
					})

				}

			}).done()

			SpotifyWebApi.getNewReleases(this.props.accessToken).then(res => {
				if ( res && !(res.error) ) {

					console.log(res)

					this.setState({
						newReleases: this.state.recommendedArtists.cloneWithRows(res.albums.items)
					})

				}
			}).done()
		})
	}

	render() {
		return(
			<ViewContainer>

				<ScrollableView>

					<HorizontalScrollBlocks
						title={this.state.featuredPlaylistsTitle}
						dataSource={this.state.featuredPlaylists}
						displayContentBelow
						style={styles.playlistBlock}/>

					<HorizontalScrollBlocks
						title={`Recommended Artists`}
						dataSource={this.state.recommendedArtists}
						displayContentBelow
						style={styles.playlistBlock}/>

					<HorizontalScrollBlocks
						title={`New Releases`}
						dataSource={this.state.newReleases}
						displayContentBelow
						style={styles.playlistBlock}/>

				</ScrollableView>

				<CurrentlyPlaying/>

			</ViewContainer>
		)
	}
}

const styles = StyleSheet.create({
	playlistBlock: {
		marginBottom: 65
	}
})

function mapStateToProps(state) {
	return {
		accessToken: state.userTokens.accessToken,
		refreshToken: state.userTokens.refreshToken
	}
}

export default connect(mapStateToProps)(Home)