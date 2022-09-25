import {View, Text, StyleSheet, Pressable} from 'react-native';
import React from 'react';
// import {Image} from '@rneui/themed';
import {Image} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';

export const OrderItem = ({order}) => {
  const navigation = useNavigation();
  return (
    <Pressable
      style={styles.container}
      onPress={() => navigation.navigate('OrderDelivery', {id: order.id})}>
      <Image source={{uri: order.Restaurant.image}} style={styles.image} />
      <View style={styles.containerText}>
        <Text style={styles.name}>{order.Restaurant.name}</Text>
        <Text style={styles.textGrey}>{order.Restaurant.address}</Text>

        <Text style={{marginTop: 10, color: '#000'}}>Détails du livreur</Text>
        <Text style={styles.textGrey}>nom</Text>
        <Text style={styles.textGrey}>Adresse</Text>
      </View>
      <View style={styles.contaienerIcon}>
        <Entypo name="check" size={30} color="#fff" />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderColor: '#3FC060',
    borderWidth: 2,
    borderRadius: 12,
    margin: 10,
  },
  image: {
    position: 'relative',
    width: '25%',
    height: '100%',
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
  },
  containerText: {marginLeft: 10, flex: 1, paddingVertical: 5},
  name: {fontSize: 18, fontWeight: '500', color: '#000'},
  textGrey: {color: 'grey'},
  contaienerIcon: {
    padding: 5,
    backgroundColor: '#3FC060',
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
  },
});
