import {Dimensions, StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {backgroundColor: 'lightblue', height: '100%'},
  handleIndicator: {backgroundColor: 'grey', width: 100},
  handleIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  routeDetailsText: {
    fontSize: 25,
    letterSpacing: 1,
    color: '#000',
  },
  deliveryDetailsContainer: {
    paddingHorizontal: 20,
  },
  restaurantName: {
    fontSize: 25,
    letterSpacing: 1,
    paddingVertical: 20,
    color: '#000',
  },
  addressContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  addressText: {
    fontSize: 20,
    color: 'grey',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginLeft: 15,
  },
  orderDetailsContainer: {
    borderTopWidth: 1,
    borderColor: 'lightgrey',
    paddingTop: 20,
  },
  orderItemText: {
    fontSize: 18,
    color: 'grey',
    fontWeight: '500',
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  containerButton: {
    marginTop: 'auto',
    marginVertical: 20,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  buttonStyle: {},
  map: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    // zIndex: 1,
  },
});
