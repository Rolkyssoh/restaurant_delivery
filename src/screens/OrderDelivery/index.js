import {View, Text, useWindowDimensions} from 'react-native';
import React from 'react';
import styles from './styles';
import MapView from 'react-native-maps';
import BottomSheetDetails from './BottomSheetDetails';

export const OrderDelivery = () => {
  const {width, height} = useWindowDimensions();

  return (
    <View style={styles.container}>
      <MapView
        style={{width, height}}
        initialRegion={{
          latitude: 33.9962493,
          longitude: -6.8487574,
          latitudeDelta: 0.07,
          longitudeDelta: 0.07,
        }}
      />
      {/* <BottomSheet /> */}
      <BottomSheetDetails />
    </View>
  );
};
