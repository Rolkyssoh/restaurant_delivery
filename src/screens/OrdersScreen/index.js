import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import MapView from 'react-native-maps';
import {CustomMarker} from '../../components/CustomMarker';
import {OrderItem} from '../../components';
import * as Location from 'expo-location';
import {DataStore} from 'aws-amplify';
import {Order} from '../../models';

export const OrdersScreen = () => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['15%', '90%'], []);

  const [driverLocation, setDriverLocation] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    (async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (!status === 'granted') {
        console.warn('Nonono');
        return;
      }
      let location = await Location.getCurrentPositionAsync();
      setDriverLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  useEffect(() => {
    fetchOrders();

    const subscription = DataStore.observe(Order).subscribe(msg => {
      if (msg.opType === 'UPDATE') {
        fetchOrders();
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchOrders = () => {
    DataStore.query(Order, order =>
      order.status('eq', 'READY_FOR_PICKUP'),
    ).then(setOrders);
  };

  if (!orders || !driverLocation) {
    return <ActivityIndicator size={'large'} color="#000" />;
  }

  return (
    <View style={{backgroundColor: 'lightgrey', height: '100%'}}>
      <MapView
        style={styles.map}
        showsUserLocation
        followsUserLocation
        initialRegion={{
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.07,
          longitudeDelta: 0.07,
        }}>
        {orders.map(order => (
          <CustomMarker
            key={order.id}
            data={order.Restaurant}
            type="RESTAURANT"
          />
        ))}
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
