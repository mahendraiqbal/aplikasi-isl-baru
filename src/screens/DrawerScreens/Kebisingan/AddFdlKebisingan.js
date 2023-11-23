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
import SelectDropdown from 'react-native-select-dropdown'

import Loader from "../../../components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNetInfo } from "@react-native-community/netinfo";
import { Camera, FlashMode } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { Icon, IconButton, MD3Colors } from "react-native-paper";
import DateTimePicker from '@react-native-community/datetimepicker';

import stateStorage from "../../../components/stateStorageKebisingan";

const AddFdlKebisingan = ({ navigation }) => {
    const local = stateStorage('kebisingan');
    const netInfo = useNetInfo();
    const [noSample, setNosample] = useState(local.no_sample);
    const [penamaanTitik, setPenamaanTitik] = useState(local.keterangan_4);
    const [penamaanTambahan, setPenamaanTambahan] = useState(local.penamaanTambahan);
    const [sumberKebisingan, setSumberKebisingan] = useState(local.sumber_keb);
    const [jenisFrekuensi, setJenisFrekuensi] = useState(local.jen_frek);
    const [titikKoordinatSampling, setTitikKoordinatSampling] = useState(local.posisi);
    const [jamPengambilan, setJamPengambilan] = useState(local.waktu);
    const [jenisPengujian, setJenisPengujian] = useState(local.jenisPengujian);
    const [kategoriPengujian, setKategoriPengujian] = useState(local.jenis_durasi);
    const [shiftPengambilan, setShiftPengambilan] = useState(local.shiftPengambilan);
    const [shift_, setShift_] = useState(local.shift_);
    const [suhuUdara, setSuhuUdara] = useState(local.suhu_udara);
    const [kelembapanUdara, setKelembapanUdara] = useState(local.kelembapan_udara);
    const [lat, setLat] = useState(local.lat);
    const [longi, setLongi] = useState(local.longi);
    const [fotoLain, setFotoLain] = useState(local.foto_lain);
    const [fotoLok, setFotoLok] = useState(local.foto_lok);
    
    const [isEditing, setIsEditing] = useState(false);

    const [dataArray, setDataArray] = useState([]);
    const [showData_, setShowData_] = useState(true);
    const [loopData, setLoopData] = useState([]);
    const [showLoopData, setShowLoopData] = useState(FlashMode);

    const [currentInput, setCurrentInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [errortext, setErrortext] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [sec, setSec] = useState(1);

    const [tanggal, setTanggal] = useState(new Date())
    const [showPicker, setShowPicker] = useState(false);

    const [Cam, setCam] = useState('');

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

    

    useEffect(()=>{
        
        AsyncStorage.getItem('access').then((value) => {
            var token = JSON.parse(value)
            if(new Date() >= new Date(token.expired)){
                Alert.alert(
                    'Token has been Expired.!',
                    'Please Online to Re-Login',
                    [
                        {
                            text: 'Ok',
                            onPress: () => {
                                AsyncStorage.removeItem('token');
                                props.navigation.replace('Auth');
                            },
                        },
                    ],
                    { cancelable: false },
                );
            }
        });
    })

    useEffect(() => {
        console.log(local);
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
                    Vibration.vibrate()
                    Alert.alert('Data tidak boleh dibawah 40.0')
                    setCurrentInput("");
                } else if (currentInput > 120.0) {
                    Vibration.vibrate()
                    Alert.alert('Data tidak boleh diatas 120.0')
                    setCurrentInput("");
                } else {
                    setDataArray((prevData) => [...prevData, currentInput]);
                    setSec(dataArray.length + 2);
                    setCurrentInput("");
                    storeSate({kebisingan: (prevData) => [...prevData, currentInput]})
                }
            }
        }, 5000);
        return () => clearTimeout(timeoutId);
    }, [currentInput]);

    const Calculate = async () => {
        if (dataArray.length == 120) {
            setShowData_(false)
            RenderInput(dataArray)
        }
    
    }
    
    const storeSate = async (data) => {
        try {
            AsyncStorage.getItem('kebisingan').then((value) => {
                let array = JSON.parse(value)
                array = {...array, ...data}

                AsyncStorage.setItem('kebisingan', JSON.stringify(array));
                AsyncStorage.getItem('kebisingan').then((item) => {
                    console.log(item)
                })
            })
        } catch (error) {
            Alert.alert('Can not Sync..')
        }
    }

    const RenderInput = async (data) => {
        var body = [];
        body.push(<Text style={styles.textLabelLoop}>Data Kebisingan</Text>)
        for (let i = 0; i < data.length; i++) {
            body.push(
                <TextInput style={styles.inputStyleLoop}
                    value={data[i]}
                    keyboardType='number-pad'
                    underlineColorAndroid="#f000"
                    placeholder="Enter Data"
                    placeholderTextColor="#8b9cb5"
                    autoCapitalize="sentences"
                    returnKeyType="next"
                    blurOnSubmit={false}>
                </TextInput>
            )
        }
        setLoopData(body);
        setShowLoopData(true);
    }

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
            console.log(input)
        }
    };

    const takePicture = async () => {

        if (camera) {
            const options = { quality: 0.5, base64: true, skipProcessing: true };
            const photo = await camera.takePictureAsync(options);

            
            if (Cam == 1) {
                setImage(photo.uri);
                setFotoLok('data:image/jpeg;base64,'+base64Image);
                storeSate({ foto_lok: 'data:image/jpeg;base64,'+base64Image});
            } else if (Cam == 2) {
                setImageLain(photo.uri);
                setFotoLain('data:image/jpeg;base64,'+base64Image);
                storeSate({ foto_lain: 'data:image/jpeg;base64,'+base64Image});
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
            { format: 'jpeg' } 
          );

          const scaleFactor = Math.min(1, MAX_FILE_SIZE / fileContent.length);
          const newWidth = Math.floor(width * scaleFactor);
          const newHeight = Math.floor(height * scaleFactor);

          const resizedImage = await ImageManipulator.manipulateAsync(
            imageUri,
            [{ resize: { width: newWidth, height: newHeight } }],
            { format: 'jpeg' } 
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
          console.error('Error converting image to base64:', error);
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
                            setPenamaanTitik(responseJson.keterangan)
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

    const showDate = () => {
        setShowPicker(true)
    }

    const onChange = (event, selectedDate) => {
        setShowPicker(false);
        // setTanggal(selectedDate);
        // var date = new Date(selectedDate);
        // var time = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2)
        // setJamPengambilan(time)
        if (selectedDate) {
            setTanggal(selectedDate);
            var date = new Date(selectedDate);
            var time = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2)
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
            setCam(1)
        } else if (res == 2) {
            setCam(2)
        }
        setShowCamera(true);
    };

    const closeCamera = () => {
        setShowCamera(false);
        setShowCloseButton(false);
        handleModal();
    };

    const handleFotoLokasi = () => {
        openCamera(1)
    }

    const handleFotoLain = () => {
        openCamera(2)
    }

    const toggleCameraType = () => {
        // setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
        setType((prevCameraType) =>
            prevCameraType === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
        );
        console.log('diclik', type)
    }

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

            const lat = location.coords.latitude;
            const longi = location.coords.longitude;

            console.log(longi);
            console.log(lat);

            setLat(lat);
            setLongi(longi);
            storeSate({lat: lat});
            storeSate({longi: longi})

            const formattedCoordinates = formatCoordinates(
                location.coords.latitude,
                location.coords.longitude
            );
            setTitikKoordinatSampling(formattedCoordinates);
            storeSate({posisi: formatCoordinates})
        } catch (error) {
            console.error("Error getting location:", error);
            setErrorMsg("Error getting location");
        }
    };

    const handleModal = () => setIsModalVisible(() => !isModalVisible);

    const frekuensi = ["Bising Kontiniu", "Bising Intermitten", "Bising Impulsif", "Bising Impulsif Berulang"];
    const pengujian = ["Ambient", "Lingkungan Kerja"];
    const kategori_pengujian = [
        { kategori: 'Sesaat', shift: [] },
        { kategori: '8 Jam', shift: ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8"] },
        { kategori: '24 Jam', shift: ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8", "L9", "L10", "L11", "L12", "L13", "L14", "L15", "L16", "L17", "L18", "L19", "L20", "L21", "L22", "L23", "L24"] }
    ];

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
                            onChangeText={(NoSample) => {
                                setNosample(NoSample)
                                var val = new Object();
                                val.no_sample = NoSample;
                                storeSate(val)
                            }}

                            underlineColorAndroid="#f000"
                            placeholder="Enter No Sample"
                            placeholderTextColor="#8b9cb5"
                            autoCapitalize="sentences"
                            returnKeyType="next"
                            blurOnSubmit={false}
                            value={noSample}
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

                            <View style={styles.SectionStyle}>
                                <Text style={styles.textLabel}>Penamaan Titik</Text>
                                <TextInput
                                    style={styles.inputStyle}
                                    onChangeText={(PenamaanTitik) => {
                                        setPenamaanTitik(PenamaanTitik);
                                        var val = new Object();
                                        val.keterangan_4 = PenamaanTitik;
                                        storeSate(val);
                                    }}
                                    value={penamaanTitik}
                                    editable={true}
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
                                    onChangeText={(PenamaanTambahan) => {
                                        setPenamaanTambahan(PenamaanTambahan)
                                        var val = new Object();
                                        val.penamaanTambahan = PenamaanTambahan;
                                        storeSate(val)
                                    }
                                    }
                                    underlineColorAndroid="#f000"
                                    placeholder="Enter Penamaan Tambahan"
                                    placeholderTextColor="#8b9cb5"
                                    autoCapitalize="sentences"
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                    value={isEditing ? local.penamaanTambahan : penamaanTambahan}
                                    editable={true}
                                />
                            </View>
                            <View style={styles.SectionStyle}>
                                <Text style={styles.textLabel}>Sumber Kebisingan</Text>
                                <TextInput
                                    style={styles.inputStyle}
                                    onChangeText={(SumberKebisingan) => {
                                        SumberKebisingan = SumberKebisingan || '';

                                        setSumberKebisingan(SumberKebisingan)
                                        var val = new Object();
                                        val.sumber_keb = SumberKebisingan;
                                        storeSate(val)
                                    }
                                    }
                                    underlineColorAndroid="#f000"
                                    placeholder="Enter Sumber Kebisingan"
                                    placeholderTextColor="#8b9cb5"
                                    autoCapitalize="sentences"
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                    value={isEditing ? local.sumber_keb : sumberKebisingan}
                                    editable={true}
                                />
                            </View>
                            <View style={styles.SectionStyle}>
                                <Text style={styles.textLabel}>Jenis Frekuensi</Text>
                                <SelectDropdown
                                    style={styles.inputStyle}
                                    data={frekuensi}
                                    onSelect={(selectedItem, index) => {
                                        setJenisFrekuensi(selectedItem)
                                        var val = new Object();
                                        val.jen_frek = selectedItem;
                                        storeSate(val)
                                        console.log(selectedItem)
                                    }}
                                    defaultButtonText={'Select Frekuensi'}
                                    buttonStyle={styles.inputStyle}
                                    buttonTextStyle={{ fontSize: 16 }}
                                />
                            </View>
                            <View>
                                <Text style={{ marginLeft: 20, marginTop: 10, fontSize: 16 }}>Titik Koordinat Sampling</Text>
                                <View style={styles.SectionStyleLocation}>
                                    <TextInput style={styles.inputLocation}
                                        onChangeText={(text) => {
                                            setTitikKoordinatSampling(text)
                                            var val = new Object();
                                            val.posisi = text;
                                            storeSate(val)
                                        }
                                        }
                                        value={titikKoordinatSampling}
                                        underlineColorAndroid="#f000"
                                        placeholder="Titik Koordinat Sampling"
                                        placeholderTextColor="#8b9cb5"
                                        autoCapitalize="sentences"
                                        returnKeyType="next"
                                        blurOnSubmit={false}
                                    />
                                    <TouchableOpacity
                                        style={styles.buttonStyleLocation}
                                        activeOpacity={0.5}
                                        onPress={getLocation}
                                    >
                                        <Text style={styles.buttonTextStyle}>Get Location</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>

                            <View style={styles.SectionRow}>
                                <View style={styles.SectionStyleRow}>
                                    <Text style={styles.textLabel}>Jam Pengambilan</Text>
                                    <View style={styles.SectionRow}>
                                        <TextInput
                                            style={styles.inputStyle}
                                            onChangeText={(JamPengambilan) => {
                                                setJamPengambilan(JamPengambilan)
                                                console.log(jamPengambilan)
                                                storeSate({ jamPengambilan: JamPengambilan });
                                            }
                                            }
                                            editable={false}
                                            value={jamPengambilan}
                                            underlineColorAndroid="#f000"
                                            placeholder="Enter Jam Pengambilan"
                                            placeholderTextColor="#8b9cb5"
                                            autoCapitalize="sentences"
                                            returnKeyType="next"
                                            blurOnSubmit={false}
                                        />
                                        {showPicker && (
                                            <DateTimePicker
                                                mode={'time'}
                                                value={tanggal}
                                                is24Hour={true}
                                                display="default"
                                                onChange={onChange} />
                                        )}
                                        <TouchableOpacity style={{ backgroundColor: 'green', borderRadius: 10, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                                            <IconButton icon="clock-time-three-outline" size={20} iconColor={MD3Colors.secondary100} onPress={showDate} ></IconButton>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.SectionStyleRow}>
                                    <Text style={styles.textLabel}>Jenis Pengujian</Text>
                                    <SelectDropdown
                                        style={styles.inputStyle}
                                        data={pengujian}
                                        onSelect={(selectedItem, index) => {
                                            setJenisPengujian(selectedItem)
                                            var val = new Object();
                                            val.jenisPengujian = selectedItem;
                                            storeSate(val)
                                            console.log(selectedItem)
                                        }}
                                        defaultButtonText={'Select Jenis Pengujian'}
                                        buttonStyle={styles.inputStyle}
                                        buttonTextStyle={{ fontSize: 16 }}
                                    />

                                </View>
                            </View>

                            <View style={styles.SectionRow}>
                                <View style={styles.SectionStyleRow}>
                                    <Text style={styles.textLabel}>Kategori Pengujian</Text>
                                    <SelectDropdown
                                        style={styles.inputStyle}
                                        data={kategori_pengujian}
                                        onSelect={(selectedItem, index) => {
                                            kategoriPengujianRef.current.reset()
                                            console.log(selectedItem.kategori)
                                            setKategoriPengujian(selectedItem.kategori)
                                            setShift_(selectedItem.shift)
                                            var val = new Object();
                                            val.jenis_durasi = selectedItem.kategori;
                                            // val.shift_ = selectedItem.shift;
                                            storeSate(val)
                                        }}
                                        buttonTextAfterSelection={(selectedItem, index) => {
                                            return selectedItem.kategori;
                                        }}
                                        rowTextForSelection={(item, index) => {
                                            return item.kategori;
                                        }}
                                        defaultButtonText={'Select Jenis Pengujian'}
                                        buttonStyle={styles.inputStyle}
                                        buttonTextStyle={{ fontSize: 15 }}
                                    />
                                </View>
                                <View style={styles.SectionStyleRow}>
                                    <Text style={styles.textLabel}>Shift Pengambilan</Text>
                                    <SelectDropdown
                                        style={styles.inputStyle}
                                        ref={kategoriPengujianRef}
                                        data={shift_}
                                        onSelect={(selectedItem, index) => {
                                            setShiftPengambilan(selectedItem)
                                            var val = new Object();
                                            val.shiftPengambilan = selectedItem;
                                            storeSate(val)
                                            console.log(selectedItem)
                                        }}
                                        defaultButtonText={'Select Shift'}
                                        buttonStyle={styles.inputStyle}
                                        buttonTextStyle={{ fontSize: 15 }}
                                    />
                                </View>
                            </View>

                            <View style={styles.SectionRow}>
                                <View style={styles.SectionStyleRow}>
                                    <Text style={styles.textLabel}>Suhu Udara</Text>
                                    <TextInput
                                        style={styles.inputStyle}
                                        keyboardType='number-pad'
                                        onChangeText={(SuhuUdara) => {
                                            setSuhuUdara(SuhuUdara)
                                            var val = new Object();
                                            val.suhu_udara = SuhuUdara;
                                            storeSate(val)
                                        } 
                                        }
                                        underlineColorAndroid="#f000"
                                        placeholder="Enter Suhu Udara"
                                        placeholderTextColor="#8b9cb5"
                                        autoCapitalize="sentences"
                                        returnKeyType="next"
                                        blurOnSubmit={false}
                                    />
                                </View>
                                <View style={styles.SectionStyleRow}>
                                    <Text style={styles.textLabel}>Kelembapan Udara</Text>
                                    <TextInput
                                        style={styles.inputStyle}
                                        keyboardType='number-pad'
                                        onChangeText={(KelembapanUdara) => {
                                            setKelembapanUdara(KelembapanUdara)
                                            var val = new Object();
                                            val.kelembapan_udara = KelembapanUdara;
                                            storeSate(val)
                                        }
                                        }
                                        underlineColorAndroid="#f000"
                                        placeholder="Enter Kelembapan Udara"
                                        placeholderTextColor="#8b9cb5"
                                        autoCapitalize="sentences"
                                        returnKeyType="next"
                                        blurOnSubmit={false}
                                    />
                                </View>
                            </View>

                            <View style={styles.SectionStyle}>
                                {showData_ && (<Text style={styles.textLabel}>Data Ke - {sec}</Text>)}
                                {showData_ && (
                                    <TextInput
                                        style={styles.inputStyle}
                                        onChangeText={handleInputChange}
                                        keyboardType='number-pad'
                                        underlineColorAndroid="#f000"
                                        placeholder="Enter Data"
                                        placeholderTextColor="#8b9cb5"
                                        autoCapitalize="sentences"
                                        returnKeyType="next"
                                        blurOnSubmit={false}
                                        value={currentInput}
                                    />
                                )}
                            </View>
                            {showLoopData && (
                                <SafeAreaView style={styles.SectionRowLoop}>
                                    {loopData}
                                </SafeAreaView>
                            )}
                            <View style={styles.SectionRow}>
                                <View style={styles.SectionStyleRow}>
                                    <Text style={styles.textLabel}>Lokasi Sampling</Text>
                                    <TouchableOpacity style={styles.buttonTake} onPress={handleFotoLokasi} >
                                        <View style={styles.SectionRow}>
                                            <Icon source="camera" color="white" size={20} />
                                            <Text style={styles.textTake}> Open Camera</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.SectionStyleRow}>
                                    <Text style={styles.textLabel}>Foto Lain-lain</Text>
                                    <TouchableOpacity style={styles.buttonTake} onPress={handleFotoLain} >
                                        <View style={styles.SectionRow}>
                                            <Icon source="camera" color="white" size={20} />
                                            <Text style={styles.textTake}> Open Camera</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.SectionRow}>
                                <View style={styles.SectionStyleRow}>
                                    {image && (
                                        <Image
                                            source={{ uri: image }}
                                            style={styles.imageRender}
                                        />
                                    )}
                                </View>
                                <View style={styles.SectionStyleRow}>
                                    {imageLain && (
                                        <Image
                                            source={{ uri: imageLain }}
                                            style={styles.imageRender}
                                        />
                                    )}
                                </View>
                            </View>

                            <View style={{ flex: 1 }}>
                                {showCamera && (
                                    <View style={styles.container}>
                                        <Modal isVisible={isModalVisible}>
                                            <Camera
                                                style={styles.camera}
                                                type={Camera.Constants.Type.back}
                                                ref={(ref) => setCamera(ref)}
                                            >
                                                <SafeAreaView style={styles.header}>
                                                    {/* <IconButton name="grid" onPress={} />
                                                    <IconButton name={} onPress={} /> */}
                                                </SafeAreaView>
                                                <SafeAreaView >
                                                    <View style={styles.footer}>
                                                        <IconButton onPress={closeCamera} icon="close" size={35} iconColor={MD3Colors.secondary100} />
                                                        <TouchableOpacity onPress={takePicture} >
                                                            <View style={styles.snapButton}>
                                                                <View style={styles.innerSnapButton}>
                                                                    <Icon source="camera" color="white" size={35} />
                                                                </View>
                                                            </View>
                                                        </TouchableOpacity>
                                                        <IconButton icon="rotate-360" size={35} onPress={toggleCameraType} iconColor={MD3Colors.secondary100} />
                                                    </View>
                                                </SafeAreaView>
                                            </Camera>
                                        </Modal>
                                    </View>

                                )}
                                {/* <TouchableOpacity
                                    style={styles.buttonBrowse}
                                    onPress={openGallery}
                                >
                                    <Text style={styles.textBrowse}>Browse from gallery</Text>
                                </TouchableOpacity> */}
                            </View>

                            {/* Save and Cancel Buttons */}
                            <View style={styles.SectionRow} marginBottom={30}>
                                <View style={styles.SectionStyleRow}>
                                    <TouchableOpacity
                                        style={styles.cancelButtonStyle}
                                        activeOpacity={0.5}
                                        onPress={handleCancelButton}
                                    >
                                        <Text style={styles.buttonTextStyle}>CANCEL</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.SectionStyleRow}>
                                    <TouchableOpacity
                                        style={styles.saveButtonStyle}
                                        activeOpacity={0.5}
                                        onPress={handleSaveButton}
                                    >
                                        <Text style={styles.buttonTextStyle}>SAVE</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </>
                    )}
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    text: {
        fontSize: 16,
        fontWeight: "400",
        textAlign: "center",
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: "80%",
    },

    buttonTake: {
        alignItems: "center",
        backgroundColor: "#1867e6",
        padding: 10,
        width: '100%',
        borderRadius: 10
    },

    buttonBrowse: {
        alignItems: "center",
        backgroundColor: "#1867e6",
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

    SectionStyle: {
        flexDirection: "column",
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20,
        margin: 10,
    },

    SectionStyleRow: {
        flexDirection: "column",
        marginTop: 10,
        marginLeft: 20,
        marginRight: 10,
        margin: 10,
        width: '41%'
    },

    SectionStyleLocation: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20,
        margin: 10,
    },

    SectionRow: {
        display: 'flex',
        flexDirection: 'row',
    },

    SectionRowLoop: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: "space-between",
        flexWrap: 'wrap',
    },

    textLabel: {
        fontSize: 16,
        marginBottom: 8,
        textAlign: "left",
    },

    textLabelLoop: {
        fontSize: 16,
        marginBottom: 8,
        marginLeft: 10,
        textAlign: "left",
        flexWrap: 'wrap',
        width: '100%'
    },
    buttonStyle: {
        backgroundColor: "green",
        borderWidth: 0,
        color: "#FFFFFF",
        borderColor: "green",
        height: 40,
        alignItems: "center",
        borderRadius: 10,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        marginBottom: 20,
        // width: '80%'
    },
    buttonStyleLocation: {
        backgroundColor: "blue",
        borderWidth: 0,
        color: "#FFFFFF",
        borderColor: "#7DE24E",
        height: 40,
        alignItems: "center",
        borderRadius: 10,
        marginLeft: 5,
        width: '22%'
    },
    saveButtonStyle: {
        backgroundColor: "green",
        borderWidth: 0,
        color: "#FFFFFF",
        borderColor: "green",
        height: 40,
        alignItems: "center",
        borderRadius: 10,
        width: '100%',
    },
    cancelButtonStyle: {
        backgroundColor: "red",
        borderWidth: 0,
        color: "#FFFFFF",
        borderColor: "red",
        height: 40,
        alignItems: "center",
        borderRadius: 10,
        width: '100%',
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
    },

    buttonTextStyle: {
        color: "#FFFFFF",
        paddingVertical: 10,
        padding: 5,
        fontSize: 16,
    },

    inputStyle: {
        flex: 1,
        color: "black",
        paddingLeft: 10,
        paddingRight: 10,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "#dadae8",
        width: '100%',
        fontSize: 16,
        height: 40
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
        alignSelf: 'flex-start',
        minWidth: '22%',
        margin: 5
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
    inputLocation: {
        width: '75%',
        height: 40,
        color: "black",
        paddingLeft: 10,
        paddingRight: 10,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "#dadae8",
        fontSize: 16,
    },
    camera: {
        flex: 1,
        justifyContent: "space-between",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-around"
    },
    snapButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 4,
        borderColor: "#fff",
        marginBottom: 35,
        justifyContent: 'center',
        alignItems: 'center'
    },

    innerSnapButton: {
        backgroundColor: "pink",
        width: 56,
        height: 55,
        borderRadius: 25.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageRender: {
        width: 170,
        height: 170,
        padding: 10,
        borderRadius: 30
    }
});

export default AddFdlKebisingan;
