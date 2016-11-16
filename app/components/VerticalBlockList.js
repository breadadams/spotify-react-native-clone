'use strict'
import React, { Component } from 'react'
import {
	View,
	ListView,
	Text,
	Image,
	StyleSheet
} from 'react-native'

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
				style={styles.listItemImg}/>
		)
	}

	listItemTitle(title) {
		if ( this.props.displayTitles && title ) {
			return(
				<Text
					style={styles.listItemTitle}>
					{title}
				</Text>
			)
		}
	}

	renderListItem(item) {
		return(
			<View
				style={styles.scrollListItem}>
				{this.backgroundImage(item)}
				{this.listItemTitle(item.name)}
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
		paddingTop: 10,
	},

	rowTitle: {
		textAlign: 'center',
		fontWeight: '300',
		fontSize: 16,
		letterSpacing: 2,
		marginBottom: 15,
	},

	horizontalScrollWrap: {
		paddingLeft: 15,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
	},

	scrollListItem: {
		// width: 150,
		height: 150,
		flexBasis: 160,
		flex: 1,
		backgroundColor: 'green',
		marginRight: 15,
		backgroundColor: '#eaeaea',
		marginBottom: 15,
	},

	listItemImg: {
		position: 'absolute',
		left: 0,
		top: 0,
		right: 0,
		bottom: 0,
	},

	listItemTitle: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 15,
		backgroundColor: 'transparent',
		textAlign: 'center',
		color: '#ffffff',
		fontWeight: '500',
	}
})

