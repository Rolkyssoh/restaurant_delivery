import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native';
import {Image} from '@rneui/themed';
import { API, graphqlOperation } from 'aws-amplify';
import { getStructure } from '../../graphql/queries';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
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

dayjs.extend(relativeTime);

export const MissionItem = ({mission}) => {
    const s3 = new AWS.S3();
    const [structure, setStructure] = useState()
     const [structurePicture, setStructurePicture] = useState();

    useEffect(() => {
      console.log('tthe current mission::::', mission)
      getStructureByHisIdInOrder(mission.structureID)
    },[mission])

    useEffect(() => {
        if (structure) {
          const params = {
            Bucket: S3_BUCKET,
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

    const getStructureByHisIdInOrder = async (structID) => {
      const structureInOrder = await API.graphql(
          graphqlOperation(getStructure, {id: structID}),
      );
      setStructure(structureInOrder.data.getStructure)
    }

  return (
    <View style={styles.container}>
        <Image
          source={{
            uri: structurePicture,
          }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.infosMission}>
            <Text style={{color:'#000', fontWeight:'bold',fontSize:18}}>{structure?.name}</Text>
            <View>
                <Text style={{color:'#000', fontWeight:'300',fontSize:10}}>Status: {mission.status}</Text>
                <Text style={{color:'#000', fontWeight:'300',fontSize:10}}>Achevée le {dayjs(mission.updatedAt).format('DD/MMM/YY à HH:mm:ss')}</Text>
            </View>
        </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container:{
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'#fff',
    height:105,
    marginHorizontal:15,
    marginVertical:5,
    borderRadius:10
  },
  image: {
    aspectRatio: 1,
    height: '101%',
    borderRadius: 10,
  },
  infosMission:{
    flex:1,
    height:'100%',
    padding:5,
    flexDirection:'column',
    justifyContent:'space-between',
    // backgroundColor:'red',
  }
})