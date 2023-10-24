import React, {useEffect, useMemo, useRef, useState} from 'react';
import {View, Text} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import {Button} from '@rneui/themed';
import styles from './styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {useNavigation} from '@react-navigation/native';
import {useOrderContext} from '../../contexts/OrderContext';
import { API, graphqlOperation } from 'aws-amplify';
import { getStructure } from '../../graphql/queries';
import { OrderStatus } from '../../models';

const STATUS_TO_TITLE = {
  READY_FOR_PICKUP: 'Accept Order',
  ACCEPTED: 'Pick-up order',
  PICKED_UP: 'Complete Delivery',
};

const BottomSheetDetails = props => {
  const {acceptOrder,cancelAcceptedOrder, order, user, dishes, pickUpOrder, completeOrder} =
    useOrderContext();
  const {totalKm, totalMinutes, onAccepted} = props;
  const bottomSheetRef = useRef(null);
  const navigation = useNavigation();
  const [structure, setStructure] = useState(null);

  console.log('le order dans bottom sheet detail:', order);

  useEffect(() => {
    if(order.structureID)
      getStructureByOrderId(order.structureID)
  },[order])

  const isDriverClose = totalKm <= 1;

  const snapPoints = useMemo(() => ['15%', '95%'], []);

  const getStructureByOrderId = (struct_id) => {
    API.graphql(graphqlOperation(getStructure, {id: struct_id})).then(result => {
      setStructure(result.data.getStructure);
    });
  }

  const onCancelButtonPressed = async () => {
    bottomSheetRef.current?.collapse();
    await cancelAcceptedOrder();
    onAccepted();
  }

  const onButtonPressed = async () => {
    if (order.status === 'READY_FOR_PICKUP') {
      bottomSheetRef.current?.collapse();
      await acceptOrder();
      onAccepted();
    } else if (order.status === 'ACCEPTED') {
      console.log('is already accepteddd:::', order)
      bottomSheetRef.current?.collapse();
      await pickUpOrder();
    } else if (order.status === 'PICKED_UP') {
      bottomSheetRef.current?.collapse();
      await completeOrder();
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
    if (order.status === 'PICKED_UP' && isDriverClose) {
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
        <Text style={styles.restaurantName}>{structure?.name}</Text>
        <View style={styles.addressContainer}>
          <Fontisto name="shopping-store" size={22} color="grey" />
          <Text style={styles.addressText}>{structure?.address}</Text>
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
      <View style={{ paddingHorizontal:10 }}>
        {order.status === OrderStatus.ACCEPTED && <Button 
          title = "Annuler"
          titleStyle={{color:'#000'}}
          buttonStyle={{backgroundColor:'yellowgreen'}}
          containerStyle={{marginVertical:10, borderRadius:10}}
          onPress={onCancelButtonPressed}
        />}
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
      </View>
    </BottomSheet>
  );
};

export default BottomSheetDetails;
