import React, { useState, createRef } from 'react';
import { Alert } from 'react-native';
import {
    StyleSheet,
    TextInput,
    View,
    Text,
    ScrollView,
    Image,
    Keyboard,
    TouchableOpacity,
    KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../components/Loader';
import { useNetInfo } from '@react-native-community/netinfo';

const LoginScreen = ({ navigation }) => {
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errortext, setErrortext] = useState('');

    const passwordInputRef = createRef();
    const netInfo = useNetInfo();

    const handleSubmitPress = () => {
        setErrortext('');

        if (!userEmail) {
            Alert.alert(
                'Ooops..!',
                'Please fill Username',
                [
                    {
                        text: 'Ok',
                        onPress: () => {
                            return null
                        },
                    },
                ],
                { cancelable: false },
            );
            return;
        }
        if (!userPassword) {
            Alert.alert(
                'Ooops..!',
                'Please fill Password',
                [
                    {
                        text: 'Ok',
                        onPress: () => {
                            return null
                        },
                    },
                ],
                { cancelable: false },
            );
            return;
        }

        let dataToSend = { identity: userEmail, password: userPassword };
        let formBody = [];
        for (let key in dataToSend) {
            let encodedKey = encodeURIComponent(key);
            let encodedValue = encodeURIComponent(dataToSend[key]);
            formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');

        if (netInfo.isConnected && netInfo.isInternetReachable) {
            setLoading(true);
            fetch('https://apps.intilab.com/eng/backend/public/default/api/gettoken', {
                method: 'POST',
                body: formBody,
                headers: {
                    'Content-Type':
                        'application/x-www-form-urlencoded;charset=UTF-8',
                },
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    setLoading(false);
                    console.log(responseJson, new Date())
                    if (responseJson.status == '200') {
                        AsyncStorage.setItem('token', responseJson.token);

                        let access = { "identity": userEmail, "password": userPassword, "token": responseJson.token, "expired": responseJson.expired_at };
                        AsyncStorage.setItem('access', JSON.stringify(access), (err)=> {
                            if(err){
                                console.log("an error");
                                throw err;
                            }
                            console.log("success");
                        }).catch((err)=> {
                            console.log("error is: " + err);
                        });
                        navigation.navigate('BotTab');
                    } else {
                        // setErrortext(responseJson.message);
                        Alert.alert(
                            'Ooops..!',
                            responseJson.message,
                            [
                                {
                                    text: 'Confirm',
                                    onPress: () => {
                                        return null
                                    },
                                },
                            ],
                            { cancelable: false },
                        );
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    console.error(error);
                });
        } else {
            try {
                AsyncStorage.getItem('access').then((access_) =>{
                    let use_access = JSON.parse(access_)
                    if (use_access.identity != userEmail) {
                        Alert.alert(
                            'Offline Mode.',
                            'Username Salah',
                            [
                                {
                                    text: 'Ok',
                                    onPress: () => {
                                        return null
                                    },
                                },
                            ],
                            { cancelable: false },
                        );
                        return;
                    } else if (use_access.password != userPassword) {
                        Alert.alert(
                            'Ofline Mode',
                            'Password Salah.!',
                            [
                                {
                                    text: 'Ok',
                                    onPress: () => {
                                        return null
                                    },
                                },
                            ],
                            { cancelable: false },
                        );
                        return;
                    } else {
                        if(new Date() >= new Date(use_access.expired)){
                            Alert.alert(
                                'Token has been Expored.!',
                                'Please Online to Re-Login',
                                [
                                    {
                                        text: 'Ok',
                                        onPress: () => {
                                            return null
                                        },
                                    },
                                ],
                                { cancelable: false },
                            );
                        } else {
                            AsyncStorage.setItem('token', use_access.token);
                            navigation.replace('DrawerNavigationRoutes');
                        }
                    }
                });
            } catch (e) {
                Alert.alert(
                    'Anda sedang Offline.!',
                    'Anda belum pernah login pada device ini.',
                    [
                        {
                            text: 'Confirm',
                            onPress: () => {
                                // AsyncStorage.clear();
                                return null
                            },
                        },
                    ],
                    { cancelable: false },
                );
            }
        }

    };

    return (
        <View style={styles.mainBody}>
            <Loader loading={loading} />
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    flex: 1,
                    justifyContent: 'center',
                    alignContent: 'center',
                }}>
                <View>
                    <KeyboardAvoidingView enabled>
                        <View style={{ alignItems: 'center' }}>
                            <Image
                                source={require('../../../assets/user_w.png')}
                                style={{
                                    width: '80%',
                                    height: 200,
                                    resizeMode: 'contain',
                                    margin: 30,
                                }}
                            />
                        </View>
                        <View style={styles.SectionStyle}>
                            <TextInput
                                style={styles.inputStyle}
                                onChangeText={(UserEmail) =>
                                    setUserEmail(UserEmail)
                                }
                                placeholder="Enter Username" //dummy@abc.com
                                placeholderTextColor="#8b9cb5"
                                autoCapitalize="none"
                                keyboardType="default"
                                returnKeyType="next"
                                onSubmitEditing={() =>
                                    passwordInputRef.current &&
                                    passwordInputRef.current.focus()
                                }
                                underlineColorAndroid="#f000"
                                blurOnSubmit={false}
                            />
                        </View>
                        <View style={styles.SectionStyle}>
                            <TextInput
                                style={styles.inputStyle}
                                onChangeText={(UserPassword) =>
                                    setUserPassword(UserPassword)
                                }
                                placeholder="Enter Password" //12345
                                placeholderTextColor="#8b9cb5"
                                keyboardType="default"
                                ref={passwordInputRef}
                                onSubmitEditing={Keyboard.dismiss}
                                blurOnSubmit={false}
                                secureTextEntry={true}
                                underlineColorAndroid="#f000"
                                returnKeyType="next"
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
                            onPress={handleSubmitPress}>
                            <Text style={styles.buttonTextStyle}>LOGIN</Text>
                        </TouchableOpacity>
                        <Text
                            style={styles.versionType}
                            >
                            version 3.0.0
                        </Text>
                    </KeyboardAvoidingView>
                </View>
            </ScrollView>
        </View> 
    );
};
export default LoginScreen;

const styles = StyleSheet.create({
    mainBody: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#307ecc',
        alignContent: 'center',
    },
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
        marginBottom: 25,
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 16,
    },
    inputStyle: {
        flex: 1,
        color: 'white',
        paddingLeft: 15,
        paddingRight: 15,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: '#dadae8',
    },
    versionType: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14,
        alignSelf: 'center',
        padding: 10,
    },
    errorTextStyle: {
        color: 'red',
        textAlign: 'center',
        fontSize: 14,
    },
});