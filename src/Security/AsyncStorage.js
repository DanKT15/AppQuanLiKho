
import AsyncStorage from "@react-native-async-storage/async-storage";

const storeData = async (value) => {
    try {
      const savekey = await AsyncStorage.setItem('key', value)
    } catch (e) {
      console.error(e);
    }
};

const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('key')

      if (jsonValue !== null) {
        return jsonValue;
      }
      else {
        return false;
      }

    } catch (e) {
        console.error(e);
    }
};

const delData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('key')

    if (jsonValue !== null) {
      const del = await AsyncStorage.removeItem('key');
    }
    
  } catch (e) {
      console.error(e);
  }
};



export default { storeData, getData, delData };