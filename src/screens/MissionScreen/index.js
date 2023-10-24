import { View, Text, StyleSheet, Image } from 'react-native'
import React, { useEffect } from 'react'
import { useOrderContext } from '../../contexts/OrderContext'

export const MissionScreen = () => {
  const { courierHisOrders } = useOrderContext()
  
  useEffect(() => {
    console.log('the courieer his order::::', courierHisOrders)
  },[])

  return (
    <View style={styles.container}>
      <Text style={{color:'#000'}}>Mission Screen</Text>
      {/* <Image source={} /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff'
  }
})