import {View, Text} from 'react-native';
import React from 'react';
import {Marker} from 'react-native-maps';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialsIcons from 'react-native-vector-icons/MaterialIcons';

export const CustomMarker = ({data, type}) => {
  return (
    <Marker
      coordinate={{latitude: data.lat, longitude: data.lng}}
      title={data.name}
      description={data.address}>
      <View style={{backgroundColor: 'green', padding: 5, borderRadius: 20}}>
        {type === 'RESTAURANT' ? (
          <Entypo name="shop" size={30} color="#fff" />
        ) : (
          <MaterialsIcons name="restaurant" size={30} color="#fff" />
        )}
      </View>
    </Marker>
  );
};
