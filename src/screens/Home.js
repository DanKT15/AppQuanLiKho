import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';

export default function Home ({ navigation, route }) {

  useEffect(() => {
    if (route.params?.code) {
      Alert.alert("code qr: " + route.params?.code);
    }
  }, [route.params?.code])

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