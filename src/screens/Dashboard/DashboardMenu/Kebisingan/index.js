import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Card } from "react-native-paper"; // Assuming you're using react-native-paper

function Kebisingan() {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleGoBack}>
        <Text style={styles.backButton}>{"< Back"}</Text>
      </TouchableOpacity>
      <Text style={styles.greeting}>Hello, User!</Text>

      <View style={styles.lineBreak} />

      <Card style={styles.card}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('AddDataKebisingan');
          }}
        >
          <Text style={styles.buttonText}>Add Data</Text>
        </TouchableOpacity>

        {/* Line break between buttons */}
        <View style={styles.buttonBreak} />

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('ShowDataKebisingan');
          }}
        >
          <Text style={styles.buttonText}>Show Data</Text>
        </TouchableOpacity>
      </Card>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  lineBreak: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#3f50b5', 
    padding: 20,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#e53935', 
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  buttonBreak: {
    height: 10,
  },
  backButton: {
    padding: 10,
    fontSize: 18,
    marginTop: 20,
  },
});

export default Kebisingan;
