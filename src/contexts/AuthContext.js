import {API, Auth, DataStore, graphqlOperation} from 'aws-amplify';
import {createContext, useContext, useEffect, useState} from 'react';
import {listCouriers} from '../graphql/queries';
import {onUpdateCourier} from '../graphql/subscriptions';
import {Courier} from '../models';

const AuthContext = createContext({});

const AuthContextProvider = ({children}) => {
  const [authUser, setAuthUser] = useState(null);
  const [dbCourier, setDbCourier] = useState(null);
  const [loading, setLoading] = useState(true);

  const sub = authUser?.attributes?.sub;

  useEffect(() => {
    Auth.currentAuthenticatedUser({bypassCache: true}).then(setAuthUser);
  }, []);

  console.log('the suuubbbbb:', sub);

  useEffect(() => {
    if (!sub) {
      return;
    }

    // DataStore.query(Courier, courier => courier.sub('eq', sub)).then(
    //   couriers => {
    //     setDbCourier(couriers[0]);
    //     setLoading(false);
    //   },
    // );
    API.graphql(graphqlOperation(listCouriers)).then(result => {
      console.log('the list of couriers:', result.data.listCouriers.items);
      const currentCourier = result.data.listCouriers.items.filter(
        _ => _.sub === sub,
      );
      if (currentCourier) setDbCourier(currentCourier[0]);
      setLoading(false);
    });
    //  API.graphql(graphqlOperation(listOrders)).then(result => {
    //    const readyOrders = result.data.listOrders.items.filter(
    //      _ => _.status === 'READY_FOR_PICKUP',
    //    );
    //    setOrders(readyOrders);
    //  });
  }, [sub]);

  useEffect(() => {
    if (!dbCourier) {
      return;
    }

    // const subscription = DataStore.observe(Courier, dbCourier.id).subscribe(
    //   msg => {
    //     if (msg.opType === 'UPDATE') {
    //       setDbCourier(msg.element);
    //     }
    //   },
    // );

    const subscription = API.graphql(
      graphqlOperation(onUpdateCourier, {
        filter: {id: {eq: dbCourier.id}},
      }),
    ).subscribe({
      next: ({value}) => {
        console.log('on update courier:', value);
      },
      error: err => {
        console.warn(err);
      },
    });
    return () => subscription.unsubscribe();
  }, [dbCourier]);

  return (
    <AuthContext.Provider
      value={{authUser, dbCourier, sub, setDbCourier, loading}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext);
