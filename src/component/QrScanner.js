import { StyleSheet, Text, View, Button } from "react-native";
import { useEffect, useState } from "react";
import { CameraView, Camera } from "expo-camera/next";

export default function QrScanner(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [dataQR, setQR] = useState(null);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getCameraPermissions();
  }, []);

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Please grant camera permissions to app.</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>Camera permissions are denied.</Text>
      </View>
    );
  }

  const handleBarCodeScanned = (...args) => {
    setScanned(true);
    const data = args[0].data;
    result = JSON.stringify(data);
    setQR(result);
  };

  const handleNext = () => {
    setScanned(false);
    props.setdataQR(dataQR);
    props.setcheck(true);
  };

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <View>
          <Text style={styles.Text}>Data: {dataQR}</Text>
          {/* <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} /> */}
          <Button title={"Tap to Next"} onPress={handleNext} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  Text: {
    color: '#f0f8ff',
    fontSize: 20,
  },
});