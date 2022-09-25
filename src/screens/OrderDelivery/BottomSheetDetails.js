import {View, Text} from 'react-native';
import React, {useMemo, useRef} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import {Button} from '@rneui/themed';
import styles from './styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';

const STATUS_TO_TITLE = {
  READY_FOR_PICKUP: 'Accept Order',
  ACCEPTED: 'Pick-up order',
  PICKUD_UP: 'Complete Delivery',
};

const BottomSheetDetails = () => {
  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(() => ['15%', '95%'], []);

  const isButtonDisabled = () => {
    //  if (order.status === 'READY_FOR_PICKUP') {
    //    return false;
    //  }
    //  if (order.status === 'ACCEPTED' && isDriverClose) {
    //    return false;
    //  }
    //  if (order.status === 'PICKUD_UP' && isDriverClose) {
    //    return false;
    //  }
    //  return true;
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      handleIndicatorStyle={styles.handleIndicator}>
      <View style={styles.handleIndicatorContainer}>
        <Text style={styles.routeDetailsText}>30 min</Text>
        <FontAwesome5
          name="shopping-bag"
          size={30}
          color="#3FC060"
          style={{marginHorizontal: 10}}
        />
        <Text style={styles.routeDetailsText}>20 km</Text>
      </View>
      <View style={styles.deliveryDetailsContainer}>
        <Text style={styles.restaurantName}>Restau name</Text>
        <View style={styles.addressContainer}>
          <Fontisto name="shopping-store" size={22} color="grey" />
          <Text style={styles.addressText}>Restau adress</Text>
        </View>
        <View style={styles.addressContainer}>
          <Fontisto name="map-marker-alt" size={30} color="grey" />
          <Text style={styles.addressText}>User adress</Text>
        </View>

        <View style={styles.orderDetailsContainer}>
          <Text style={styles.orderItemText}>Dish quantity</Text>
        </View>
      </View>
      <Button
        title={'Order status'}
        buttonStyle={{
          // ...styles.buttonStyle,
          backgroundColor: isButtonDisabled() ? 'grey' : '#3FC060',
        }}
        containerStyle={styles.containerButton}
      />
    </BottomSheet>
  );
};

export default BottomSheetDetails;
