'use strict'
import React, { Component } from 'react'
import {
	View,
	Text,
	ListView,
	StyleSheet
} from 'react-native'

import { connect } from 'react-redux'

import ViewContainer from '../components/ViewContainer'
import ScrollableView from '../components/ScrollableView'
import PullBlurHeader from '../components/PullBlurHeader'
import PlaylistHeader from '../components/PlaylistHeader'
import MainButton from '../components/MainButton'
import CurrentlyPlaying from '../components/CurrentlyPlaying'
import LoadingView from '../components/LoadingView'
import TrackList from '../components/TrackList'
import VerticalBlockList from '../components/VerticalBlockList'
import SpotifyWebApi from '../services/Spotify'

import { MiniRelatedArtists } from '../components/MediaViews/Artists'

class MediaList extends Component {

	constructor() {
		super()
		this.state = {
			negativeTopScroll: 0,
			tracks: new ListView.DataSource({
				rowHasChanged: (r1, r2) => r1 !== r2
			}),
			albums: new ListView.DataSource({
				rowHasChanged: (r1, r2) => r1 !== r2
			}),
			popularTracks: new ListView.DataSource({
				rowHasChanged: (r1, r2) => r1 !== r2
			}),
			loading: true,
			isFollowing: false,
		}
	}

	renderRelatedArtist(artist, sectionID, rowID) {
		return(
			<Text style={styles.relatedArtistName}>{artist.name}</Text>
		)
	}

	getContent(type) {
		switch(type) {
			case 'playlist':
				return(
					<TrackList
						tracks={this.state.tracks}/>
				)

			case 'artist':
				return(
					<View>
						<TrackList
							title='Popular'
							tracks={this.state.popularTracks}
							popularTracks/>

						<MiniRelatedArtists
							accessToken={this.props.accessToken}
							artistID={this.props.mediaObject.id}/>

						<VerticalBlockList
							title='Albums'
							dataSource={this.state.albums}
							displayTitles={'below'}
							displayMeta/>
					</View>
				)

			case 'album':
				return(
					<TrackList
						tracks={this.state.tracks}/>
				)

			default:
				return(<Text>{`MISSING CONTENTTYPE`}</Text>)
		}
	}

	componentWillMount() {
		// console.log(this.props.mediaObject)
		if ( this.props.contentType == 'playlist' ) {
			SpotifyWebApi.doesFollowPlaylist(this.props.accessToken, this.props.mediaObject.owner.id, this.props.mediaObject.id, 'bradzo3000')
			.then(isFollowing => {
				// console.log(isFollowing)
				this.setState({isFollowing: isFollowing[0]})
				SpotifyWebApi.getPlaylist(this.props.accessToken, this.props.mediaObject.owner.id, this.props.mediaObject.id)
				.then(playlist => {
					// console.log(playlist.tracks.items[0])
					// console.log(playlist)
					this.setState({
						tracks: this.state.tracks.cloneWithRows(playlist.tracks.items),
						loading: false,
					})
				}).done()
			})
			.catch(err => {
				// console.log(err)
			})
			.done()
		} else if ( this.props.contentType == 'artist' ) {
			SpotifyWebApi.getArtistsTopTracks(this.props.accessToken, this.props.mediaObject.id)
			.then(response => {
				this.setState({
					popularTracks: this.state.popularTracks.cloneWithRows(response.tracks.splice(0,5))
				}, () => {
					SpotifyWebApi.getArtistAlbums(this.props.accessToken, this.props.mediaObject.id, undefined, 'album', 4)
					.then(albums => {

						let newAlbums = {};
							
						albums.items.forEach((album, i) => {
							newAlbums[i] = {
								id: album.id,
								name: album.name,
								type: album.type,
								images: [
									{
										url: album.images[0].url
									},
								]
							}
						})

						this.setState({
							albums: this.state.albums.cloneWithRows(newAlbums),
							loading: false,
						})
					})
					.catch(err => {
						// console.log(err)
					})
					.done()
				})
			})
			.catch(err => {
				// console.log(err)
			}).done()
		} else {
			SpotifyWebApi.getAlbumsTracks(this.props.accessToken, this.props.mediaObject.id)
			.then(response => {
				this.setState({
					tracks: this.state.tracks.cloneWithRows(response.items),
					loading: false,
				})
			})
			.catch(err => {
				// console.log(err)
			})
			.done()
		}
	}

	_handleScroll = (event) => {

		if ( event.nativeEvent.contentOffset.y < 0 ) {
			this.setState({negativeTopScroll: event.nativeEvent.contentOffset.y})
		} else {
			if ( this.state.negativeTopScroll !== 0 ) {
				this.setState({negativeTopScroll: 0})
			}

			if ( event.nativeEvent.contentOffset.y > 220 ) {
				if ( ((event.nativeEvent.contentOffset.y - 220) / 20) < 1.01 ) {
					Actions.refresh({ navigationBarStyle: {opacity: ((event.nativeEvent.contentOffset.y - 220) / 20)} })
				} else {
					// Do nothing
				}
			} else {
				Actions.refresh({ navigationBarStyle: {opacity: 0} })
			}
		}
	}

	render() {
		return(
			<ViewContainer>

				<ScrollableView
					paddingTop={0}
					onScroll={(event) => {this._handleScroll(event)}}>

					<PlaylistHeader
						title={this.props.mediaObject.name}
						img={this.props.mediaObject.images[0].url}
						topScroll={this.props.contentType == 'playlist' ? 0 : this.state.negativeTopScroll}
						isFollowing={this.state.isFollowing}
						accessToken={this.props.accessToken}
						playlistOwnerID={this.props.mediaObject.owner ? this.props.mediaObject.owner.id : ''}
						playlistID={this.props.mediaObject.id}/>

					<MainButton
						label='SHUFFLE PLAY'
						icon='ios-play'
						onPress={() => {alert('Button pressed')}}/>

					{this.getContent(this.props.contentType)}

				</ScrollableView>

				<LoadingView
					visible={this.state.loading}/>

				<CurrentlyPlaying
					updateMediaState={this.props.updateMediaState}/>

			</ViewContainer>
		)

	}
}

const styles = StyleSheet.create({

})

function mapStateToProps(state) {
	return {
		accessToken: state.userTokens.accessToken
	}
}

export default connect(mapStateToProps)(MediaList)