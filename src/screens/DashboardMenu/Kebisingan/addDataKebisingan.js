import React, { useState } from "react";
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

const AddDataKebisingan = () => {
  const navigation = useNavigation();

  const [noSample, setNoSample] = useState("");
  const [name, setName] = useState("");
  const [penamaanTitik, setPenamaanTitik] = useState("");
  const [penamaanTambahan, setPenamaanTambahan] = useState("");
  const [sumberKebisingan, setSumberKebisingan] = useState("")
  const [showNameInput, setShowNameInput] = useState(false);

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
            "Content-Type": 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: new URLSearchParams({
            no_sample: noSample,
            token: token
          }).toString(),
        }
      );

      const data = await response.json();

      setName(data.name || '');

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
        <TextInput
          style={styles.input}
          onChangeText={(text) => setNoSample(text)}
          value={noSample}
          onBlur={saveData} 
        />
        {showNameInput && (
          <>
            <Text style={styles.sample}>Penamaan Titik:</Text>
            <TextInput
              style={styles.input}
              value={penamaanTitik}
              editable={false} 
            />
            <Text style={styles.sample}>Penamaan Tambahan:</Text>
            <TextInput
              style={styles.input}
              value={penamaanTambahan}
              editable={false} 
            />
            <Text style={styles.sample}>Sumber Kebisingan:</Text>
            <TextInput
              style={styles.input}
              value={sumberKebisingan}
              editable={false} 
            />
          </>
        )}
        <View style={styles.buttonContainer}>
          <Button title="Save" onPress={saveData} />
          <Button title="Cancel" onPress={() => setNoSample("")} />
        </View>
      </Card>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
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
  },
});

export default AddDataKebisingan;
