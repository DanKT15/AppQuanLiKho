import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
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
    if (quantity > 1) {
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

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(props.diachiSP);

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

    props.setScanned(false);
    props.setdataQR(null);
    props.setcheck(false);
  };

  useEffect(() => {

    const checkItem = () => {

      const Sanpham = props.dataSP;
      const idsp = props.dataQR;
      let newidsp = idsp.replace(/"/g, '');
      let check = true;

      Sanpham.map(
        (e) => {
          if (e.id_sp == newidsp) {
            check = false;
          } 
        }
      );

      return check;
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
          setData([...Data, {id: response.data.Sanpham.MASP, title: response.data.Sanpham.TENSP, soluong: 1}]);
        }
    }

    const check = checkItem();

    if (check === true) {
      hanld();
    }
    else {
      props.setScanned(false);
      props.setdataQR(null);
      props.setMessScanned('Không được phép quét 1 sản phẩm 2 lần !');
      props.setcheck(false);
    }
      
  }, []);

  const handleAPI = async () => {

    if (value === null) {
      return Alert.alert('Vui lòng chọn địa chỉ');
    }

    const getkey = await store.getData();

    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let randomString = '';

    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      const randomChar = alphabet[randomIndex];
      randomString += randomChar;
    }
    
    let arrtamp = [];
    Data.map((item) => {
      arrtamp.push({MASP: item.id, SOLUONG: item.soluong});
    });

    // console.log(arrtamp); 

    const response = await axios.post(`${pathURL}/api/addphieu`, 
    {
      "sophieu": randomString.toUpperCase(),
      "madiachi": value,
      "info_sp": arrtamp
    }, 
    {
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
      Alert.alert(response.data.message);
      props.ResetData();
      props.setScanned(false);
      props.setdataQR(null);
      props.setcheck(false);
    }

  };
  
  return (
    <View style={styles.containerMain}>

      <Text style={styles.productName}>Danh sách địa chỉ</Text>
      
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
      />

      <View style={styles.buttonSubmit}>
        <Button
          title="Nhập Hàng"
          color="#ffa500"
          onPress={handleAPI}
        />
        <Button
          title="Thêm sản phẩm"
          color="#ffa500"
          onPress={handleData_Next}
        />
      </View>

      <ScrollView>

        <Text style={styles.productName}>Danh sách sản phẩm</Text>

        { Data.map(item => <Listsp key={item.id} id={item.id} nameSP={item.title} Soluong={item.soluong} updateData={updateData} />) }
      
      </ScrollView>

    </View>
  );

};

  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      padding: 10,
      borderRadius: 10,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    containerMain: {
      padding: 10,
    },
    productName: {
      paddingTop: 10,
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
      paddingTop: 5,
    },
  });
