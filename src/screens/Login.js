import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, TouchableOpacity } from 'react-native';
import store from "../Security/AsyncStorage";
import axios from 'axios';
import {pathURL} from 'react-native-dotenv';
import { AuthContext } from "../Context/Context";

export default function Login ({ navigation }) {

  const [email, setemail] = useState(null);
  const [pass, setpass] = useState(null);
  const { signIn } = useContext(AuthContext);

  const handlLogin = async () => {

    if (email === null || pass === null) {
      return Alert.alert("Thiếu thông tin đăng nhập");
    }

    try {
      // console.log(`${pathURL}/api/login`);
      const response = await axios.post(`${pathURL}/api/login`, {email: email, password: pass},
      { 
        Headers: {
          "Accept": "application/json",
          "Content-Type" : "application/json",
          "Access-Control-Allow-Origin": "*",
        }
      });

      console.log(response.data);

      if (response.data.errors === 1) {
        console.log(response.data.message);
        return Alert.alert("Đăng nhập thất bại, vui lòng kiểm tra lại thông tin");
      } else {
        const savekey = await store.storeData(response.data.token);  
        return signIn({ permission: response.data.permission, token: response.data.token });
      }

    } catch (error) {
      return console.error(error);
    }
  }

  return (

    <View style={styles.container}> 
            
      <Text style={styles.text}>Login Screen</Text>

      <TextInput
        style={styles.input}  
        placeholder="Email" 
        onChangeText={text => setemail(text)}
      />

      <TextInput
        style={styles.input}  
        placeholder="Pass" 
        onChangeText={text => setpass(text)}
      />

      <TouchableOpacity style={styles.button} onPress={handlLogin}>
        <Text>Login</Text>
      </TouchableOpacity>
      

    </View>

  );

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    width: '90%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    width: '90%',
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  },
  text: {
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 12,
  },
});