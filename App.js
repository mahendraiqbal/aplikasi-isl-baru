import React from 'react';
import { AppRegistry } from 'react-native';
import Constants from 'expo-constants';
import { NavigationContainer } from '@react-navigation/native';
import Router from './src/Router';

const appName = Constants.manifest.name;

const App = () => (
  <NavigationContainer>
    <Router />
  </NavigationContainer>
);

AppRegistry.registerComponent(appName, () => App);

export default App;
