import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Button,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity,
    Alert,
} from "react-native";
import { Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Camera, CameraType } from "expo-camera";

const AddDataKebisingan = () => {
    const navigation = useNavigation();

    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();

    const [noSample, setNoSample] = useState("");
    const [name, setName] = useState("");
    const [penamaanTitik, setPenamaanTitik] = useState("");
    const [penamaanTambahan, setPenamaanTambahan] = useState("");
    const [sumberKebisingan, setSumberKebisingan] = useState("");
    const [showNameInput, setShowNameInput] = useState(false);
    const [dataKebisingan, setDataKebisingan] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(1);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const newData = dataKebisingan.map((value, index) => {
                if (value < 40) {
                    Alert.alert(
                        "Invalid Data",
                        `Data at index ${index + 1} should be at least 40`
                    );
                } else if (value > 120) {
                    Alert.alert(
                        "Invalid Data",
                        `Data at index ${index + 1} should not exceed 120`
                    );
                }
                return value;
            });
            setDataKebisingan(newData);
        }, 2000);

        return () => clearTimeout(timeoutId);
    }, [dataKebisingan]);

    const handleGoBack = () => {
        navigation.goBack();
    };

    const getToken = async () => {
        try {
            const value = await AsyncStorage.getItem("token");
            return value;
        } catch (error) {
            console.error("Error getting token:", error.message);
            return null;
        }
    };

    const toggleCameraType = () => {
        setType((current) =>
            current === CameraType.back ? CameraType.front : CameraType.back
        );
    };

    const saveData = async () => {
        try {
            const token = await getToken();

            if (!token) {
                Alert.alert("Error", "Token not found. Please log in.");
                return;
            }

            const response = await fetch(
                "https://apps.intilab.com/eng/backend/public/default/api/getSample",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    },
                    body: new URLSearchParams({
                        no_sample: noSample,
                        token: token,
                    }).toString(),
                }
            );

            const data = await response.json();

            setName(data.name || "");

            setShowNameInput(true);

            Alert.alert("Success", "Data fetched successfully!");
        } catch (error) {
            console.error("Error:", error.message);
            Alert.alert("Error", "Failed to fetch data. Please try again.");
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <TouchableOpacity onPress={handleGoBack}>
                <Text style={{ padding: 10, fontSize: 18 }}>{"< Back"}</Text>
            </TouchableOpacity>
            <Card style={styles.card}>
                <Text style={styles.title}>FDL Kebisingan</Text>
                <Text style={styles.sample}>No Sample:</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => setNoSample(text)}
                        value={noSample}
                        onBlur={saveData}
                    />
                </View>
                {showNameInput && (
                    <>
                        <Text style={styles.sample}>Penamaan Titik:</Text>
                        <TextInput
                            style={styles.input}
                            value={penamaanTitik}
                            onChangeText={(text) => setPenamaanTitik(text)}
                        />
                        <Text style={styles.sample}>Penamaan Tambahan:</Text>
                        <TextInput
                            style={styles.input}
                            value={penamaanTambahan}
                            onChangeText={(text) => setPenamaanTambahan(text)}
                        />
                        <Text style={styles.sample}>Sumber Kebisingan:</Text>
                        <TextInput
                            style={styles.input}
                            value={sumberKebisingan}
                            onChangeText={(text) => setSumberKebisingan(text)}
                        />
                        <Text style={styles.sample}>Data {currentIndex}</Text>
                        <TextInput
                            style={styles.input}
                            value={
                                dataKebisingan[currentIndex - 1]
                                    ? dataKebisingan[currentIndex - 1].toString()
                                    : ""
                            }
                            onChangeText={(text) => {
                                const newData = [...dataKebisingan];
                                newData[currentIndex - 1] = parseFloat(text) || 0;
                                setDataKebisingan(newData);
                            }}
                            onEndEditing={() => {
                                // Add a timeout before checking the value and moving to the next input
                                setTimeout(() => {
                                    const currentData = dataKebisingan[currentIndex - 1];

                                    if (currentData >= 40 && currentData <= 120) {
                                        setCurrentIndex((prevIndex) => prevIndex + 1);
                                    } else {
                                        Alert.alert(
                                            "Invalid Data",
                                            "Data should be between 40 and 120"
                                        );
                                    }
                                }, 2000); // Adjust the timeout duration as needed
                            }}
                        />
                    </>
                )}
                {/* <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity> */}
                <View style={styles.buttonContainer}>
                    <Button title="Save" onPress={saveData} />
                    <Button title="Cancel" onPress={() => setNoSample("")} />
                </View>
            </Card>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        alignItems: "center",
        marginBottom: 10,
        width: "100%",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 10,
    },
    card: {
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        textAlign: "center",
        fontWeight: "bold",
    },
    sample: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: "center",
        width: "100%",
    },
    input: {
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 4,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 10,
        width: "100%",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginBottom: "5%",
    },
});

export default AddDataKebisingan;
