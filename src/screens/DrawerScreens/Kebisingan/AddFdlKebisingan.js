import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  SafeAreaView,
  TextInput,
  Vibration,
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
import Modal from "react-native-modal";
import SelectDropdown from "react-native-select-dropdown";

import Loader from "../../../components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNetInfo } from "@react-native-community/netinfo";
import { Camera, FlashMode } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import { Icon, IconButton, MD3Colors } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import DataFormFdl from "../../../components/DataFormFdl";

// import stateStorage from "../../../components/stateStorageKebisingan";
import stateStorageKebisingan from "../../../components/stateStorageKebisingan";

const AddFdlKebisingan = ({ navigation }) => {
  const { storage, storeSate } = stateStorageKebisingan("kebisingan");
  const netInfo = useNetInfo();
  const jenisFdl = ["kebisingan", "air"];
  const [selectedJenisFdl, setSelectedJenisFdl] = useState(jenisFdl[0]);
  const [noSample, setNosample] = useState(storage.no_sample);
  const [penamaanTitik, setPenamaanTitik] = useState(storage.keterangan_4);
  const [penamaanTambahan, setPenamaanTambahan] = useState(
    storage.penamaanTambahan
  );
  const [sumberKebisingan, setSumberKebisingan] = useState(storage.sumber_keb);
  const [jenisFrekuensi, setJenisFrekuensi] = useState(storage.jen_frek);
  const [titikKoordinatSampling, setTitikKoordinatSampling] = useState(
    storage.posisi
  );
  const [jamPengambilan, setJamPengambilan] = useState(storage.waktu);
  const [jenisPengujian, setJenisPengujian] = useState(storage.jenisPengujian);
  const [kategoriPengujian, setKategoriPengujian] = useState(
    storage.jenis_durasi
  );
  const [shiftPengambilan, setShiftPengambilan] = useState(
    storage.shiftPengambilan
  );
  const [shift_, setShift_] = useState(storage.shift_);
  const [suhuUdara, setSuhuUdara] = useState(storage.suhu_udara);
  const [kelembapanUdara, setKelembapanUdara] = useState(
    storage.kelembapan_udara
  );
  const [lat, setLat] = useState(storage.lat);
  const [longi, setLongi] = useState(storage.longi);
  const [fotoLain, setFotoLain] = useState(storage.foto_lain);
  const [fotoLok, setFotoLok] = useState(storage.foto_lok);

  const [isEditing, setIsEditing] = useState(false);

  const [dataArray, setDataArray] = useState([]);
  const [showData_, setShowData_] = useState(true);
  const [loopData, setLoopData] = useState([]);
  const [showLoopData, setShowLoopData] = useState(FlashMode);
  const [inputValues, setInputValues] = useState([]);

  const [currentInput, setCurrentInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [sec, setSec] = useState(1);

  const [tanggal, setTanggal] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [Cam, setCam] = useState("");

  const [isModalVisible, setIsModalVisible] = React.useState(false); // state modal hide

  const [cameraVisible, setCameraVisible] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [imageLain, setImageLain] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [showCloseButton, setShowCloseButton] = useState(false);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const kategoriPengujianRef = useRef();

  useEffect(() => {
    // Update the state when the data is fetched
    setNosample(storage.no_sample);
    setPenamaanTitik(storage.keterangan_4)
    setPenamaanTambahan(storage.penamaanTambahan);
    setSumberKebisingan(storage.sumber_keb);
    setJenisFrekuensi(storage.jen_frek);
    setTitikKoordinatSampling(storage.posisi);
    setJamPengambilan(storage.waktu);
    setJenisPengujian(storage.jenisPengujian);
    setKategoriPengujian(storage.jenis_durasi);
    setShiftPengambilan(storage.shiftPengambilan);
    setShift_(storage.shift_);
    setSuhuUdara(storage.suhu_udara);
    setKelembapanUdara(storage.kelembapan_udara);
    setLat(storage.lat);
    setLongi(storage.longi);
    setFotoLain(storage.foto_lain);
    setFotoLok(storage.foto_lok);
  }, [
    storage.no_sample,
    storage.keterangan_4,
    storage.penamaanTambahan,
    storage.sumber_keb,
    storage.jen_frek,
    storage.posisi,
    storage.waktu,
    storage.jenisPengujian,
    storage.jenis_durasi,
    storage.shiftPengambilan,
    storage.shift_,
    storage.suhu_udara,
    storage.kelembapan_udara,
    storage.lat,
    storage.longi,
    storage.foto_lain,
    storage.foto_lok,
  ]);

  console.log("cek", noSample);

  useEffect(() => {
    AsyncStorage.getItem("access").then((value) => {
      var token = JSON.parse(value);
      if (new Date() >= new Date(token.expired)) {
        Alert.alert(
          "Token has been Expired.!",
          "Please Online to Re-Login",
          [
            {
              text: "Ok",
              onPress: () => {
                AsyncStorage.removeItem("token");
                props.navigation.replace("Auth");
              },
            },
          ],
          { cancelable: false }
        );
      }
    });
  });

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
    Calculate();
    const timeoutId = setTimeout(() => {
      if (currentInput.trim() != "") {
        if (currentInput < 40.0) {
          Vibration.vibrate();
          Alert.alert("Data tidak boleh dibawah 40.0");
          setCurrentInput("");
        } else if (currentInput > 120.0) {
          Vibration.vibrate();
          Alert.alert("Data tidak boleh diatas 120.0");
          setCurrentInput("");
        } else {
          setDataArray((prevData) => [...prevData, currentInput]);
          setSec(dataArray.length + 2);
          setCurrentInput("");
          storeSate({ kebisingan: (prevData) => [...prevData, currentInput] });
        }
      }
    }, 5000);
    return () => clearTimeout(timeoutId);
  }, [currentInput, dataArray]);

  const Calculate = async () => {
    if (dataArray.length == 5) {
      setShowData_(false);
      RenderInput(dataArray);
    }
  };

  //   const storeSate = async (data) => {
  //     local.storeSate(data);
  //   };

  const RenderInput = async (data) => {
    var body = [];
    body.push(<Text style={styles.textLabelLoop}>Data Kebisingan</Text>);
    for (let i = 0; i < data.length; i++) {
      body.push(
        <TextInput
          style={styles.inputStyleLoop}
          value={data[i]}
          key={i}
          keyboardType="number-pad"
          underlineColorAndroid="#f000"
          placeholder="Enter Data"
          placeholderTextColor="#8b9cb5"
          autoCapitalize="sentences"
          returnKeyType="next"
          editable={true}
          onChangeText={(text) => handleTextChange(text, i, data)}
          blurOnSubmit={false}
        ></TextInput>
      );
    }
    setLoopData(body);
    setShowLoopData(true);
  };

  const handleTextChange = (text, index, data) => {
    // Update the data array with the edited text

    setCurrentInput("");
    const newData = [...data];
    newData[index] = text;
    console.log(newData);

    // Assuming currentInput is a state variable
    setCurrentInput(newData.join("")); // Join the array into a string if needed
  };

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
    if (regex.test(input) || input === "") {
      setCurrentInput(input);
    }
  };

  const takePicture = async () => {
    if (camera) {
      const options = { quality: 0.5, base64: true, skipProcessing: true };
      const photo = await camera.takePictureAsync(options);

      if (Cam == 1) {
        setImage(photo.uri);
        setFotoLok("data:image/jpeg;base64," + base64Image);
        storeSate({ foto_lok: "data:image/jpeg;base64," + base64Image });
      } else if (Cam == 2) {
        setImageLain(photo.uri);
        setFotoLain("data:image/jpeg;base64," + base64Image);
        storeSate({ foto_lain: "data:image/jpeg;base64," + base64Image });
      }
      if (photo.assets && photo.assets.length > 0) {
        const selectedAsset = photo.assets[0];
      }

      const base64Image = await convertImageToBase64(photo.uri);

      closeCamera();
    }
    handleModal();
  };

  const MAX_FILE_SIZE = 300 * 1024;

  const convertImageToBase64 = async (imageUri) => {
    try {
      // Read the image file
      const fileContent = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const { width, height } = await ImageManipulator.manipulateAsync(
        imageUri,
        [],
        { format: "jpeg" }
      );

      const scaleFactor = Math.min(1, MAX_FILE_SIZE / fileContent.length);
      const newWidth = Math.floor(width * scaleFactor);
      const newHeight = Math.floor(height * scaleFactor);

      const resizedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: newWidth, height: newHeight } }],
        { format: "jpeg" }
      );

      const resizedFileContent = await FileSystem.readAsStringAsync(
        resizedImage.uri,
        {
          encoding: FileSystem.EncodingType.Base64,
        }
      );

      console.log(resizedFileContent);

      return resizedFileContent;
    } catch (error) {
      console.error("Error converting image to base64:", error);
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
            if (responseJson.message) {
              setErrortext(responseJson.message);
            } else {
              console.log(responseJson);
                setPenamaanTitik(responseJson.keterangan);
              setShowForm(true);
              setCameraVisible(true);
                storeSate({ keterangan_4: responseJson.keterangan });
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

  const showDate = () => {
    setShowPicker(true);
  };

  const onChange = (event, selectedDate) => {
    setShowPicker(false);
    // setTanggal(selectedDate);
    // var date = new Date(selectedDate);
    // var time = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2)
    // setJamPengambilan(time)
    if (selectedDate) {
      setTanggal(selectedDate);
      var date = new Date(selectedDate);
      var time =
        ("0" + date.getHours()).slice(-2) +
        ":" +
        ("0" + date.getMinutes()).slice(-2);
      // const formattedTime = format(selectedDate, 'HH:mm', { locale: enUS });
      setJamPengambilan(time);

      // Store the selected time
      storeSate({ waktu: time });
    }
  };

  const handleSaveButton = () => {
    // Implement logic to save the form data
    // Reset or navigate as needed
  };

  const handleCancelButton = () => {
    setShowForm(false);
    // setNosample("");
    setImage(null);
    setImageLain(null);
    setCameraVisible(false);
    // Add any other logic you need for cancel
  };

  const openCamera = (res) => {
    handleModal();
    if (res == 1) {
      setCam(1);
    } else if (res == 2) {
      setCam(2);
    }
    setShowCamera(true);
  };

  const closeCamera = () => {
    setShowCamera(false);
    setShowCloseButton(false);
    handleModal();
  };

  const handleFotoLokasi = () => {
    openCamera(1);
  };

  const handleFotoLain = () => {
    openCamera(2);
  };

  const toggleCameraType = () => {
    // setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    setType((prevCameraType) =>
      prevCameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
    // console.log("diclik", type);
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

      const lat = location.coords.latitude;
      const longi = location.coords.longitude;

      console.log(longi);
      console.log(lat);

      setLat(lat);
      setLongi(longi);
      storeSate({ lat: lat });
      storeSate({ longi: longi });

      const formattedCoordinates = formatCoordinates(
        location.coords.latitude,
        location.coords.longitude
      );
      setTitikKoordinatSampling(formattedCoordinates);
      storeSate({ posisi: formatCoordinates });
    } catch (error) {
      console.error("Error getting location:", error);
      setErrorMsg("Error getting location");
    }
  };

  const handleModal = () => setIsModalVisible(() => !isModalVisible);

  const frekuensi = [
    "Bising Kontiniu",
    "Bising Intermitten",
    "Bising Impulsif",
    "Bising Impulsif Berulang",
  ];
  const pengujian = ["Ambient", "Lingkungan Kerja"];
  const kategori_pengujian = [
    { kategori: "Sesaat", shift: [] },
    {
      kategori: "8 Jam",
      shift: ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8"],
    },
    {
      kategori: "24 Jam",
      shift: [
        "L1",
        "L2",
        "L3",
        "L4",
        "L5",
        "L6",
        "L7",
        "L8",
        "L9",
        "L10",
        "L11",
        "L12",
        "L13",
        "L14",
        "L15",
        "L16",
        "L17",
        "L18",
        "L19",
        "L20",
        "L21",
        "L22",
        "L23",
        "L24",
      ],
    },
  ];

  return (
    <>
      <DataFormFdl
        jenisFdl={selectedJenisFdl}
        storage={storage}
        storeSate={storeSate}
        Calculate={Calculate}
        RenderInput={RenderInput}
        handleTextChange={handleTextChange}
        formatCoordinates={formatCoordinates}
        handleInputChange={handleInputChange}
        takePicture={takePicture}
        convertImageToBase64={convertImageToBase64}
        handleSubmitButton={handleSubmitButton}
        showDate={showDate}
        onChange={onChange}
        handleSaveButton={handleSaveButton}
        handleCancelButton={handleCancelButton}
        handleFotoLokasi={handleFotoLokasi}
        handleFotoLain={handleFotoLain}
        toggleCameraType={toggleCameraType}
        getLocation={getLocation}
        noSample={noSample}
        setNosample={setNosample}
        penamaanTitik={penamaanTitik}
        setPenamaanTitik={setPenamaanTambahan}
        penamaanTambahan={penamaanTambahan}
        setPenamaanTambahan={setPenamaanTambahan}
        sumberKebisingan={sumberKebisingan}
        setSumberKebisingan={setSumberKebisingan}
        jenisFrekuensi={jenisFrekuensi}
        setJenisFrekuensi={setJenisFrekuensi}
        titikKoordinatSampling={titikKoordinatSampling}
        setTitikKoordinatSampling={setTitikKoordinatSampling}
        jamPengambilan={jamPengambilan}
        setJamPengambilan={setJamPengambilan}
        errortext={errortext}
        setErrortext={setErrortext}
        showForm={showForm}
        setShowForm={setShowForm}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        jenisPengujian={jenisPengujian}
        setJenisPengujian={setJenisPengujian}
        kategoriPengujian={kategoriPengujian}
        setKategoriPengujian={setKategoriPengujian}
        shiftPengambilan={shiftPengambilan}
        setShiftPengambilan={setShiftPengambilan}
        suhuUdara={suhuUdara}
        setSuhuUdara={setSuhuUdara}
        kelembapanUdara={kelembapanUdara}
        setKelembapanUdara={setKelembapanUdara}
        lat={lat}
        setLat={setLat}
        longi={longi}
        setLongi={setLongi}
        fotoLain={fotoLain}
        setFotoLain={setFotoLain}
        fotoLok={fotoLok}
        setFotoLok={setFotoLok}
        frekuensi={frekuensi}
        pengujian={pengujian}
        kategori_pengujian={kategori_pengujian}
        showPicker={showPicker}
        setShowPicker={setShowPicker}
        shift_={shift_}
        setShift_={setShift_}
        showData_={showData_}
        setShowData_={setShowData_}
        sec={sec}
        setSec={setSec}
        currentInput={currentInput}
        setCurrentInput={setCurrentInput}
        showLoopData={showLoopData}
        setShowLoopData={setShowLoopData}
        loopData={loopData}
        setLoopData={setLoopData}
        image={image}
        setImage={setImage}
        imageLain={imageLain}
        setImageLain={setImageLain}
        loading={loading}
        setLoading={setLoading}
        showCamera={showCamera}
        setShowCamera={setShowCamera}
        tanggal={tanggal}
        setTanggal={setTanggal}
        isModalVisible={isModalVisible}
        type={type}
        closeCamera={closeCamera}
        setCamera={setCamera}
      />
    </>
  );
};

const styles = StyleSheet.create({
  textLabelLoop: {
    fontSize: 16,
    marginBottom: 8,
    marginLeft: 10,
    textAlign: "left",
    flexWrap: "wrap",
    width: "100%",
  },
  inputStyleLoop: {
    flex: 1,
    color: "black",
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#dadae8",
    fontSize: 16,
    height: 40,
    alignSelf: "flex-start",
    minWidth: "22%",
    margin: 5,
  },
});

export default AddFdlKebisingan;
