import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useReducer, useMemo } from 'react';
import { Button } from 'react-native';
import Home from '../screens/Home';
import scanner from '../screens/scanner';
import Login from "../screens/Login";
import store from "../Security/AsyncStorage";
import axios from 'axios';
import { URL } from 'react-native-dotenv';
import { AuthContext } from "../Context/Context";

const Router = () => {

  const Stack = createNativeStackNavigator();

  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            userToken: null,
          };
      }
    },
    {
      userToken: null,
    }
  );

  useEffect(() => {

    const bootstrapAsync = async () => {
      let userToken;

      try {

        userToken = await store.getData();

        if (userToken !== false) {
          return dispatch({ type: 'RESTORE_TOKEN', token: userToken });
        }

      } catch (e) {
        return console.error(e);
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(() => ({
    signIn: (data) => dispatch({ type: 'SIGN_IN', token: data.token }),
    signOut: async () => {
      const response = await axios.post(`${URL}/api/logout`, 
      { 
        Headers: {
          "Accept": "application/json",
          "Content-Type" : "application/json",
          "Access-Control-Allow-Origin": "*",
        }
      });

      if (response.data.errors === 1) {
        console.log(response.data.message);
      }
      else {
        const delkey = await store.delData();
        return dispatch({ type: 'SIGN_OUT' }); 
      }
    },
  }), []);

  return(
    <AuthContext.Provider value={authContext}>
      <Stack.Navigator>

        {state.userToken == null ? (
          <Stack.Screen name="Login" component={ Login }
            options={{
              headerRight: () => (
                <Button onPress={() => authContext.signOut()} title="Logout" color="#f4511e"/>
              ),
            }}   
          />
        ) : (
          <>
            <Stack.Screen name="Home" component={ Home }
              options={{
                headerRight: () => (
                  <Button onPress={() => authContext.signOut()} title="Logout" color="#f4511e"/>
                ),
              }}
            />

            <Stack.Screen name="scanner" component={ scanner }/> 
          </>
        )}

      </Stack.Navigator>
    </AuthContext.Provider>
  );
};

export default Router;

// screenOptions={{ headerShown: false }}