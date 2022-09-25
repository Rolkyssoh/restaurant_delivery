import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {OrderDelivery, OrdersScreen, ProfileScreen} from '../screens';

const Stack = createNativeStackNavigator();

const EntryNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
      <Stack.Screen name="OrderDelivery" component={OrderDelivery} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default EntryNavigation;
