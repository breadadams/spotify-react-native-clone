'use strict'
import React, { Component} from 'react'
import {
	View
} from 'react-native'

export default class ViewContainer extends Component {
	render() {
		return (
			<View
				style={[
					{
						flex: 1,
						alignItems: 'stretch',
						justifyContent: 'flex-start',
						marginBottom: 50,
					},
					this.props.style
				]}>

				{this.props.children}

			</View>
		)
	}
}

ViewContainer.propTypes = {
	style: React.PropTypes.oneOfType([
	    React.PropTypes.object,
	    React.PropTypes.number,
    ])
}