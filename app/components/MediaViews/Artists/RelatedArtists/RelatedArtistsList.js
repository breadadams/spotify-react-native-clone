'use strict'
import React, { Component } from 'react'
import {
	ListView
} from 'react-native'

import ScrollableView from '../../../ScrollableView'
import VerticalBlockList from '../../../VerticalBlockList'

import SpotifyWebApi from '../../../../services/Spotify'

export default class RelatedArtistsList extends Component {

	constructor() {
		super()
		this.state = {
			artistsData: new ListView.DataSource({
				rowHasChanged: (r1, r2) => r1 !== r2
			}),
		}
	}

	componentWillMount() {
		this.setState({
			artistsData: this.state.artistsData.cloneWithRows(this.props.artistsData)
		})
	}

	render() {
		return(
			<ScrollableView>
				<VerticalBlockList
					dataSource={this.state.artistsData}
					displayTitles={'below'}/>
			</ScrollableView>
		)
	}
}

RelatedArtistsList.propTypes = {
	artistsData: React.PropTypes.array,
}