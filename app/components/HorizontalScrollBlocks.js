'use strict'
import React, { Component } from 'react'
import {
	View,
	ListView,
	Text,
	Image,
	StyleSheet
} from 'react-native'

export default class HorizontalScrollBlocks extends Component {

	constructor() {
		super()
	}

	_backgroundImage(item) {

		let itemImg

		if ( item.images ) {
			itemImg = item.images[0].url
		} else if ( item.icons ) {
			itemImg = item.icons[0].url
		} else {
			itemImg = ''
		}

		return(
			<Image
				source={{uri: itemImg}}
				style={StyleSheet.absoluteFill}/>
		)
	}

	_overlayTitle(title) {
		if ( this.props.displayTitles && title ) {
			return(
				<Text
					style={styles.listItemImgOverlayTitle}>
					{title}
				</Text>
			)
		}
	}

	_bottomContent(title) {
		if ( this.props.displayContentBelow && title ) {
			return(
				<View
					style={styles.bottomContent}>
					<Text
						style={styles.bottomContentTitle}
						numberOfLines={1}>
						{title}
					</Text>
				</View>
			)
		}
	}

	renderListItem(item) {
		return(
			<View
				style={styles.listItem}>
				<View
					style={[
						styles.listItemImgWrap,
						item.type == 'artist' ? styles.listItemImgWrapRound : null
					]}>
					{this._backgroundImage(item)}
					{this._overlayTitle(item.name)}
				</View>
				{this._bottomContent(item.name)}
			</View>
		)
	}

	render() {
		if ( this.props.dataSource ) {
			return(
				<View
					style={[styles.rowWrap, this.props.style]}>

					{( this.props.dataSource 

						? <Text
							style={styles.rowTitle}>
							{this.props.title}
						</Text>

						: null

					)}

					<ListView
						contentContainerStyle={styles.horizontalScrollWrap}
						dataSource={this.props.dataSource}
						renderRow={(item) => {return this.renderListItem(item)}}
						horizontal={true}
						showsHorizontalScrollIndicator={false}/>

				</View>
			)
		} else {
			return null
		}
	}
}

HorizontalScrollBlocks.propTypes = {
	title: React.PropTypes.string,
	dataSource: React.PropTypes.object,
	displayTitles: React.PropTypes.bool,
	displayContentBelow: React.PropTypes.bool,
	style: React.PropTypes.oneOfType([
	    React.PropTypes.object,
	    React.PropTypes.number,
    ])
}

const styles = StyleSheet.create({
	rowWrap: {

	},

	rowTitle: {
		color: 'white',
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 16,
		letterSpacing: .5,
		marginBottom: 10,
	},

	horizontalScrollWrap: {
		paddingLeft: 15,
	},

	listItem: {
		marginRight: 15,
		width: 150,
	},

	listItemImgWrap: {
		width: 150,
		height: 150,
		backgroundColor: '#eaeaea',
	},

	listItemImgWrapRound: {
		width: 135,
		height: 135,
		margin: 10,
		borderRadius: 67.5,
		overflow: 'hidden',
	},

	listItemImgOverlayTitle: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 15,
		backgroundColor: 'transparent',
		textAlign: 'center',
		color: '#ffffff',
		fontWeight: '500',
	},

	bottomContent: {
		flex: 1,
		paddingTop: 6,
		paddingHorizontal: 10,
	},

	bottomContentTitle: {
		color: 'white',
		textAlign: 'center',
		fontWeight: '600',
		fontSize: 11,
	}
})