import {View, Text} from 'react-native';
import React from 'react';
import {Marker} from 'react-native-maps';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialsIcons from 'react-native-vector-icons/MaterialIcons';

export const CustomMarker = () => {
  return (
    <Marker coordinate={{latitude: 33.9962493, longitude: -6.8487574}}>
      <View style={{backgroundColor: 'green', padding: 5, borderRadius: 20}}>
        <Entypo name="shop" size={30} color="#fff" />
        <MaterialsIcons name="restaurant" size={30} color="#fff" />
      </View>
    </Marker>
  );
};
