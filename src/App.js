import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Router from './routers/Router';


export default function App () {

  return (
    <NavigationContainer>
      <Router/>
    </NavigationContainer>
  );

}


