import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert } from 'react-native';
import axios from 'axios';
import store from "../Security/AsyncStorage";
import {pathURL} from 'react-native-dotenv';

function Listsp ({ id, nameSP, Soluong, updateData }) {

  const [quantity, setQuantity] = useState(Soluong);

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
    updateData(id, quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
      updateData(id, quantity - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.productName}>Product: {nameSP}</Text>
      <View style={styles.buttonContainer}>
        <Text style={styles.quantity}>Quantity: {quantity}</Text>
        <Text>                          </Text>
        <Button title="Tăng +" onPress={incrementQuantity} />
        <Button title="Giảm -" onPress={decrementQuantity} />
      </View>
    </View>
  );
};

export default function Phieu (props) {

  const [Data, setData] = useState(props.dataSP);

  const updateData = (id, updatedsoluong) => {
    setData(Data.map((item) => {
      if (item.id === id) {
        return { ...item, soluong: updatedsoluong };
      }
      return item;
    }));
  }

  const handleData_Next = () => {

    props.ResetData();

    Data.map((e) => {
      props.AddDataSP(e.id, e.title, e.soluong);
    });

    props.setcheck(false);

  };

  useEffect(() => {

    const checkItem = () => {

      const Sanpham = props.dataSP;

      // const id = props.dataQR;

      // Sanpham.map((e) => {
      //   if (e.id === id) {
      //     console.log(e)
      //     return false;
      //   }
      // });

      console.log(Sanpham);

      return true;

    };

    const hanld = async () => {

        const getkey = await store.getData();
        const id = props.dataQR;
        var newStr = id.replace(/"/g, '');

        const response = await axios.get(`${pathURL}/api/getsp/${newStr}`, {
          headers: {
            "Accept": "application/json",
            "Content-Type" : "application/json",
            "Access-Control-Allow-Origin": "*",
            "Authorization": getkey
          }
        });
  
        if (response.data.errors === 1) {
          console.log(response.data.message);
        }
        else {
          setData([...Data, {id: response.data.Sanpham.MASP, title: response.data.Sanpham.TENSP, soluong: 0}]);
        }
    }

    if (checkItem()) {
      hanld();
    }
    else {
      props.setcheck(false);
    }
      
  }, []);
  
  return (
    <View style={styles.containerMain}>
      <Text style={styles.productName}>Danh sách sản phẩm</Text>
      <FlatList
        data={Data}
        renderItem={({item}) => <Listsp id={item.id} nameSP={item.title} Soluong={item.soluong} updateData={updateData} />}
        keyExtractor={item => item.id}
      />
      <View style={styles.buttonSubmit}>
        <Button
          title="Nhập Hàng"
          color="#ffa500"
          onPress={() => Alert.alert('nhập hàng thành công')}
        />
        <Button
          title="Thêm sản phẩm"
          color="#ffa500"
          onPress={handleData_Next}
        />
      </View>
    </View>
  );

};

  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    containerMain: {
      padding: 10,
      paddingTop: 20,
    },
    productName: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    quantity: {
      fontSize: 16,
      marginBottom: 10,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    buttonSubmit: {
      paddingTop: 50,
    },
  });
