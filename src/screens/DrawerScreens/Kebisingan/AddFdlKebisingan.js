import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
  TouchableOpacity,
  ScrollView,
  Button,
} from "react-native";

import Loader from "../../../components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNetInfo } from "@react-native-community/netinfo";
import { Camera } from "expo-camera";

const AddFdlKebisingan = ({ navigation }) => {
  const netInfo = useNetInfo();
  const [noSample, setNosample] = useState("");
  const [penamaanTitik, setPenamaanTitik] = useState("");
  const [penamaanTambahan, setPenamaanTambahan] = useState("");
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);

  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      try {
        const data = await camera.takePictureAsync(null);
        console.log(data.uri);
        setImage(data.uri);
        setCameraVisible(false);
      } catch (error) {
        console.error("Error taking picture:", error);
        Alert.alert("Error", "Failed to take a picture.");
      }
    }
  };

  const handleSubmitButton = () => {
    setErrortext("");
    if (!noSample) {
      alert("Please fill No Sample");
      return;
    }
    if (netInfo.isConnected && netInfo.isInternetReachable) {
      AsyncStorage.getItem("token").then((token) => {
        setLoading(true);
        AsyncStorage.getItem("token").then((item) => {
          token = item;
        });
        var dataToSend = {
          no_sample: noSample,
          token: token,
        };
        let formBody = [];
        for (let key in dataToSend) {
          let encodedKey = encodeURIComponent(key);
          let encodedValue = encodeURIComponent(dataToSend[key]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        console.log(formBody);

        fetch(
          "https://apps.intilab.com/eng/backend/public/default/api/getSample",
          {
            method: "POST",
            body: JSON.stringify(dataToSend),
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => response.json())
          .then((responseJson) => {
            setLoading(false);
            console.log(responseJson);
            if (responseJson.message) {
              setErrortext(responseJson.message);
            } else {
              setShowForm(true);
              setCameraVisible(true);
            }
          })
          .catch((error) => {
            setLoading(false);
            console.error(error);
            Alert.alert(error);
          });
      });
    } else {
      Alert.alert(
        "Anda Sedang Ofline.",
        "Tetap lanjut dengan mode Offline",
        [
          {
            text: "Cancel",
            onPress: () => {
              return null;
            },
          },
          {
            text: "Confirm",
            onPress: () => {
              // props.navigation.replace('Route_Tujuan');
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  const handleSaveButton = () => {
    // Implement logic to save the form data
    // Reset or navigate as needed
  };

  const handleCancelButton = () => {
    setShowForm(false);
    setNosample("");
    setImage(null);
    setCameraVisible(false);
    // Add any other logic you need for cancel
  };

  const handleOpenCamera = () => {
    setCameraVisible(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <View style={{ alignItems: "center", marginTop: 10 }}>
          <Image
            source={require("../../../../assets/isl.png")}
            style={{
              width: "70%",
              height: 100,
              resizeMode: "contain",
              marginTop: 0,
            }}
          />
        </View>
        <KeyboardAvoidingView enabled>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(NoSample) => setNosample(NoSample)}
              underlineColorAndroid="#f000"
              placeholder="Enter No Sample"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>

          {errortext !== "" ? (
            <Text style={styles.errorTextStyle}>{errortext}</Text>
          ) : null}

          {!showForm ? (
            <>
              <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={handleSubmitButton}
              >
                <Text style={styles.buttonTextStyle}>PROCESS</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Render your form components here */}
              {/* <Text>Additional Form Elements</Text> */}
              <View style={styles.SectionStyle}>
                <Text style={styles.textLabel}>Penamaan Titik</Text>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={(PenamaanTitik) => setPenamaanTitik(PenamaanTitik)}
                  underlineColorAndroid="#f000"
                  placeholder="Enter Penamaan Titik"
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="sentences"
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              </View>
              <View style={styles.SectionStyle}>
              <Text style={styles.textLabel}>Penamaan Tambahan</Text>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={(PenamaanTambahan) => setPenamaanTambahan(PenamaanTambahan)}
                  underlineColorAndroid="#f000"
                  placeholder="Enter Penamaan Tambahan"
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="sentences"
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              </View>
              {cameraVisible && (
                <>
                  <View style={styles.cameraContainer}>
                    <Camera
                      ref={(ref) => setCamera(ref)}
                      style={styles.fixedRatio}
                      type={type}
                      ratio={"1:1"}
                    />
                  </View>
                  <Button
                    title="Flip Image"
                    onPress={() => {
                      setType(
                        type === Camera.Constants.Type.back
                          ? Camera.Constants.Type.front
                          : Camera.Constants.Type.back
                      );
                    }}
                  />
                  {image && <Image source={{ uri: image }} style={{ flex: 1 }} />}
                  <TouchableOpacity
                    style={styles.cameraButtonStyle}
                    activeOpacity={0.5}
                    onPress={takePicture}
                  >
                    <Text style={styles.buttonTextStyle}>Take Picture</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* Save and Cancel Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.saveButtonStyle}
                  activeOpacity={0.5}
                  onPress={handleSaveButton}
                >
                  <Text style={styles.buttonTextStyle}>SAVE</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButtonStyle}
                  activeOpacity={0.5}
                  onPress={handleCancelButton}
                >
                  <Text style={styles.buttonTextStyle}>CANCEL</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: "row",
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
    flexDirection: 'column',
  },
  textLabel: {
    fontSize: 16,
    marginBottom: 8, // Add margin or padding as needed
  },
  buttonStyle: {
    backgroundColor: "#7DE24E",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#7DE24E",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  saveButtonStyle: {
    backgroundColor: "green",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "green",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    margin: 10,
    width: 100,
  },
  cancelButtonStyle: {
    backgroundColor: "red",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "red",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    margin: 10,
    width: 100,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: "black",
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#dadae8",
    fontWeight: "bold",
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 26,
  },
  successTextStyle: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    padding: 30,
  },
  cameraButtonStyle: {
    backgroundColor: "blue",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "blue",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
});

export default AddFdlKebisingan;
