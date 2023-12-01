import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import DataFdlKebisingan from './Kebisingan/DataFdlKebisingan';
import HomeFdlKebisingan from './Kebisingan/HomeFdlKebisingan';
import AddFdlKebisingan from './Kebisingan/AddFdlKebisingan';

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress }) => (
    <TouchableOpacity
        style={{
            top: -30,
            justifyContent: 'center',
            alignItems: 'center',
            ...styles.shadow
        }}
        onPress={onPress}
    >
        <View style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: '#e32f45',
            ...styles.shadow
        }}>
            {children}
        </View>
    </TouchableOpacity>
)

const FdlKebisinganScreen = ({ state, navigation }) => {

    return (
        <Tab.Navigator
            initialRouteName="AddFdlKebisingan"
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                tabBarStyle: {
                    position: 'absplute',
                    bottom: '25',
                    left: '20',
                    right: '20',
                    elevation: 0,
                    backgroundColor: '#0000',
                    borderRadius: 15,
                    height: 91,
                    ...styles.shadow
                }
            }}
        >
            <Tab.Screen name="Home Fdl Kebisingan" component={HomeFdlKebisingan}
                options={{
                    tabBarIcon: ({ focused }) => {
                        if (focused) {
                            let value = this.stateForm;
                            console.log(value, 'ini home kebisngan')
                        }

                        return (
                            <View style={{ alignItems: 'center', justifyContent: 'center', top: 10 }}>
                                <Image
                                    source={require('../../../assets/home.png')}
                                    resizeMode='contain'
                                    style={{
                                        width: 25,
                                        height: 25,
                                        tintColor: focused ? '#e32f45' : '#748c94',
                                    }}
                                />
                                <Text style={{ color: focused ? '#e32f45' : '#748c94', fontSize: 12 }}>
                                    HOME FDL Kebisingan
                                </Text>
                            </View>
                        )
                    }
                }} />

            <Tab.Screen name="Add Fdl Kebisingan" component={AddFdlKebisingan}
                options={{
                    tabBarIcon: ({ focused }) => {
                        if (focused) {
                            // console.log('ini add kebisngan')
                            let value = this.stateForm;
                        }
                        return (
                            <View style={{ alignItems: 'center', justifyContent: 'center', top: 10 }}>
                                <Image
                                    source={require('../../../assets/plus.png')}
                                    resizeMode='contain'
                                    style={{
                                        width: 30,
                                        height: 30,
                                        top: -10,
                                        tintColor: '#fff',
                                    }}
                                />
                            </View>
                        )
                    },
                    tabBarButton: (props) => (
                        <CustomTabBarButton {...props} />
                    )

                }} />

            <Tab.Screen name="Data Fdl Kebisingan" component={DataFdlKebisingan}
                options={{
                    tabBarIcon: ({ focused }) => {
                        if (focused) {
                            // console.log('ini data kebisngan')
                            let value = this.stateForm;
                        }
                        return (
                            <View style={{ alignItems: 'center', justifyContent: 'center', top: 10 }}>
                                <Image
                                    source={require('../../../assets/data.png')}
                                    resizeMode='contain'
                                    style={{
                                        width: 25,
                                        height: 25,
                                        tintColor: focused ? '#e32f45' : '#748c94',
                                    }}
                                />
                                <Text style={{ color: focused ? '#e32f45' : '#748c94', fontSize: 12 }}>
                                    DATA
                                </Text>
                            </View>
                        )
                    }
                }} />
        </Tab.Navigator>
    )
}

export default FdlKebisinganScreen;

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#7F5DF0',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5
    }
})