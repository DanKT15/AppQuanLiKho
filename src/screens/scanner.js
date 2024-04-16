import { StyleSheet, Text, View, Button } from "react-native";
import { useEffect, useState, useMemo } from "react";
import { CameraView, Camera } from "expo-camera/next";

export default function QrScanner({ navigation }) {
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

  // const Sendcode = useMemo(() => {

  // }, [dataQR]);

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

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <View>
          <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
          <Button title={"Back to home"} onPress={() => navigation.navigate('Home', {code: dataQR})} />
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
});