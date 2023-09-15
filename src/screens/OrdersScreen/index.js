import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import MapView from 'react-native-maps';
import {CustomMarker} from '../../components/CustomMarker';
import {OrderItem} from '../../components';
import * as Location from 'expo-location';
import {API, graphqlOperation} from 'aws-amplify';
import {listOrders} from '../../graphql/queries';
import {onUpdateOrder} from '../../graphql/subscriptions';
import Entypo from 'react-native-vector-icons/Entypo'
import { useNavigation } from '@react-navigation/native';
import { useAuthContext } from '../../contexts/AuthContext';

export const OrdersScreen = () => {
  const { dbCourier } = useAuthContext()
  const bottomSheetRef = useRef(null);
  const navigation = useNavigation();
  const snapPoints = useMemo(() => ['15%', '90%'], []);

  const [driverLocation, setDriverLocation] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if(!dbCourier){
      navigation.navigate('Profile')
    }
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

    const subscription = API.graphql(
      graphqlOperation(onUpdateOrder, {
        filter: {status: {eq: 'READY_FOR_PICKUP'}},
      }),
    ).subscribe({
      next: ({value}) => {
        console.log('value when updated:', value);
        fetchOrders();
      },
      erro: err => console.warn(err),
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchOrders = () => {
    API.graphql(graphqlOperation(listOrders)).then(result => {
      const readyOrders = result.data.listOrders.items.filter(
        _ => _.status === 'READY_FOR_PICKUP',
      );
      setOrders(readyOrders);
    });
  };

  if (!orders || !driverLocation || ! dbCourier) {
    console.log(orders)
    console.log(driverLocation)
    return <ActivityIndicator size={'large'} color="#000" />;
  }
  console.log({orders});
  console.log({driverLocation});

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
            data={order.Structure}
            type="RESTAURANT"
          />
        ))}
      </MapView>
      <BottomSheet ref={bottomSheetRef} index={1} snapPoints={snapPoints}>
        <View style={styles.bottomSheetHeaderContainer}>
          <Pressable onPress={() => navigation.navigate('UserAccount')} style={{alignSelf:'flex-start'}}>
            <Entypo name="menu" size={30} color='#000' />
          </Pressable>
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
          {/* //Ghost view */}
          <View style={{width:25}}/>
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
  bottomSheetHeaderContainer:{
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center'
  }
});
