import {View, Text, useWindowDimensions} from 'react-native';
import React from 'react';
import styles from './styles';
import MapView from 'react-native-maps';
import {BottomSheet} from '@gorhom/bottom-sheet';

export const OrderDelivery = () => {
  const {width, height} = useWindowDimensions();

  return (
    <View style={styles.container}>
      <MapView style={{width, height}} />
      {/* <BottomSheet /> */}
    </View>
  );
};
