import {API, DataStore, graphqlOperation} from 'aws-amplify';
import {createContext, useContext, useEffect, useState} from 'react';
import {
  getOrder,
  getOrderDish,
  getUser,
  listOrderDishes,
} from '../graphql/queries';
import {onCreateOrder} from '../graphql/subscriptions';
import {Order, OrderDish, User} from '../models';
import {useAuthContext} from './AuthContext';

const OrderContext = createContext({});

const OrderContextProvider = ({children}) => {
  const {dbCourier} = useAuthContext();

  const [order, setOrder] = useState();
  const [user, setUser] = useState();
  const [dishes, setDishes] = useState();

  const fetchOrder = async id => {
    if (!id) {
      setOrder(null);
      return;
    }
    const fetchedOrder = await API.graphql(
      graphqlOperation(getOrder, {id: id}),
    );
    // API.graphql(graphqlOperation(getStructure, {id})).then(restau =>
    //   setRestaurant(restau.data.getStructure),
    // );

    console.log('the order result:', fetchedOrder);
    setOrder(fetchedOrder.data.getOrder);

    await API.graphql(
      graphqlOperation(getUser, {id: fetchedOrder.data.getOrder.userID}),
    ).then(resultUsr => {
      console.log({resultUsr});
      setUser(resultUsr.data.getUser);
    });

    API.graphql(graphqlOperation(listOrderDishes)).then(result => {
      const dishesByOrderId = result.data.listOrderDishes.items.filter(
        _ => _.orderID === fetchedOrder.data.getOrder.id,
      );
      setDishes(dishesByOrderId);
    });
  };

  useEffect(() => {
    if (!order) {
      return;
    }

    // const subscription = DataStore.observe(Order, order.id).subscribe(
    //   ({opType, element}) => {
    //     if (opType === 'UPDATE') {
    //       fetchOrder(element.id);
    //       setOrder(element);
    //     }
    //   },
    // );

    const subscription = API.graphql(
      graphqlOperation(onCreateOrder, {
        filter: {id: {eq: order.id}},
      }),
    ).subscribe({
      next: ({value}) => {
        console.log('on creaete order:', value);
      },
      error: err => {
        console.warn(err);
      },
    });
    return () => subscription.unsubscribe();
  }, [order?.id]);

  const acceptOrder = async () => {
    // update the order, and change status, and assign the driver
    const acceptedOrder = await DataStore.save(
      Order.copyOf(order, updated => {
        updated.status = 'ACCEPTED';
        updated.Courier = dbCourier;
      }),
    );
    setOrder(acceptedOrder);
  };

  const pickUpOrder = async () => {
    const updatedOrder = await DataStore.save(
      Order.copyOf(order, updated => {
        updated.status = 'PICKED_UP';
      }),
    );
    setOrder(updatedOrder);
  };

  const completeOrder = async () => {
    const updatedOrder = await DataStore.save(
      Order.copyOf(order, updated => {
        updated.status = 'COMPLETED';
      }),
    );
    setOrder(updatedOrder);
  };

  return (
    <OrderContext.Provider
      value={{
        acceptOrder,
        order,
        user,
        dishes,
        fetchOrder,
        pickUpOrder,
        completeOrder,
      }}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext);
