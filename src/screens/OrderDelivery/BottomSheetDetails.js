import React, {useMemo, useRef} from 'react';
import {View, Text} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import {Button} from '@rneui/themed';
import styles from './styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {useNavigation} from '@react-navigation/native';
import {useOrderContext} from '../../contexts/OrderContext';

const STATUS_TO_TITLE = {
  READY_FOR_PICKUP: 'Accept Order',
  ACCEPTED: 'Pick-up order',
  PICKUD_UP: 'Complete Delivery',
};

const BottomSheetDetails = props => {
  const {acceptOrder, order, user, dishes, pickUpOrder, completeOrder} =
    useOrderContext();
  const {totalKm, totalMinutes, onAccepted} = props;
  const bottomSheetRef = useRef(null);
  const navigation = useNavigation();

  const isDriverClose = totalKm <= 1;

  const snapPoints = useMemo(() => ['15%', '95%'], []);

  const onButtonPressed = async () => {
    if (order.status === 'READY_FOR_PICKUP') {
      bottomSheetRef.current?.collapse();
      await acceptOrder();
      onAccepted();
    } else if (order.status === 'ACCEPTED') {
      bottomSheetRef.current?.collapse();
      await pickUpOrder();
      navigation.goBack();
    }
  };

  const isButtonDisabled = () => {
    if (order.status === 'READY_FOR_PICKUP') {
      return false;
    }
    if (order.status === 'ACCEPTED' && isDriverClose) {
      return false;
    }
    if (order.status === 'PICKUD_UP' && isDriverClose) {
      return false;
    }
    return true;
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={0}
      handleIndicatorStyle={styles.handleIndicator}>
      <View style={styles.handleIndicatorContainer}>
        <Text style={styles.routeDetailsText}>
          {totalMinutes.toFixed(1)} min
        </Text>
        <FontAwesome5
          name="shopping-bag"
          size={30}
          color="#3FC060"
          style={{marginHorizontal: 10}}
        />
        <Text style={styles.routeDetailsText}>{totalKm.toFixed(2)} km</Text>
      </View>
      <View style={styles.deliveryDetailsContainer}>
        <Text style={styles.restaurantName}>{order.Restaurant.name}</Text>
        <View style={styles.addressContainer}>
          <Fontisto name="shopping-store" size={22} color="grey" />
          <Text style={styles.addressText}>{order.Restaurant.address}</Text>
        </View>
        <View style={styles.addressContainer}>
          <Fontisto name="map-marker-alt" size={30} color="grey" />
          <Text style={styles.addressText}>{user?.address}</Text>
        </View>

        <View style={styles.orderDetailsContainer}>
          {dishes?.map(dish => (
            <Text key={dish.id} style={styles.orderItemText}>
              {dish.Dish.name} x {dish.quantity}
            </Text>
          ))}
        </View>
      </View>
      <Button
        title={STATUS_TO_TITLE[order.status]}
        buttonStyle={{
          // ...styles.buttonStyle,
          backgroundColor: isButtonDisabled() ? 'grey' : '#3FC060',
        }}
        containerStyle={styles.containerButton}
        disabled={isButtonDisabled()}
        onPress={onButtonPressed}
      />
    </BottomSheet>
  );
};

export default BottomSheetDetails;
