import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';

export default function Home ({ navigation, route }) {

  return (
    <View style={styles.container}>   
      <Text>Home Screen</Text>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});