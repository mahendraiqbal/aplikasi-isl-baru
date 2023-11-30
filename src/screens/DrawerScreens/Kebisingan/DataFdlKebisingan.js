import React, { useState, useEffect } from "react";
import { DataTable, Searchbar } from "react-native-paper";
import { StyleSheet, Text, View, ScrollView, TextInput, Button, } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

function ShowData() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");

    const [page, setPage] = useState(0);
    const [numberOfItemsPerPageList] = useState([30, 50, 70]);
    const [itemsPerPage, onItemsPerPageChange] = useState(
        numberOfItemsPerPageList[0]
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                // if (searchQuery.trim() !== '') {
                // Fetch data using the search query
                // const response = await fetch(`https://your-api-endpoint.com/search?query=${search}`);
                AsyncStorage.getItem("token").then((token) => {
                    var dataToSend = {
                        token: token,
                        active: "0"
                    };
                    let formBody = [];
                    for (let key in dataToSend) {
                        let encodedKey = encodeURIComponent(key);
                        let encodedValue = encodeURIComponent(dataToSend[key]);
                        formBody.push(encodedKey + "=" + encodedValue);
                    }

                    formBody = formBody.join("&");
                    fetch(`https://apps.intilab.com/eng/backend/public/default/api/showDataUdara`, { method: 'POST', body: JSON.stringify(dataToSend), headers: { "Content-Type": "application/json" } })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            console.log(responseJson)
                            // if (responseJson.status != 200) {
                            //     // setErrortext(responseJson.message);
                            // } else {
                            //     // setAccessData(responseJson.name);
                            // }
                            setData(responseJson.data)
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                    // setData(result);
                })
                // } else {
                //     setData([]);
                // }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [search]);

    React.useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, data.length);

    return (
        <>
            <Searchbar
                placeholder="Search"
                onChangeText={(query) => setSearch(query)}
                value={search}
            />
            <ScrollView horizontal>

                <DataTable style={styles.table}>
                    <DataTable.Header>
                        <DataTable.Title style={styles.header}>#</DataTable.Title>
                        <DataTable.Title style={styles.header}>Tanggal Uji</DataTable.Title>
                        <DataTable.Title style={styles.header}>No Sample</DataTable.Title>
                        <DataTable.Title style={styles.header}>Nama Perusahaan</DataTable.Title>
                        <DataTable.Title style={styles.header}>Shift Pengambilan</DataTable.Title>
                    </DataTable.Header>

                    {data.slice(from, to).map((item) => (
                        <DataTable.Row>
                            <DataTable.Cell>Action</DataTable.Cell>
                            <DataTable.Cell>{item.add_at}</DataTable.Cell>
                            <DataTable.Cell>{item.no_sample}</DataTable.Cell>
                            <DataTable.Cell>{item.nama}</DataTable.Cell>
                            <DataTable.Cell>{item.jenis_durasi_sampling}</DataTable.Cell>
                        </DataTable.Row>
                    ))}

                    {/* <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.ceil(data.length / itemsPerPage)}
                    onPageChange={(page) => setPage(page)}
                    label={`${from + 1}-${to} of ${data.length}`}
                    numberOfItemsPerPageList={numberOfItemsPerPageList}
                    numberOfItemsPerPage={itemsPerPage}
                    onItemsPerPageChange={onItemsPerPageChange}
                    showFastPaginationControls
                    selectPageDropdownLabel={'Rows per page'}
                /> */}
                </DataTable>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    table: {
        borderWidth1: 1,
        borderColor: 'black'
    },
    headSection: {
        borderBottomWidth: 2,
        borderColor: 'black',
        paddingBottom: 15,

    },
    titleHeading: {
        marginTop: 50,
        fontWeight: 'bold',
        marginHorizontal: 167,
    },
    tableHeading: {
        fontWeight: 'bold',
        color: 'black',
    },
    header: {
        paddingLeft: 0,
    },
});

export default ShowData;
