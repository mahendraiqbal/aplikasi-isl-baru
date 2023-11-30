import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';

import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from '@react-navigation/drawer';
import AsyncStorage from "@react-native-async-storage/async-storage";

const CustomSidebarMenu = (props) => {

    const [accessData, setAccessData] = useState("");

    useEffect(() => {
        AsyncStorage.getItem('access').then((value) => {
            var token = JSON.parse(value)
            if (new Date() >= new Date(token.expired)) {
                Alert.alert(
                    'Token has been Expired.!',
                    'Please Online to Re-Login',
                    [
                        {
                            text: 'Ok',
                            onPress: () => {
                                AsyncStorage.removeItem('token');
                                props.navigation.replace('Auth');
                            },
                        },
                    ],
                    { cancelable: false },
                );
            } else {
                var dataToSend = {
                    token: token.token,
                };
                let formBody = [];
                for (let key in dataToSend) {
                    let encodedKey = encodeURIComponent(key);
                    let encodedValue = encodeURIComponent(dataToSend[key]);
                    formBody.push(encodedKey + "=" + encodedValue);
                }

                formBody = formBody.join("&");

                fetch(
                    "https://apps.intilab.com/eng/backend/public/default/api/cektoken",
                    {
                        method: "POST",
                        body: JSON.stringify(dataToSend),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                )
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson)
                        if (responseJson.status != 200) {
                            // console.log(responseJson.message);
                        } else {
                            setAccessData(responseJson.name);
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        Alert.alert(error);
                    });
            }
        });
    }, [])

    this.nama = accessData;

    return (
        <View style={stylesSidebar.sideMenuContainer}>
            <View style={stylesSidebar.profileHeader}>
                <View style={stylesSidebar.profileHeaderPicCircle}>
                    <Text style={{ fontSize: 25, color: '#307ecc' }}>
                        {accessData.charAt(0)}
                    </Text>
                </View>
                <Text style={stylesSidebar.profileHeaderText}>
                    {accessData}
                </Text>
            </View>
            <View style={stylesSidebar.profileHeaderLine} />

            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
                <DrawerItem
                    label={({ color }) =>
                        <Text style={{ color: '#fff', fontSize: 18 }}>
                            Logout
                        </Text>
                    }
                    onPress={() => {
                        props.navigation.toggleDrawer();
                        Alert.alert(
                            'Logout',
                            'Are you sure? You want to logout?',
                            [
                                {
                                    text: 'Cancel',
                                    onPress: () => {
                                        return null;
                                    },
                                },
                                {
                                    text: 'Confirm',
                                    onPress: () => {
                                        AsyncStorage.removeItem('token');
                                        props.navigation.replace('Auth');
                                    },
                                },
                            ],
                            { cancelable: false },
                        );
                    }}
                />
            </DrawerContentScrollView>
        </View>
    );
};

export default CustomSidebarMenu;

const stylesSidebar = StyleSheet.create({
    sideMenuContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#307ecc',
        paddingTop: 40,
        color: 'white',
    },
    profileHeader: {
        flexDirection: 'row',
        backgroundColor: '#307ecc',
        padding: 15,
        textAlign: 'center',
    },
    profileHeaderPicCircle: {
        width: 60,
        height: 60,
        borderRadius: 60 / 2,
        color: 'white',
        backgroundColor: '#ffffff',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileHeaderText: {
        color: 'white',
        alignSelf: 'center',
        paddingHorizontal: 10,
        fontWeight: 'bold',
    },
    profileHeaderLine: {
        height: 1,
        marginHorizontal: 20,
        backgroundColor: '#e2e2e2',
        marginTop: 15,
    },
});