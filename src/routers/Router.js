import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useEffect, useReducer, useMemo, useState } from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import Home from '../screens/Home';
import Login from "../screens/Login";
import Scanner from '../screens/Scanner';
import store from "../Security/AsyncStorage";
import axios from 'axios';
import {pathURL} from 'react-native-dotenv';
import { AuthContext } from "../Context/Context";

const Router = () => {

  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            permission: action.permission,
            userToken: action.token,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            permission: action.permission,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            permission: null,
            userToken: null,
          };
      }
    },
    {
      permission: null,
      userToken: null,
    }
  );

  useEffect(() => {

    const bootstrapAsync = async () => {
      let userToken;

      try {
        console.log(`${pathURL}/api/info`);
        const response = await axios.get(`${pathURL}/api/info`, 
        { 
          Headers: {
            "Accept": "application/json",
            "Content-Type" : "application/json",
            "Access-Control-Allow-Origin": "*",
          }
        });

        console.log(response.data);

        if (response.data.errors === 1) {
          const delkey = await store.delData();
          return dispatch({ type: 'SIGN_OUT' });
        }
        else {
          const delkey = await store.delData();
          const savekey = await store.storeData(response.data.token);  
          return dispatch({ type: 'RESTORE_TOKEN', permission: response.data.permission, token: response.data.token });
        }

      } catch (e) {
        return console.error(e);
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(() => ({
    signIn: (data) => dispatch({ type: 'SIGN_IN', permission: data.permission, token: data.token }),
    signOut: async () => {
      const response = await axios.post(`${pathURL}/api/logout`, 
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

  const Authcompoment = (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={ Login }/>
    </Stack.Navigator>
  );

  const Homecompoment = (
    <Tab.Navigator>

      {state.permission == "quantri" ? (

        <Tab.Screen name="Home" component={ Home }
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
          headerRight: () => (
            <Pressable style={styles.button} onPress={() => authContext.signOut()}>
              <Text style={styles.text}>Logout</Text>
            </Pressable>
          ),
          }}
        />


      ) : (
        <>
          <Tab.Screen name="Scanner" component={Scanner} 
            options={{ 
              tabBarLabel: 'Scanner',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="scan-helper" color={color} size={size} />
              ),
              headerRight: () => (
                <Pressable style={styles.button} onPress={() => authContext.signOut()}>
                  <Text style={styles.text}>Logout</Text>
                </Pressable>
              ),
              }}
          />
        </>
      )}
      
    </Tab.Navigator>
  );

  return(
    <AuthContext.Provider value={authContext}>
      {state.userToken == null ? Authcompoment : Homecompoment}
    </AuthContext.Provider>
  );
};

export default Router;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
  },
});