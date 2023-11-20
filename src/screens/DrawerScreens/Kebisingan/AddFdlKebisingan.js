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
  Platform,
} from "react-native";

import Loader from "../../../components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNetInfo } from "@react-native-community/netinfo";
import { Camera, CameraType } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

const AddFdlKebisingan = ({ navigation }) => {
  const netInfo = useNetInfo();
  const [noSample, setNosample] = useState("");
  const [penamaanTitik, setPenamaanTitik] = useState("");
  const [penamaanTambahan, setPenamaanTambahan] = useState("");
  const [sumberKebisingan, setSumberKebisingan] = useState("");
  const [jenisFrekuensi, setJenisFrekuensi] = useState("");
  const [titikKoordinatSampling, setTitikKoordinatSampling] = useState("");
  const [jamPengambilan, setJamPengambilan] = useState("");
  const [jenisPengujian, setJenisPengujian] = useState("");
  const [kategoriPengujian, setKategoriPengujian] = useState("");
  const [shiftPengambilan, setShiftPengambilan] = useState("");
  const [suhuUdara, setSuhuUdara] = useState("");
  const [kelembapanUdara, setKelembapanUdara] = useState("");
  const [dataArray, setDataArray] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }

      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  useEffect(() => {
    // This effect will be triggered whenever currentInput changes
    const timeoutId = setTimeout(() => {
      if (currentInput.trim() !== "") {
        // Add the current input to the array
        setDataArray((prevData) => [...prevData, currentInput]);

        // Clear the current input
        setCurrentInput("");
      }
    }, 3000); // Set the delay time (3 seconds in this example)

    // Clean up the timeout on component unmount or when currentInput changes
    return () => clearTimeout(timeoutId);
  }, [currentInput]);

  const formatCoordinates = (latitude, longitude) => {
    const formatPart = (value, direction) => {
      const directionSymbol =
        direction === "latitude"
          ? value < 0
            ? "S"
            : "N"
          : value < 0
          ? "W"
          : "E";
      const absoluteValue = Math.abs(value);
      const degrees = Math.floor(absoluteValue);
      const minutes = Math.floor((absoluteValue - degrees) * 60);
      const seconds = ((absoluteValue - degrees - minutes / 60) * 3600).toFixed(
        4
      );
      return `${directionSymbol}${degrees}°${minutes}'${seconds}"`;
    };

    const formattedLatitude = formatPart(latitude, "latitude");
    const formattedLongitude = formatPart(longitude, "longitude");
    return `${formattedLatitude} ${formattedLongitude}`;
  };

  const handleInputChange = (input) => {
    const regex = /^\d+(\.\d{0,1})?$/;
    if (regex.test(input)) {
      setCurrentInput(input);
    }
  };

  const takePicture = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync();
      setImage(photo.uri);

      if (photo.assets && photo.assets.length > 0) {
        const selectedAsset = photo.assets[0];
        // Access the URI or other properties from the selected asset
        console.log("Selected Asset URI:", selectedAsset.uri);
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

  const openCamera = async () => {
    setShowCamera(true);
  };

  const closeCamera = () => {
    setShowCamera(false);
    setShowCloseButton(false);
  };

  const openGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        if (result.assets && result.assets.length > 0) {
          const selectedAsset = result.assets[0];
          // Access the URI or other properties from the selected asset
          setImage(selectedAsset.uri);
        }
      }
    } catch (error) {
      console.error("Error picking an image", error);
    }
  };

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Set TitikKoordinatSampling with the obtained coordinates in the desired format
      const formattedCoordinates = formatCoordinates(
        location.coords.latitude,
        location.coords.longitude
      );
      setTitikKoordinatSampling(formattedCoordinates);
    } catch (error) {
      console.error("Error getting location:", error);
      setErrorMsg("Error getting location");
    }
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
                  onChangeText={(PenamaanTitik) =>
                    setPenamaanTitik(PenamaanTitik)
                  }
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
                  onChangeText={(PenamaanTambahan) =>
                    setPenamaanTambahan(PenamaanTambahan)
                  }
                  underlineColorAndroid="#f000"
                  placeholder="Enter Penamaan Tambahan"
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="sentences"
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              </View>
              <View style={styles.SectionStyle}>
                <Text style={styles.textLabel}>Sumber Kebisingan</Text>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={(SumberKebisingan) =>
                    setSumberKebisingan(SumberKebisingan)
                  }
                  underlineColorAndroid="#f000"
                  placeholder="Enter Penamaan Tambahan"
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="sentences"
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              </View>
              <View style={styles.SectionStyle}>
                <Text style={styles.textLabel}>Jenis Frekuensi</Text>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={(JenisFrekuensi) =>
                    setJenisFrekuensi(JenisFrekuensi)
                  }
                  underlineColorAndroid="#f000"
                  placeholder="Enter Penamaan Tambahan"
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="sentences"
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              </View>
              <View>
                <View style={styles.SectionStyle}>
                  <Text style={styles.textLabel}>Titik Koordinat Sampling</Text>
                  <TextInput
                    style={styles.inputStyle}
                    onChangeText={(text) => setTitikKoordinatSampling(text)}
                    value={titikKoordinatSampling}
                    underlineColorAndroid="#f000"
                    placeholder="Titik Koordinat Sampling"
                    placeholderTextColor="#8b9cb5"
                    autoCapitalize="sentences"
                    returnKeyType="next"
                    blurOnSubmit={false}
                  />
                </View>

                {/* <Text>Location: {JSON.stringify(location)}</Text> */}
                {errorMsg && <Text>Error: {errorMsg}</Text>}
                <Button title="Get Location" onPress={getLocation} />
              </View>
              <View style={styles.SectionStyle}>
                <Text style={styles.textLabel}>Jam Pengambilan</Text>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={(JamPengambilan) =>
                    setJamPengambilan(JamPengambilan)
                  }
                  underlineColorAndroid="#f000"
                  placeholder="Enter Penamaan Tambahan"
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="sentences"
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              </View>
              <View style={styles.SectionStyle}>
                <Text style={styles.textLabel}>Jenis Pengujian</Text>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={(JenisPengujian) =>
                    setJenisPengujian(JenisPengujian)
                  }
                  underlineColorAndroid="#f000"
                  placeholder="Enter Penamaan Tambahan"
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="sentences"
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              </View>
              <View style={styles.SectionStyle}>
                <Text style={styles.textLabel}>Kategori Pengujian</Text>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={(KategoriPengujian) =>
                    setKategoriPengujian(KategoriPengujian)
                  }
                  underlineColorAndroid="#f000"
                  placeholder="Enter Penamaan Tambahan"
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="sentences"
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              </View>
              <View style={styles.SectionStyle}>
                <Text style={styles.textLabel}>Shift Pengambilan</Text>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={(ShiftPengambilan) =>
                    setShiftPengambilan(ShiftPengambilan)
                  }
                  underlineColorAndroid="#f000"
                  placeholder="Enter Penamaan Tambahan"
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="sentences"
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              </View>
              <View style={styles.SectionStyle}>
                <Text style={styles.textLabel}>Suhu Udara</Text>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={(SuhuUdara) => setSuhuUdara(SuhuUdara)}
                  underlineColorAndroid="#f000"
                  placeholder="Enter Penamaan Tambahan"
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="sentences"
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              </View>
              <View style={styles.SectionStyle}>
                <Text style={styles.textLabel}>Kelembapan Udara</Text>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={(KelembapanUdara) =>
                    setKelembapanUdara(KelembapanUdara)
                  }
                  underlineColorAndroid="#f000"
                  placeholder="Enter Penamaan Tambahan"
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="sentences"
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              </View>
              <View style={styles.SectionStyle}>
                <Text style={styles.textLabel}>Data</Text>
                <TextInput
                  style={styles.inputDataArray}
                  onChangeText={handleInputChange}
                  underlineColorAndroid="#f000"
                  placeholder="Enter Data"
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="sentences"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  value={currentInput}
                />
                <Text>Current Data Array: {JSON.stringify(dataArray)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                {!showCamera && (
                  <TouchableOpacity
                    style={styles.buttonTake}
                    onPress={openCamera}
                  >
                    <Text style={styles.textTake}>Open Camera</Text>
                  </TouchableOpacity>
                )}

                {showCamera && (
                  <View style={styles.cameraContainer}>
                    <Camera
                      style={styles.camera}
                      type={Camera.Constants.Type.back}
                      ref={(ref) => setCamera(ref)}
                    >
                      <TouchableOpacity
                        style={styles.buttonTakePicture}
                        onPress={takePicture}
                      >
                        <Text style={styles.textTake}>Take Picture</Text>
                      </TouchableOpacity>
                    </Camera>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.buttonTake}
                  onPress={closeCamera}
                >
                  <Text style={styles.textTake}>Close Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonBrowse}
                  onPress={openGallery}
                >
                  <Text style={styles.textBrowse}>Browse from gallery</Text>
                </TouchableOpacity>
              </View>

              {image && (
                <Image
                  source={{ uri: image }}
                  style={{ width: 200, height: 200 }}
                />
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
  buttonTake: {
    alignItems: "center",
    backgroundColor: "blue",
    padding: 10,
    margin: 20,
  },
  buttonBrowse: {
    alignItems: "center",
    backgroundColor: "blue",
    padding: 10,
    margin: 20,
  },
  buttonTakePicture: {
    alignItems: "center",
    backgroundColor: "red",
    padding: 10,
    margin: 20,
  },
  textTake: {
    color: "white",
    fontSize: 16,
  },
  textBrowse: {
    color: "white",
    fontSize: 16,
  },
  cameraContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    width: 300, // Set the desired width
    height: 400, // Set the desired height
  },
  SectionStyle: {
    flexDirection: "column",
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
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
