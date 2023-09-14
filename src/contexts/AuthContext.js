import {API, Auth, graphqlOperation} from 'aws-amplify';
import {createContext, useContext, useEffect, useState} from 'react';
import {listCouriers} from '../graphql/queries';
import {onUpdateCourier} from '../graphql/subscriptions';

const AuthContext = createContext({});

const AuthContextProvider = ({children}) => {
  const [authUser, setAuthUser] = useState(null);
  const [dbCourier, setDbCourier] = useState(null);
  const [loading, setLoading] = useState(true);

  const sub = authUser?.attributes?.sub;

  useEffect(() => {
    Auth.currentAuthenticatedUser({bypassCache: true}).then(setAuthUser);
  }, []);

  useEffect(() => {
    if (!sub) {
      return;
    }

    API.graphql(graphqlOperation(listCouriers)).then(result => {
      const currentCourier = result.data.listCouriers.items.filter(
        _ => _.sub === sub,
      );
      if (currentCourier) setDbCourier(currentCourier[0]);
      setLoading(false);
    });
  }, [sub]);

  useEffect(() => {
    if (!dbCourier) {
      return;
    }

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
