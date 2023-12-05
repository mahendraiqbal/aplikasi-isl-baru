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

// import React, { useState, useEffect } from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TextInput,
//   Button,
//   View,
//   TouchableOpacity,
//   FlatList,
// } from 'react-native';
// import { DocumentDirectoryPath, writeFile, readDir } from 'react-native-fs';

// const LoadingView = () => (
//   <View style={styles.loading}>
//     <Text style={styles.body}>Loading...</Text>
//   </View>
// );

// const CreateView = ({ setCreateViewActive }) => {
//   const [fileText, setFileText] = useState('');

//   const saveFile = async () => {
//     const path = `${DocumentDirectoryPath}/${Date.now()}.txt`;

//     try {
//       await writeFile(path, fileText, 'utf8');
//       setCreateViewActive(false);
//     } catch (e) {
//       console.log('error', e);
//     }
//   };

//   return (
//     <>
//       <View style={styles.main}>
//         <Text style={styles.title}>Enter text for your file:</Text>
//         <TextInput
//           value={fileText}
//           onChangeText={setFileText}
//           style={styles.textArea}
//           multiline
//           textAlignVertical="top"
//         />
//       </View>
//       <Button title="Save File" onPress={saveFile} />
//     </>
//   );
// };

// const ListView = ({ setCreateViewActive }) => {
//   const [ready, setReady] = useState(false);
//   const [files, setFiles] = useState(null);

//   useEffect(() => {
//     (async () => {
//       try {
//         const filesArr = await readDir(DocumentDirectoryPath);

//         setFiles(filesArr);
//         setReady(true);
//       } catch (e) {
//         console.log('error', e);
//       }
//     })();

//     return () => null;
//   }, []);

//   if (!ready) return <LoadingView />;

//   const renderItem = ({ item }) => (
//     <TouchableOpacity style={styles.file}>
//       <Text style={styles.body}>{item.name}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <>
//       <View style={styles.main}>
//         {files.length > 0 ? (
//           <FlatList data={files} renderItem={renderItem} keyExtractor={(item) => item.name} />
//         ) : (
//           <Text>No files</Text>
//         )}
//       </View>
//       <Button title="Create new file" onPress={() => setCreateViewActive(true)} />
//     </>
//   );
// };

// const ShowData = () => {
//   const [createViewActive, setCreateViewActive] = useState(false);

//   const getCurrentView = () => {
//     if (createViewActive) {
//       return <CreateView setCreateViewActive={setCreateViewActive} />;
//     }

//     return <ListView setCreateViewActive={setCreateViewActive} />;
//   };

//   return (
//     <SafeAreaView style={styles.wrapper}>
//       <View style={styles.container}>{getCurrentView()}</View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   wrapper: {
//     flex: 1,
//   },
//   container: {
//     padding: 16,
//     flex: 1,
//   },
//   main: {
//     flex: 1,
//     display: 'flex',
//     paddingVertical: 16,
//   },
//   textArea: {
//     height: 200,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 4,
//     marginBottom: 16,
//     paddingLeft: 16,
//     paddingRight: 16,
//     paddingTop: 16,
//     paddingBottom: 16,
//     fontSize: 18,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     color: '#333',
//   },
//   loading: {
//     flex: 1,
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   body: {
//     fontSize: 18,
//   },
// });

// export default ShowData;
