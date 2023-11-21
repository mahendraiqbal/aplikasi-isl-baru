import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeFdlAir from './AIR/HomeFdlAir';
import AddFdlAir from './AIR/AddFdlAir';
import DataFdlAir from './AIR/DataFdlAir';

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({children, onPress}) => (
    <TouchableOpacity
        style = {{
            top : -30,
            justifyContent : 'center',
            alignItems : 'center',
            ...styles.shadow
        }}
        onPress={onPress}
    >
        <View style={{
            width : 70, 
            height : 70, 
            borderRadius : 35, 
            backgroundColor : '#e32f45',
            ...styles.shadow
            }}>
            {children}
        </View>
    </TouchableOpacity>
)

const FdlAirCreen = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel : false,
                headerShown: false,
                tabBarStyle : {
                    position : 'absplute',
                    bottom : '25',
                    left : '20',
                    right : '20',
                    elevation : 0,
                    backgroundColor : '#0000',
                    borderRadius : 15,
                    height : 91,
                    ...styles.shadow
                }
            }}
        >
            <Tab.Screen name="Home Fdl Air" component={HomeFdlAir} 
            options={{
                tabBarIcon : ({focused}) => (
                    <View style={{alignItems : 'center', justifyContent : 'center', top : 10}}>
                        <Image
                        source={require('../../../assets/home.png')}
                        resizeMode='contain'
                        style={{
                                width: 25,
                                height: 25,
                                tintColor: focused ? '#e32f45' : '#748c94',
                            }}
                        />
                        <Text style = {{color : focused ? '#e32f45' : '#748c94', fontSize : 12}}>
                            HOME
                        </Text>
                    </View>
                )
            }} />

            <Tab.Screen name="Add Fdl Air" component={AddFdlAir} 
                options={{
                tabBarIcon : ({focused}) => (
                    <View style={{alignItems : 'center', justifyContent : 'center', top : 10}}>
                        <Image
                        source={require('../../../assets/plus.png')}
                        resizeMode='contain'
                        style={{
                                width: 30,
                                height: 30,
                                top : -10,
                                tintColor: '#fff',
                            }}
                        />
                    </View>
                ),
                tabBarButton: (props) => (
                    <CustomTabBarButton {...props} />
                )
            }} />

            <Tab.Screen name="Data Fdl Air" component={DataFdlAir} 
                options={{
                tabBarIcon : ({focused}) => (
                    <View style={{alignItems : 'center', justifyContent : 'center', top : 10}}>
                        <Image
                        source={require('../../../assets/data.png')}
                        resizeMode='contain'
                        style={{
                                width: 25,
                                height: 25,
                                tintColor: focused ? '#e32f45' : '#748c94',
                            }}
                        />
                        <Text style = {{color : focused ? '#e32f45' : '#748c94', fontSize : 12}}>
                            DATA
                        </Text>
                    </View>
                )
            }} />
        </Tab.Navigator>
    )
}

export default FdlAirCreen;

const styles = StyleSheet.create({
    shadow : {
        shadowColor : '#7F5DF0',
        shadowOffset : {
            width : 0,
            height : 0,
        },
        shadowOpacity : 0.25,
        shadowRadius : 3.5,
        elevation : 5
    }
})