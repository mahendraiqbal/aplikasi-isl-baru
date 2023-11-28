import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  Alert,
  TouchableOpacity,
  Dimensions,
  Image,
  StyleSheet,
} from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Carousel from "react-native-reanimated-carousel";

import { Link } from "@react-navigation/native";
import FDLKebisinganStack from '../DrawerNavigationRoutes/index';

const HomeScreen = () => {
  const netInfo = useNetInfo();
  const navigation = useNavigation();
  const width = Dimensions.get("window").width;

  const checkConnection = () => {
    if (netInfo.isConnected && netInfo.isInternetReachable) {
      AsyncStorage.getItem("token").then((value) => console.log(value));
    } else {
      Alert.alert("You are offline!");
    }
  };

  const images = [
    require("../../../assets/isl.png"),
    require("../../../assets/isl.png"),
    require("../../../assets/isl.png"),
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Carousel
        loop
        width={width}
        height={width / 2}
        autoPlay={true}
        data={images}
        scrollAnimationDuration={1000}
        // onSnapToItem={}
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              borderWidth: 1,
              justifyContent: "center",
            }}
          >
            <Image
              source={item}
              style={{ width: "100%", height: "100%", resizeMode: "cover" }}
            />
          </View>
        )}
      />
      <View style={styles.iconRow}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate("FdlKebisinganScreen")}
        >
          <Image
            source={require("../../../assets/plus.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <Image
            source={require("../../../assets/home.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <Image
            source={require("../../../assets/home.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.iconRow}>
        <TouchableOpacity style={styles.iconContainer}>
          <Image
            source={require("../../../assets/home.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <Image
            source={require("../../../assets/home.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <Image
            source={require("../../../assets/home.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, padding: 16 }}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* <Pressable
            onPress={() => {
              checkConnection();
            }}
          >
            <Text>Check Connectivity</Text>
          </Pressable> */}
          {/* <Text
            style={{
              fontSize: 20,
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            Test halaman dashboard
          </Text> */}
          {/* <TouchableOpacity
            onPress={() => navigation.navigate("FdlKebisinganScreen")}
          >
            <Text>Kebisingan</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  iconContainer: {
    alignItems: "center",
  },
  moreIconsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  moreIcon: {
    margin: 10,
    alignItems: "center",
  },
  icon: {
    width: 50, // Set your desired icon width
    height: 50, // Set your desired icon height
  },
});

export default HomeScreen;
