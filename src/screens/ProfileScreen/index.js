import {View, Text, StyleSheet, Pressable, Alert} from 'react-native';
import React, {useState} from 'react';
// import { TransportationMode } from ''
import {Button, Input} from '@rneui/themed';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useAuthContext} from '../../contexts/AuthContext';
import {API, Auth, graphqlOperation} from 'aws-amplify';
import {createCourier, updateCourier} from '../../graphql/mutations';
import {TransportationModes} from '../../models';
import {useNavigation} from '@react-navigation/native';

export const ProfileScreen = () => {
  const navigation = useNavigation();
  const {sub, dbCourier, setDbCourier, authUser} = useAuthContext();
  const [transportationMode, setTransportationMode] = useState(
    TransportationModes.DRIVING,
  );
  const [name, setName] = useState(dbCourier?.name || '');

  const onSave = async () => {
    if (dbCourier) {
      await editExitedCourier();
    } else {
      await addNewCourier();
    }
  };

  const addNewCourier = async () => {
    try {
      const courier = await API.graphql(
        graphqlOperation(createCourier, {
          input: {
            name,
            lat: 0,
            lng: 0,
            sub,
            tranportationMode: transportationMode,
            // email: authUser?.attributes?.email
          },
        }),
      );
      console.log('the new courier:', courier);
      setDbCourier(courier.data.createCourier);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  const editExitedCourier = async () => {
    const updatedCourier = await API.graphql(
      graphqlOperation(updateCourier, {
        input: {
          _version: dbCourier._version,
          id: dbCourier.id,
          name,
          tranportationMode: transportationMode,
          // email: authUser?.attributes?.email
        },
      }),
    );
    console.log('the updated courier:', updatedCourier);
    setDbCourier(updateCourier.data.updateCourier);
    navigation.goBack();
  };

  return (
    <View style={{backgroundColor: '#fff', height: '100%'}}>
      <Text style={styles.title}>Profile</Text>
      <Input
        placeholder="Nom"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
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
      <Button
        title="Décnnexion"
        type="clear"
        titleStyle={{color: 'red'}}
        onPress={() => Auth.signOut()}
      />
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
