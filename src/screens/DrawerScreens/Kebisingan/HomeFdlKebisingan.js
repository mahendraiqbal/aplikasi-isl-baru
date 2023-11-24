// import React, { useState, useRef, useEffect } from "react";
// import {
//     StyleSheet,
//     Dimensions,
//     View,
//     Text,
//     TouchableOpacity,
//     SafeAreaView,
// } from "react-native";

// import { Camera } from "expo-camera";

// const WINDOW_HEIGHT = Dimensions.get("window").height;
// const closeButtonSize = Math.floor(WINDOW_HEIGHT * 0.032);
// const captureSize = Math.floor(WINDOW_HEIGHT * 0.09);

// const HomeFdlKebisingan = ({ navigation }) => {
//     // return (
//     //     <SafeAreaView style={{ flex: 1 }}>
//     //         <View style={{ flex: 1, padding: 16 }}>
//     //             <View
//     //                 style={{
//     //                     flex: 1,
//     //                     alignItems: 'center',
//     //                     justifyContent: 'center',
//     //                 }}>
//     //                 <Text
//     //                     style={{
//     //                         fontSize: 25,
//     //                         textAlign: 'center',
//     //                         marginBottom: 16,
//     //                     }}>
//     //                     HOME FDL KEBISINGAN
//     //                 </Text>
//     //             </View>
//     //         </View>
//     //     </SafeAreaView>
//     // );

//     const [hasPermission, setHasPermission] = useState(null);
//     const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
//     const [isPreview, setIsPreview] = useState(false);
//     const [isCameraReady, setIsCameraReady] = useState(false);
//     const [isVideoRecording, setIsVideoRecording] = useState(false);
//     const [videoSource, setVideoSource] = useState(null);
//     const cameraRef = useRef();
//     useEffect(() => {
//         (async () => {
//             const { status } = await Camera.requestCameraPermissionsAsync();
//             setHasPermission(status === "granted");
//         })();
//     }, []);
//     const onCameraReady = () => {
//         setIsCameraReady(true);
//     };
//     const takePicture = async () => {
//         if (cameraRef.current) {
//             const options = { quality: 0.5, base64: true, skipProcessing: true };
//             const data = await cameraRef.current.takePictureAsync(options);
//             const source = data.uri;
//             if (source) {
//                 await cameraRef.current.pausePreview();
//                 setIsPreview(true);
//                 console.log("picture source", source);
//             }
//         }
//     };
//     const switchCamera = () => {
//         if (isPreview) {
//             return;
//         }
//         setCameraType((prevCameraType) =>
//             prevCameraType === Camera.Constants.Type.back
//                 ? Camera.Constants.Type.front
//                 : Camera.Constants.Type.back
//         );
//     };
//     const cancelPreview = async () => {
//         await cameraRef.current.resumePreview();
//         setIsPreview(false);
//         setVideoSource(null);
//     };
//     const renderCancelPreviewButton = () => (
//         <TouchableOpacity onPress={cancelPreview} style={styles.closeButton}>
//             <View style={[styles.closeCross, { transform: [{ rotate: "45deg" }] }]} />
//             <View
//                 style={[styles.closeCross, { transform: [{ rotate: "-45deg" }] }]}
//             />
//         </TouchableOpacity>
//     );
//     const renderCaptureControl = () => (
//         <View style={styles.control}>
//             <TouchableOpacity disabled={!isCameraReady} onPress={switchCamera}>
//                 <Text style={styles.text}>{"Flip"}</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//                 activeOpacity={0.7}
//                 disabled={!isCameraReady}
//                 onPress={takePicture}
//                 style={styles.capture}
//             />
//         </View>
//     );
//     if (hasPermission === null) {
//         return <View />;
//     }
//     if (hasPermission === false) {
//         return <Text style={styles.text}>No access to camera</Text>;
//     }
//     return (
//         <SafeAreaView style={styles.container}>
//             <Camera
//                 ref={cameraRef}
//                 style={styles.container}
//                 type={cameraType}
//                 flashMode={Camera.Constants.FlashMode.on}
//                 onCameraReady={onCameraReady}
//                 onMountError={(error) => {
//                     console.log("cammera error", error);
//                 }}
//             />
//             <View style={styles.container}>
//                 {isVideoRecording && renderVideoRecordIndicator()}
//                 {videoSource && renderVideoPlayer()}
//                 {isPreview && renderCancelPreviewButton()}
//                 {!videoSource && !isPreview && renderCaptureControl()}
//             </View>
//         </SafeAreaView>
//     );
// };

// export default HomeFdlKebisingan;

// const styles = StyleSheet.create({
//     container: {
//         ...StyleSheet.absoluteFillObject,
//     },
//     closeButton: {
//         position: "absolute",
//         top: 35,
//         left: 15,
//         height: closeButtonSize,
//         width: closeButtonSize,
//         borderRadius: Math.floor(closeButtonSize / 2),
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "#c4c5c4",
//         opacity: 0.7,
//         zIndex: 2,
//     },
//     media: {
//         ...StyleSheet.absoluteFillObject,
//     },
//     closeCross: {
//         width: "68%",
//         height: 1,
//         backgroundColor: "black",
//     },
//     control: {
//         position: "absolute",
//         flexDirection: "row",
//         bottom: 38,
//         width: "100%",
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     capture: {
//         backgroundColor: "#f5f6f5",
//         borderRadius: 5,
//         height: captureSize,
//         width: captureSize,
//         borderRadius: Math.floor(captureSize / 2),
//         marginHorizontal: 31,
//     },
//     recordIndicatorContainer: {
//         flexDirection: "row",
//         position: "absolute",
//         top: 25,
//         alignSelf: "center",
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "transparent",
//         opacity: 0.7,
//     },
//     recordTitle: {
//         fontSize: 14,
//         color: "#ffffff",
//         textAlign: "center",
//     },
//     recordDot: {
//         borderRadius: 3,
//         height: 6,
//         width: 6,
//         backgroundColor: "#ff0000",
//         marginHorizontal: 5,
//     },
//     text: {
//         color: "#fff",
//     },
// });

// import React, { useState, useRef, useEffect } from "react";
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StyleSheet,
    Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeFdlKebisingan = ({ navigation }) => {
    const [timeNow, setTimeNow] = useState(new Date());
    const [accessData, setAccessData] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeNow(new Date());
        }, 1000);

        const fetchAccessData = async () => {
            try {
                const accessValue = await AsyncStorage.getItem("access");
                if (accessValue !== null) {
                    const accessDataObject = JSON.parse(accessValue);

                    const identity = accessDataObject?.identity || "";

                    setAccessData(identity);
                }
            } catch (error) {
                console.error("Error fetching access data:", error);
            }
        };

        fetchAccessData();

        return () => clearInterval(interval);
    }, []);

    let greeting;

    if (timeNow.getHours() < 12) {
        greeting = "Selamat Pagi";
    } else if (timeNow.getHours() < 15) {
        greeting = "Selamat Siang";
    } else if (timeNow.getHours() < 18) {
        greeting = "Selamat Sore";
    } else {
        greeting = "Selamat Malam";
    }

    useEffect(() => { });

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* <View style={{ flex: 1, padding: 16 }}>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Text
                        style={{
                            fontSize: 25,
                            textAlign: 'center',
                            marginBottom: 16,
                        }}>
                        HOME FDL KEBISINGAN
                    </Text>
                    <TouchableOpacity onPress={() => {
                        AsyncStorage.removeItem('kebisingan');
                    }}>
                        <Text>Remove</Text>
                    </TouchableOpacity>
                </View>
            </View> */}
            <View style={styles.container}>
                <Text style={styles.greetingText}>{greeting}</Text>
                <Text style={styles.userNameText}>{`${accessData}`}</Text>

                <View style={styles.allData}>
                    <View>
                        <TouchableOpacity style={styles.button}>
                            <Image
                                source={require("../../../../assets/data.png")}
                                style={styles.icon}
                            />
                        </TouchableOpacity>
                        <Text style={styles.buttonText}>Data Online</Text>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.button}>
                            {/* <Image
                source={require("../../../../assets/data.png")}
                style={styles.icon}
              /> */}
                            <Text style={{ fontSize: 43, fontWeight: "bold" }}>0</Text>
                        </TouchableOpacity>
                        <Text style={styles.buttonText}>Data Offline</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    greetingText: {
        fontSize: 18,
    },
    userNameText: {
        fontSize: 40,
        fontWeight: "bold",
    },
    container: {
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 10,
        padding: 16,
        margin: 16,
    },
    allData: {
        marginTop: 16,
        flexDirection: "row",
        justifyContent: "space-around",
    },
    button: {
        borderWidth: 1,
        borderColor: "black", // You can set the border color to your preference
        borderRadius: 8,
        padding: 8,
        alignItems: "center",
        // width: "45%", // Adjust the width as needed
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "black", // You can set the text color to your preference
        textAlign: "center"
    },
    icon: {
        width: 50, // Set your desired icon width
        height: 50, // Set your desired icon height
    },
});

export default HomeFdlKebisingan;
