import React, { useState } from 'react';
import {
    StyleSheet,
    TextInput,
    View,
    Text,
    Image,
    KeyboardAvoidingView,
    Keyboard,
    Alert,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

import Loader from '../../../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';

const AddFdlAir = ({navigation}) => {
    const netInfo = useNetInfo();
    const [noSample, setNosample] = useState('');
    const [loading, setLoading] = useState(false);
    const [errortext, setErrortext] = useState('');

    const handleSubmitButton = () => {
        setErrortext('');
        if (!noSample) {
            alert('Please fill No Sample');
            return;
        }
        if (netInfo.isConnected && netInfo.isInternetReachable) {
            AsyncStorage.getItem('token').then((token) => {
                setLoading(true);
                AsyncStorage.getItem('token').then((item) => {
                    token = item
                });
                var dataToSend = {
                    no_sample: noSample,
                    token: token
                };
                let formBody = [];
                for (let key in dataToSend) {
                    let encodedKey = encodeURIComponent(key);
                    let encodedValue = encodeURIComponent(dataToSend[key]);
                    formBody.push(encodedKey + '=' + encodedValue);
                }
                formBody = formBody.join('&');
                
                console.log(formBody)

                fetch('https://apps.intilab.com/eng/backend/public/default/api/getSample', {
                    method: 'POST',
                    body: JSON.stringify(dataToSend),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        setLoading(false);
                        console.log(responseJson);
                        if (responseJson.message) {
                            setErrortext(responseJson.message);
                        } else {
                            if(responseJson.id_ket == '3'){
                                navigation.navigate('LimbahScreen', { screen: 'Add Limbah' })
                            }
                            // proses ke navigasi tujuan
                        }
                    })
                    .catch((error) => {
                        setLoading(false);
                        console.error(error);
                        Alert.alert(error)
                    });
            });
        } else {
            Alert.alert(
                'Anda Sedang Ofline.',
                'Tetap lanjut dengan mode Offline',
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
                            // props.navigation.replace('Route_Tujuan');
                        },
                    },
                ],
                { cancelable: false },
            );
        }

    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Loader loading={loading} />
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    justifyContent: 'center',
                    alignContent: 'center',
                }}>
                <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <Image
                        source={require('../../../../assets/isl.png')}
                        style={{
                            width: '70%',
                            height: 100,
                            resizeMode: 'contain',
                            marginTop: 0,
                        }}
                    />
                </View>
                <KeyboardAvoidingView enabled>
                    <View style={styles.SectionStyle}>
                        <TextInput
                            style={styles.inputStyle}
                            onChangeText={(NoSample) => setNosample(NoSample)}
                            underlineColorAndroid="#f000"
                            placeholder="Enter No Sample"
                            placeholderTextColor="#8b9cb5"
                            autoCapitalize="sentences"
                            returnKeyType="next"
                            onSubmitEditing={() =>
                                emailInputRef.current && emailInputRef.current.focus()
                            }
                            blurOnSubmit={false}
                        />
                    </View>

                    {errortext != '' ? (
                        <Text style={styles.errorTextStyle}>
                            {errortext}
                        </Text>
                    ) : null}

                    <TouchableOpacity
                        style={styles.buttonStyle}
                        activeOpacity={0.5}
                        onPress={handleSubmitButton}>
                        <Text style={styles.buttonTextStyle}>PROCCESS</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    );
};

function limbah (){

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    justifyContent: 'center',
                    alignContent: 'center',
                }}>
                {/* <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <Image
                        source={require('../../../Image/isl.png')}
                        style={{
                            width: '70%',
                            height: 100,
                            resizeMode: 'contain',
                            marginTop: 0,
                        }}
                    />
                </View> */}
                <KeyboardAvoidingView enabled>
                    <View style={styles.SectionStyle}>
                        <TextInput
                            style={styles.inputStyle}
                            onChangeText={(NoSample) => setNosample(NoSample)}
                            underlineColorAndroid="#f000"
                            placeholder="Enter No Sample"
                            placeholderTextColor="#8b9cb5"
                            autoCapitalize="sentences"
                            returnKeyType="next"
                            onSubmitEditing={() =>
                                emailInputRef.current && emailInputRef.current.focus()
                            }
                            blurOnSubmit={false}
                        />
                    </View>

                    {/* <TouchableOpacity
                        style={styles.buttonStyle}
                        activeOpacity={0.5}
                        onPress={handleSubmitButton}>
                        <Text style={styles.buttonTextStyle}>PROCCESS KE DUA</Text>
                    </TouchableOpacity> */}
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    SectionStyle: {
        flexDirection: 'row',
        height: 40,
        marginTop: 20,
        marginLeft: 35,
        marginRight: 35,
        margin: 10,
    },
    buttonStyle: {
        backgroundColor: '#7DE24E',
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#7DE24E',
        height: 40,
        alignItems: 'center',
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 20,
        marginBottom: 20,
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 16,
    },
    inputStyle: {
        flex: 1,
        color: 'black',
        paddingLeft: 15,
        paddingRight: 15,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: '#dadae8',
        fontWeight: 'bold',
    },
    errorTextStyle: {
        color: 'red',
        textAlign: 'center',
        fontSize: 26,
    },
    successTextStyle: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        padding: 30,
    },
});

export default AddFdlAir;