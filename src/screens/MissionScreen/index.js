import { View, Text, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useOrderContext } from '../../contexts/OrderContext'
import { API, graphqlOperation } from 'aws-amplify';
import { getStructure } from '../../graphql/queries';
import { MissionItem } from '../../components/MissionItem';

export const MissionScreen = () => {
  const { courierHisOrders } = useOrderContext()
  
  useEffect(() => {
    console.log('the courieer his order::::', courierHisOrders)
  },[courierHisOrders])

  return (
    <View style={styles.container}>
      <FlatList 
        data={courierHisOrders}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => <MissionItem mission={item} /> }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'whitesmoke'
  },
})