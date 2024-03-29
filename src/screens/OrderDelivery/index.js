import {View, ActivityIndicator} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import BottomSheetDetails from './BottomSheetDetails';
import * as Location from 'expo-location';

import styles from './styles';
import {useOrderContext} from '../../contexts/OrderContext';
import {useRoute} from '@react-navigation/native';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {CustomMarker} from '../../components';
import {API, graphqlOperation} from 'aws-amplify';
import {useAuthContext} from '../../contexts/AuthContext';
import {updateCourier} from '../../graphql/mutations';

import Config from 'react-native-config'
import { getStructure } from '../../graphql/queries';
import { OrderStatus } from '../../models';

export const OrderDelivery = () => {
  const mapRef = useRef(null);
  const route = useRoute();
  const {fetchOrder, order, user} = useOrderContext();
  const {dbCourier} = useAuthContext();
  const id = route.params?.id;

  const [driverLocation, setDriverLocation] = useState(null);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalKm, setTotalKm] = useState(0);
  const [structure, setStructure] = useState(null);

  useEffect(() => {
    fetchOrder(id);
  }, [id]);
  useEffect(() => {
    if(order)
    getStructureByOrderId(order.structureID)
  }, [order]);

  useEffect(() => {
    if (!driverLocation) {
      return;
    }

    try {
      API.graphql(
        graphqlOperation(updateCourier, {
          input: {
            id: dbCourier.id,
            _version: dbCourier._version,
            lat: driverLocation.latitude,
            lng: driverLocation.longitude,
          },
        }),
      );
    } catch (error) {
      console.log('error appier when updating curier:', error);
    }
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
    const foregroundSubscription = Location.watchPositionAsync(
      {accuracy: Location.Accuracy.High, distanceInterval: 100},
      updatedLocation => {
        setDriverLocation({
          latitude: updatedLocation.coords.latitude,
          longitude: updatedLocation.coords.longitude,
        });
      },
    );
    // return foregroundSubscription;
  }, []);

  const getStructureByOrderId = (struct_id) => {
    API.graphql(graphqlOperation(getStructure, {id: struct_id})).then(result => {
      setStructure(result.data.getStructure);
    });
  }

  const zoomInOnDriver = () => {
    mapRef.current.animateToRegion({
      latitude: driverLocation.latitude,
      longitude: driverLocation.longitude,
      latitudeDelta: order.status === OrderStatus.ACCEPTED ? 0.01 : 0.07,
      longitudeDelta: order.status === OrderStatus.ACCEPTED ? 0.01 : 0.07,
    });
  };

  const restaurantLocation = {
    latitude:  structure != null ? structure?.lat : 0,
    longitude: structure != null ?  structure?.lng : 0,
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
        style={styles.map}
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
          apikey={Config.GOOGLE_MAPS_APIKEY}
          onReady={result => {
            setTotalMinutes(result.duration);
            setTotalKm(result.distance);
          }}
        />
        {/* Restaurant marker */}
        <CustomMarker data={order} type="RESTAURANT" />

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
