'use strict'
import React, { Component } from 'react'
import {
	View,
	ListView,
	Text,
	Image,
	StyleSheet,
	TouchableOpacity
} from 'react-native'

import { Actions } from 'react-native-router-flux'

export default class VerticalBlockList extends Component {

	constructor() {
		super()
	}

	backgroundImage(item) {

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
				style={this.props.displayTitles == 'below' ? styles.listItemImg : StyleSheet.absoluteFill}/>
		)
	}

	listItemTitle(title) {
		if ( this.props.displayTitles && title ) {
			return(
				<Text
					numberOfLines={1}
					style={this.props.displayTitles == 'below' ? styles.listItemTitleBelow : styles.listItemTitle}>
					{title}
				</Text>
			)
		}
	}

	listItemMeta(meta) {
		if ( this.props.displayMeta && meta ) {
			return(
				<Text style={styles.listItemMeta}>{`Meta`}</Text>
			)
		}
	}

	renderListItem(item) {
		return(
			<View
				style={[styles.scrollListItem, this.props.displayTitles !== 'below' ? {
					height: 160
				} : null]}>

				<TouchableOpacity
					onPress={() => {
						Actions.homeMediaList({
							title: item.name,
							contentType: item.type,
							mediaObject: item
						})
					}}>
					{this.backgroundImage(item)}
					{this.listItemTitle(item.name)}
					{this.listItemMeta(item.meta)}
				</TouchableOpacity>
			</View>
		)
	}

	render() {
		return(
			<View
				style={styles.rowWrap}>

				<Text
					style={styles.rowTitle}>
					{this.props.title}
				</Text>

				<ListView
					contentContainerStyle={styles.horizontalScrollWrap}
					dataSource={this.props.dataSource}
					renderRow={(item) => {return this.renderListItem(item)}}/>

			</View>
		)
	}
}

const styles = StyleSheet.create({
	rowWrap: {
		paddingTop: 15,
	},

	rowTitle: {
		textAlign: 'center',
		fontWeight: '700',
		fontSize: 18,
		marginBottom: 15,
		color: 'white',
	},

	horizontalScrollWrap: {
		paddingLeft: 15,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
	},

	scrollListItem: {
		flexBasis: 160,
		flex: 1,
		marginRight: 15,
		marginBottom: 20,
		alignItems: 'stretch',
		minHeight: 1,
		maxHeight: 200,
	},

	listItemImg: {
		marginBottom: 5,
		height: 160,
	},

	listItemTitleBelow: {
		textAlign: 'center',
		color: 'white',
		fontWeight: '700',
		backgroundColor: 'transparent'
	},

	listItemTitle: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 15,
		textAlign: 'center',
		color: 'white',
		fontWeight: '500',
		backgroundColor: 'transparent',
	},

	listItemMeta: {
		color: 'white',
		textAlign: 'center',
		opacity: .75,
		marginTop: 4,
	}
})

