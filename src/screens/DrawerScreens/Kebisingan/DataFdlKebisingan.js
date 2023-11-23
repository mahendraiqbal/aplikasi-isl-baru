import React, { useState, useEffect } from "react";
import { DataTable, Searchbar } from "react-native-paper";

function ShowData() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (searchQuery.trim() !== '') {
          // Fetch data using the search query
          const response = await fetch(`https://your-api-endpoint.com/search?query=${search}`);
          const result = await response.json();
          setData(result); // Update the state with the fetched data
        } else {
          setData([]); // Clear data when the search query is empty
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [search]);

  return (
    <>
      <Searchbar
        placeholder="Search"
        onChangeText={(query) => setSearchQuery(query)}
        value={search}
      />
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
    </>
  );
}

export default ShowData;
