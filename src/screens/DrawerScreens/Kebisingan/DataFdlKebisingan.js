import React, { useState, useEffect } from "react";
import { DataTable, Searchbar } from "react-native-paper";
import { StyleSheet, Text, View, ScrollView, TextInput, Button } from 'react-native';
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
                            setData(responseJson.data)
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                })
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
        <View style={styles.container}>
            <Searchbar
                placeholder="Search"
                onChangeText={(query) => setSearch(query)}
                value={search}
            />
            <ScrollView horizontal>

                <DataTable style={styles.table}>
                    <DataTable.Header>
                        <DataTable.Title style={styles.header}>#</DataTable.Title>
                        <DataTable.Title style={styles.headerTanggal}>Tanggal Uji</DataTable.Title>
                        <DataTable.Title style={styles.header}>No Sample</DataTable.Title>
                        <DataTable.Title style={styles.header}>Nama Perusahaan</DataTable.Title>
                        <DataTable.Title style={styles.header}>Shift Pengambilan</DataTable.Title>
                    </DataTable.Header>

                    {data.slice(from, to).map((item) => (
                        <DataTable.Row key={item.id} style={styles.row}>
                            <DataTable.Cell style={styles.cell}>Action</DataTable.Cell>
                            <DataTable.Cell style={styles.cell}>{item.add_at}</DataTable.Cell>
                            <DataTable.Cell style={styles.cell}>{item.no_sample}</DataTable.Cell>
                            <DataTable.Cell style={styles.cell}>{item.nama}</DataTable.Cell>
                            <DataTable.Cell style={styles.cell}>{item.jenis_durasi_sampling}</DataTable.Cell>
                        </DataTable.Row>
                    ))}
                </DataTable>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#fff',
    },
    table: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: 'black',
    },
    header: {
        paddingLeft: 0,
        fontWeight: 'bold',
        fontSize: 16,
        marginHorizontal: 30
    },
    headerTanggal: {
        marginHorizontal: 50
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cell: {
        flex: 1,
        paddingLeft: 0,
        fontSize: 16,
        marginBottom: 8,
        marginHorizontal: 15
    },
});

export default ShowData;
