import {View, Text, ActivityIndicator, useWindowDimensions} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import BottomSheetDetails from './BottomSheetDetails';
import * as Location from 'expo-location';

import styles from './styles';
import {useOrderContext} from '../../contexts/OrderContext';
import {useRoute} from '@react-navigation/native';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {CustomMarker} from '../../components';
import {DataStore} from 'aws-amplify';
import {Courier} from '../../models';
import {useAuthContext} from '../../contexts/AuthContext';

export const OrderDelivery = () => {
  const {width, height} = useWindowDimensions();
  const mapRef = useRef(null);
  const route = useRoute();
  const {fetchOrder, order, user} = useOrderContext();
  const {dbCourier} = useAuthContext();
  const id = route.params?.id;

  const [driverLocation, setDriverLocation] = useState(null);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalKm, setTotalKm] = useState(0);

  useEffect(() => {
    fetchOrder(id);
  }, [id]);

  useEffect(() => {
    if (!driverLocation) {
      return;
    }
    DataStore.save(
      Courier.copyOf(dbCourier, updated => {
        updated.lat = driverLocation.latitude;
        updated.lng = driverLocation.longitude;
      }),
    );
  }, [driverLocation]);

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
    // const foregroundSubscription =
    Location.watchPositionAsync(
      {accuracy: Location.Accuracy.High, distanceInterval: 500},
      updatedLocation => {
        setDriverLocation({
          latitude: updatedLocation.coords.latitude,
          longitude: updatedLocation.coords.longitude,
        });
      },
    );
    // return foregroundSubscription;
  }, []);

  const zoomInOnDriver = () => {
    mapRef.current.animateToRegion({
      latitude: driverLocation.latitude,
      longitude: driverLocation.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const restaurantLocation = {
    latitude: order?.Restaurant.lat,
    longitude: order?.Restaurant.lng,
  };
  const deliveryLocation = {
    latitude: user?.lat,
    longitude: user?.lng,
  };

  if (!driverLocation || !order || !user) {
    return (
      <ActivityIndicator size={'large'} style={{marginTop: 50}} color="#000" />
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={{width, height}}
        showsUserLocation
        followsUserLocation
        initialRegion={{
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.07,
          longitudeDelta: 0.07,
        }}>
        <MapViewDirections
          origin={driverLocation}
          destination={
            order.status === 'ACCEPTED' ? restaurantLocation : deliveryLocation
          }
          strokeWidth={6}
          strokeColor="#3FC060"
          waypoints={
            order.status === 'READY_FOR_PICKUP' ? [restaurantLocation] : []
          }
          apikey={'AIzaSyDvMek9DrENbEPTg8ADcR2nTqScCna7EVk'}
          onReady={result => {
            setTotalMinutes(result.duration);
            setTotalKm(result.distance);
          }}
        />
        {/* Restaurant marker */}
        <CustomMarker data={order.Restaurant} type="RESTAURANT" />

        {/* User marker */}
        <CustomMarker data={user} type="USER" />
      </MapView>
      <BottomSheetDetails
        totalKm={totalKm}
        totalMinutes={totalMinutes}
        mapRef={mapRef}
        onAccepted={zoomInOnDriver}
      />
    </View>
  );
};
