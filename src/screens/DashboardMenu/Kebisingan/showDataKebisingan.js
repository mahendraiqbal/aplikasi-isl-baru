import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, Touchable } from "react-native";
import { SafeAreaView } from "react-native-web";
import { DataTable } from "react-native-paper";

function showData() {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <>
      <SafeAreaView>
        <TouchableOpacity onPress={handleGoBack}>
          <Text style={{ padding: 10, fontSize: 18 }}>{"< Back"}</Text>
        </TouchableOpacity>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Dessert</DataTable.Title>
            <DataTable.Title numeric>Calories</DataTable.Title>
            <DataTable.Title numeric>Fat</DataTable.Title>
          </DataTable.Header>

          <DataTable.Row>
            <DataTable.Cell>Frozen yogurt</DataTable.Cell>
            <DataTable.Cell numeric>159</DataTable.Cell>
            <DataTable.Cell numeric>6.0</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>Ice cream sandwich</DataTable.Cell>
            <DataTable.Cell numeric>237</DataTable.Cell>
            <DataTable.Cell numeric>8.0</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Pagination
            page={1}
            numberOfPages={3}
            onPageChange={(page) => {
              console.log(page);
            }}
            label="1-2 of 6"
          />
        </DataTable>
      </SafeAreaView>
    </>
  );
}

export default showData;
