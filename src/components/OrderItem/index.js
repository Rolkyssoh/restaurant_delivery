import {View, Text, StyleSheet, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
// import {Image} from '@rneui/themed';
import {Image} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import {API, graphqlOperation} from 'aws-amplify';
import {getStructure, getUser, listUsers} from '../../graphql/queries';
import AWS from 'aws-sdk';
import Config from 'react-native-config'

AWS.config.update({
  accessKeyId: Config.REACT_APP_S3_ACCESS_KEY_ID,
  secretAccessKey: Config.REACT_APP_S3_SECRET_ACCESS_KEY,
});

export const OrderItem = ({order}) => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [structure, setStructure] = useState(null);
  const [structurePicture, setStructurePicture] = useState();
  const s3 = new AWS.S3();

  useEffect(() => {
    getUserByOrderId(order.userID)
    getStructureByOrderId(order.structureID)
  }, [order]);

  useEffect(() => {
    if (structure) {
      const params = {
        Bucket: Config.S3_BUCKET,
        Key: `${structure.image}`,
      };
      s3.getSignedUrl('getObject', params, (err, data) => {
        if (err) {
          console.log('we have some error:', err, err.stack);
        } else {
          setStructurePicture(data.toString());
        }
      });
    }
  },[structure])

  const getUserByOrderId = (user_id) => {
    API.graphql(graphqlOperation(getUser, {id: user_id})).then(result => {
      setUser(result.data.getUser);
    });
  }
  const getStructureByOrderId = (struct_id) => {
    API.graphql(graphqlOperation(getStructure, {id: struct_id})).then(result => {
      setStructure(result.data.getStructure);
    });
  }

  if(!user){
    return null
  }

  return (
    <Pressable
      style={styles.container}
      onPress={() => navigation.navigate('OrderDelivery', {id: order.id})}>
      <Image source={{uri: structurePicture}} style={styles.image} />
      <View style={styles.containerText}>
        <Text style={styles.name}>{structure?.name}</Text>
        <Text style={styles.textGrey}>{structure?.address}</Text>

        <Text style={{marginTop: 10, color: '#000'}}>Détails du client</Text>
        <Text style={styles.textGrey}>{user?.name}</Text>
        <Text style={styles.textGrey}>{user?.address}</Text>
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
