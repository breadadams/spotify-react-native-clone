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
import TestPage from '../screens/TestPage'
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
	}

	componentDidMount() {
		StatusBar.setBarStyle('light-content', true);
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
							navigationBarStyle={styles.mainNavbar}
							titleStyle={styles.mainNavbarTitle}
							initial>

							<Scene
								{...this.props}
								key='homeScreen'
								component={Home}
								title='HOME'/>

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

						<Scene
							key='testTab'
							icon={tabicon}
							title='Tokens'
							navigationBarStyle={[styles.mainNavbar, styles.mainNavbarStartOpaque]}
							titleStyle={styles.mainNavbarTitle}>

							<Scene
								{...this.props}
								key='testScreen'
								component={TestPage}
								title='TOKENS'
								transitionNavbar={(value) => {this.transitionNavbar(value)}}/>

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
		backgroundColor: '#38393d',
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
		fontSize: 15,
		fontWeight: '600',
		letterSpacing: .75,
	},
});

function mapStateToProps(state) {
	return {
	}
}

export default connect(mapStateToProps)(NavRouter)
