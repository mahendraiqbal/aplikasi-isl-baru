import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from "react-native";
import { IconButton, MD3Colors } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from "@react-native-community/netinfo";

const RightIcon = (props) => {
    const [connection, setConnection] = useState("Offline");
    const netInfo = useNetInfo();

    useEffect(() => {
        if (netInfo.isConnected && netInfo.isInternetReachable) {
            setConnection('Online')
            this.connection = true
        } else {
            setConnection('Offline')
            this.connection = false
        }

        AsyncStorage.getItem('access').then((value) => {
            var token = JSON.parse(value)
            if(new Date() >= new Date(token.expired)){
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
            }
        });
    });

    return (
        <View style={styles.SectionRow}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>{connection}</Text>
            <TouchableOpacity >
                <IconButton icon="bell-circle-outline" size={25} iconColor={MD3Colors.secondary100}></IconButton>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    SectionRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 20
    },

    SectionRowLoop: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: "space-between",
        flexWrap: 'wrap',
    },
})

export default RightIcon;