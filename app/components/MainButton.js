import React, { Component } from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet
} from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'

const BUTTON_HEIGHT = 44

export default class MainButton extends Component {

	render() {
		return (
			<View
				style={styles.buttonOuterWrap}>
				<View
					style={styles.buttonWrap}>
					<View
						style={styles.button}>
						<TouchableOpacity
							activeOpacity={.9}
							onPress={this.props.onPress}
							style={styles.buttonInner}>
								{(this.props.icon

								? <Icon
									name={this.props.icon}
									style={styles.buttonIcon}/>

								: null)}
								<Text
									style={styles.buttonLabel}>
									{this.props.label}
								</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		)
	}
}

MainButton.propTypes = {
	label: React.PropTypes.string,
	onPress: React.PropTypes.func
}

const styles = StyleSheet.create({
	buttonOuterWrap: {
		backgroundColor: 'transparent',
		alignItems: 'center',
		position: 'relative',
		top: BUTTON_HEIGHT / -2,
		zIndex: 2,
		height: 0,
		marginBottom: BUTTON_HEIGHT / 2,
	},

	buttonWrap: {
		position: 'absolute',
		left: 0,
		right: 0,
		alignItems: 'center',
	},

	button: {
		backgroundColor: 'black',
		borderRadius: BUTTON_HEIGHT / 2,
		overflow: 'hidden',
	},

	buttonInner: {
		backgroundColor: '#1ED760',
		paddingHorizontal: 55,
		height: BUTTON_HEIGHT,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
	},

	buttonIcon: {
		marginRight: 12,
		fontSize: 20,
		color: 'white',
		top: 1,
	},

	buttonLabel: {
		color: 'white',
		fontWeight: 'bold',
		letterSpacing: 1,
		fontSize: 16,
	}
})