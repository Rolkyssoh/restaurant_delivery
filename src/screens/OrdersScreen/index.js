import {View, Text, StyleSheet, Dimensions} from 'react-native';
import React, {useMemo, useRef} from 'react';
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import MapView from 'react-native-maps';
import {CustomMarker} from '../../components/CustomMarker';
import {OrderItem} from '../../components';
import orders from '../../../assets/data/orders.json';

export const OrdersScreen = () => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['15%', '90%'], []);

  return (
    <View style={{backgroundColor: 'lightgrey', height: '100%'}}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 33.9962493,
          longitude: -6.8487574,
          latitudeDelta: 0.07,
          longitudeDelta: 0.07,
        }}>
        <CustomMarker />
      </MapView>
      <BottomSheet ref={bottomSheetRef} index={1} snapPoints={snapPoints}>
        <View style={{alignItems: 'center', marginBottom: 30}}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '600',
              letterSpacing: 0.5,
              paddingBottom: 5,
              color: '#000',
            }}>
            You're Online
          </Text>
          <Text style={{letterSpacing: 0.5, color: 'grey'}}>
            Available Orders:
          </Text>
        </View>
        <BottomSheetFlatList
          data={orders}
          renderItem={({item}) => <OrderItem order={item} />}
        />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
