import {API, DataStore, graphqlOperation} from 'aws-amplify';
import {createContext, useContext, useEffect, useState} from 'react';
import {
  getOrder,
  getOrderDish,
  getUser,
  listOrderDishes,
  listOrders,
} from '../graphql/queries';
import {onCreateOrder} from '../graphql/subscriptions';
import {Order, OrderStatus} from '../models';
import {useAuthContext} from './AuthContext';
import { updateOrder } from '../graphql/mutations';

const OrderContext = createContext({});

const OrderContextProvider = ({children}) => {
  const {dbCourier} = useAuthContext();

  const [order, setOrder] = useState();
  const [user, setUser] = useState();
  const [dishes, setDishes] = useState();
  const [courierHisOrders, setCourierHisOrders] = useState();

  useEffect(() => {
    fetchOrders()
  },[])

  const fetchOrders = async () => {
    API.graphql(graphqlOperation(listOrders)).then((o) => {
      console.log('the all ordersss::::', o.data.listOrders.items.filter(_ => _.status ==="COMPLETED" && _.Courier !=null));
      setCourierHisOrders( o.data.listOrders.items.filter(_ => _.status ==="COMPLETED"))
    })
  }

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

  const cancelAcceptedOrder = async () => {
    const acceptedOrder = await API.graphql(
        graphqlOperation(updateOrder, {
            input: {
                status: OrderStatus.READY_FOR_PICKUP,
                courierID: dbCourier.id,
                id: order.id,
                _version: order._version,
            },
        })
    );
    setOrder(acceptedOrder.data.updateOrder);
  };

  const acceptOrder = async () => {
    const acceptedOrder = await API.graphql(
        graphqlOperation(updateOrder, {
            input: {
                status: OrderStatus.ACCEPTED,
                courierID: dbCourier.id,
                id: order.id,
                _version: order._version,
            },
        })
    );
    setOrder(acceptedOrder.data.updateOrder);
  };

  const pickUpOrder = async () => {
    // const updatedOrder = await DataStore.save(
    //   Order.copyOf(order, updated => {
    //     updated.status = 'PICKED_UP';
    //   }),
    // );
    const updatedOrder = await API.graphql(
        graphqlOperation(updateOrder, {
            input: {
                status: OrderStatus.PICKED_UP,
                id: order.id,
                _version: order._version,
            },
        })
    );
    setOrder(updatedOrder.data.updateOrder);
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
        cancelAcceptedOrder,
        order,
        user,
        dishes,
        fetchOrder,
        courierHisOrders,
        pickUpOrder,
        completeOrder,
      }}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext);
