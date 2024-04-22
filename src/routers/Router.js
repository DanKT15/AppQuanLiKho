import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useEffect, useReducer, useMemo } from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import Home from '../screens/Home';
import scanner from '../screens/scanner';
import Login from "../screens/Login";
import store from "../Security/AsyncStorage";
import axios from 'axios';
import {URL} from 'react-native-dotenv';
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
        // console.log(`${URL}/api/info`);
        const response = await axios.get(`${URL}/api/info`, 
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
          const saveNew = await store.storeData(response.data.token);
          return dispatch({ type: 'RESTORE_TOKEN', token: response.data.token });
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

  const Authcompoment = (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={ Login }/>
    </Stack.Navigator>
  );

  const Homecompoment = (
    <Tab.Navigator>
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

      <Tab.Screen name="Scanner" component={ scanner } 
        options={{ 
          tabBarLabel: 'Scanner',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="scan-helper" color={color} size={size} />
          ),
        }}
      /> 
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