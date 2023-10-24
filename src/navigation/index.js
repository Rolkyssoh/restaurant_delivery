import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ActivityIndicator} from 'react-native';
import {useAuthContext} from '../contexts/AuthContext';
import {MissionScreen, OrderDelivery, OrdersScreen, ProfileScreen, UserAccountScreen} from '../screens';

const Stack = createNativeStackNavigator();

const EntryNavigation = () => {
  const {dbCourier, loading} = useAuthContext();

  if (loading) {
    return (
      <ActivityIndicator
        size={'large'}
        color="black"
        style={{alignSelf: 'center', marginTop: 60}}
      />
    );
    //Pr0gr@mm@t!0n@--base
    // denial pause use breeze enroll change float extra fade delay loop glide
  }
  return (
    <Stack.Navigator>
      {/* {!dbCourier ? (
        <> */}
      <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
      <Stack.Screen name="OrderDelivery" component={OrderDelivery} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="UserAccount" component={UserAccountScreen} options={{ title:'' }} />
      <Stack.Screen name="Mission" component={MissionScreen} />
        {/* </>
      ) : (
        <Stack.Screen name="Profile" component={ProfileScreen} />
      )} */}
    </Stack.Navigator>
  );
};

export default EntryNavigation;
