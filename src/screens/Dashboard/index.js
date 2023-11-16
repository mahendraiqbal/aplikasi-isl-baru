import React from 'react';
import { View, Text, SafeAreaView, Pressable, Alert} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native'; 


function Dashboard() {
    const netInfo = useNetInfo();
    const navigation = useNavigation();

    // const checkConnection = () => {
    //     if (netInfo.isConnected && netInfo.isInternetReachable) {
    //         AsyncStorage.getItem('token').then((value) =>
    //             console.log(value)
    //         );
    //     } else {
    //         Alert.alert('You are offline!');
    //     }
    // };
    const kebisingan = () => {
        navigation.push('Kebisingan')
    }
  return (
    <>
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, padding: 16 }}>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    {/* <Pressable
                        onPress={() => {
                            checkConnection();
                        }}>
                        <Text>Check Connectivity</Text>
                    </Pressable>
                    <Text
                        style={{
                            fontSize: 20,
                            textAlign: 'center',
                            marginBottom: 16,
                        }}>
                        Test halaman dashboard
                    </Text> */}
                    <TouchableOpacity
                        onPress={() => {
                            kebisingan();
                        }}
                    >
                        <Text>
                            Kebisingan    
                        </Text> 
                    </ TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    </>
  )
}

export default Dashboard