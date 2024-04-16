import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('my-key', value);
    } catch (e) {
        console.error(e);
    }
};

const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('my-key');

      if (value !== null) {
        return value;
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
    const value = await AsyncStorage.getItem('my-key');

    if (value !== null) {
      await AsyncStorage.removeItem('my-key');
    }
    
  } catch (e) {
      console.error(e);
  }
};



export default { storeData, getData, delData };