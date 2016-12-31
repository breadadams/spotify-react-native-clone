'use strict'
import React, { Component } from 'react'
import {
	ScrollView
} from 'react-native'

export default class ScrollableView extends Component {
	render() {
		return (
			<ScrollView
				contentContainerStyle={{
					paddingTop: this.props.paddingTop,
					paddingBottom: 50,
				}}
				style={[
					{
						backgroundColor: '#222222',
					},
					this.props.style
				]}
				automaticallyAdjustContentInsets={false}
				scrollEventThrottle={16}
				onScroll={this.props.onScroll}>

				{this.props.children}

			</ScrollView>
		)
	}
}


ScrollableView.propTypes = {
	style: React.PropTypes.oneOfType([
	    React.PropTypes.object,
	    React.PropTypes.number,
    ]),
    paddingTop: React.PropTypes.number,
}

ScrollableView.defaultProps = {
	paddingTop: 64
}