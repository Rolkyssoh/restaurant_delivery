/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {OrderDelivery, OrdersSCreen, ProfileScreen} from './src/screens';
import EntryNavigation from './src/navigation';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

const App = () => {
  return (
    <NavigationContainer>
      <GestureHandlerRootView style={{flex: 1}}>
        {/* <SafeAreaView> */}
        <EntryNavigation />
        {/* </SafeAreaView> */}
      </GestureHandlerRootView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({});

export default App;
