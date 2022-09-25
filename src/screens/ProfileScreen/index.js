import {View, Text, StyleSheet, Pressable} from 'react-native';
import React, {useState} from 'react';
// import { TransportationMode } from ''
import {Button, Input} from '@rneui/themed';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export const ProfileScreen = () => {
  const [transportationMode, setTransportationMode] = useState('DRIVING');

  const onSave = async () => {};

  return (
    <View style={{backgroundColor: '#fff', height: '100%'}}>
      <Text style={styles.title}>Profile</Text>
      <Input placeholder="Nom" style={styles.input} />
      <View style={{flexDirection: 'row'}}>
        <Pressable
          onPress={() => setTransportationMode('BICYCLING')}
          style={{
            backgroundColor:
              transportationMode === 'BICYCLING' ? '#3FC060' : '#fff',
            ...styles.pressableStyle,
          }}>
          <MaterialIcons name="pedal-bike" size={40} color="black" />
        </Pressable>
        <Pressable
          onPress={() => setTransportationMode('DRIVING')}
          style={{
            backgroundColor:
              transportationMode === 'DRIVING' ? '#3FC060' : '#fff',
            ...styles.pressableStyle,
          }}>
          <FontAwesome5 name="car" size={40} color="black" />
        </Pressable>
      </View>

      <Button title="Engregister" buttonStyle={{margin: 10}} onPress={onSave} />
      <Button title="Décnnexion" type="clear" titleStyle={{color: 'red'}} />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    color: '#000',
  },
  input: {
    // margin: 10,
    backgroundColor: '#fff',
    padding: 15,
    // borderRadius: 5,
  },
  pressableStyle: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
  },
});
