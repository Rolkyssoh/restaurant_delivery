import {View, Text, StyleSheet, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
// import {Image} from '@rneui/themed';
import {Image} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import {API, graphqlOperation} from 'aws-amplify';
import {getUser, listUsers} from '../../graphql/queries';
import AWS from 'aws-sdk';
import {
  REACT_APP_S3_ACCESS_KEY_ID,
  REACT_APP_S3_SECRET_ACCESS_KEY,
  S3_BUCKET,
  REGION,
} from '@env';

AWS.config.update({
  accessKeyId: REACT_APP_S3_ACCESS_KEY_ID,
  secretAccessKey: REACT_APP_S3_SECRET_ACCESS_KEY,
});

export const OrderItem = ({order}) => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [structurePicture, setStructurePicture] = useState();
  const s3 = new AWS.S3();

  useEffect(() => {
    console.log('le premier order lorsque on entre:', order.userID);
    API.graphql(graphqlOperation(getUser, {id: order.userID})).then(result => {
      console.log('the user order:', result);
      // setUser(result.data.getUser);
    });
    // API.graphql(graphqlOperation(listUsers)).then(result =>
    //   console.log('list all the users:', result),
    // );
  }, []);

  useEffect(() => {
    console.log('le order dans order item:', order);
    if (order.Structure) {
      const params = {
        Bucket: S3_BUCKET,
        Key: `${order.Structure.image}`,
      };
      s3.getSignedUrl('getObject', params, (err, data) => {
        if (err) {
          console.log('we have some error:', err, err.stack);
        } else {
          setStructurePicture(data.toString());
        }
      });
    }
  }, [order]);

  return (
    <Pressable
      style={styles.container}
      onPress={() => navigation.navigate('OrderDelivery', {id: order.id})}>
      <Image source={{uri: structurePicture}} style={styles.image} />
      <View style={styles.containerText}>
        <Text style={styles.name}>{order.Structure.name}</Text>
        <Text style={styles.textGrey}>{order.Structure.address}</Text>

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
