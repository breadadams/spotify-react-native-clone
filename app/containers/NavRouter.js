import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Linking
} from 'react-native'

import { connect } from 'react-redux'
import { Router, Scene } from 'react-native-router-flux'
import CookieManager from 'react-native-cookies'

import Home from '../screens/Home'
import Playlists from '../screens/Playlists'
import Splash from '../screens/Splash'

import SpotifyWebApi from '../services/Spotify'

const tabicon = ({selected, title}) => {
	return(
		<Text style={{color: selected ? '#1ED760' : 'white' }}>{title}</Text>
	)
}

class NavRouter extends Component {

	constructor() {
		super()
		this.state = {
			navbarOpacity: 0,
			accessToken: '',
			refreshToken: '',
		}
	}

	componentDidMount() {
		StatusBar.setBarStyle('light-content', true);
	}

	transitionNavbar(value) {
		// console.log('scrolled: '+value)
		// this.setState({navbarOpacity: (value/10)})
	}

	componentDidMount() {
		// console.log(this.props)
	}

	render() {
		return (
			<Router>
				<Scene
					key='root'>

					<Scene
						key='tabbar'
						tabs
						tabBarStyle={styles.tabBar}>

						<Scene
							key='homeTab'
							icon={tabicon}
							title='Home'
							navigationBarStyle={[styles.mainNavbar, styles.mainNavbarStartOpaque]}
							titleStyle={styles.mainNavbarTitle}
							initial>

							<Scene
								{...this.props}
								key='homeScreen'
								component={Home}
								title='Home'
								transitionNavbar={(value) => {this.transitionNavbar(value)}}/>

						</Scene>

						<Scene
							key='browseTab'
							icon={tabicon}
							title='Playlists'
							navigationBarStyle={styles.mainNavbar}
							titleStyle={styles.mainNavbarTitle}>

							<Scene
								key='browseScreen'
								component={Playlists}
								title='Playlists'/>

						</Scene>

					</Scene>

					<Scene
						{...this.props}
						key='splashScreen'
						component={Splash}
						hideNavBar
						hideTabBar
						direction='vertical'/>

				</Scene>
			</Router>
		)
	}
}

const styles = StyleSheet.create({
	tabBar: {
		borderTopWidth: .5,
		borderColor: '#101011',
		backgroundColor: '#222327',
		opacity: 1
	},

	mainNavbar: {
		backgroundColor: 'rgba(34, 35, 39, .8)',
		borderBottomWidth: 0,
		opacity: 1,
	},

	mainNavbarStartOpaque: {
		opacity: 0,
	},

	mainNavbarTitle: {
		color: '#ffffff',
	},
});

function mapStateToProps(state) {
	return {
	}
}

export default connect(mapStateToProps)(NavRouter)
