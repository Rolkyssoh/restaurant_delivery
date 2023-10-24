import {View, Text} from 'react-native';
import React, { useEffect, useState } from 'react';
import {Marker} from 'react-native-maps';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialsIcons from 'react-native-vector-icons/MaterialIcons';
import { getStructure } from '../../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';

export const CustomMarker = ({data, type}) => {
  const [structure, setStructure] = useState(null);
  const [driverCoor, setDriverCoor] = useState({});
  console.log('in custom marker:', data);

  useEffect(() => {
    if(data?.structureID){
      getStructureByOrderId(data.structureID)
    }
  },[data])

  const getStructureByOrderId = (struct_id) => {
    API.graphql(graphqlOperation(getStructure, {id: struct_id})).then(result => {
      setStructure(result.data.getStructure);
    });
  }


  return (
    <Marker
      coordinate={{
        latitude: structure!=null ? structure?.lat : 0, 
        longitude:structure!=null ? structure?.lng : 0
      }}
      title={structure?.name}
      description={structure?.address}>
      <View style={{backgroundColor: 'green', padding: 5, borderRadius: 20}}>
        {type === 'RESTAURANT' ? (
          <Entypo name="shop" size={30} color="#fff" />
        ) : (
          <MaterialsIcons name="restaurant" size={30} color="#fff" />
        )}
      </View>
    </Marker>
  );
};
