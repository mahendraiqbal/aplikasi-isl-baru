import React from "react";
import { View, Image } from "react-native";

// imported screen components
import Login from "./screens/Login";
import Home from "./screens/Home";
import Dashboard from "./screens/Dashboard";
import Profile from "./screens/Profile";
import Document from "./screens/Document";
import Add from "./screens/Add";
import Kebisingan from "./screens/DashboardMenu/Kebisingan";
import addDataKebisingan from "./screens/DashboardMenu/Kebisingan/addDataKebisingan";
import showDataKebisingan from "./screens/DashboardMenu/Kebisingan/showDataKebisingan";

import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTab = () => {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60,
        },
      }}
    >
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                source={require('../assets/dashboard.png')}
                resizeMode="cover"
                style={{
                  width: 50,
                  height: 50,
                  tintColor: focused ? "#ffcd61" : undefined,
                }}
              />
            </View>
          ),
          tabBarActiveBackgroundColor: "#f5f5f5",
        }}
        name="Dashboard"
        component={Dashboard}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                source={require('../assets/home.png')}
                resizeMode="cover"
                style={{
                  width: 50,
                  height: 50,
                  tintColor: focused ? "#ffcd61" : undefined,
                }}
              />
            </View>
          ),
          tabBarActiveBackgroundColor: "#f5f5f5",
        }}
        name="Home"
        component={Home}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                source={require('../assets/add.png')}
                resizeMode="cover"
                style={{
                  width: 50,
                  height: 50,
                  tintColor: focused ? "#ffcd61" : undefined,
                }}
              />
            </View>
          ),
          tabBarActiveBackgroundColor: "#f5f5f5",
        }}
        name="Add"
        component={Add}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                source={require('../assets/document.png')}
                resizeMode="cover"
                style={{
                  width: 50,
                  height: 50,
                  tintColor: focused ? "#ffcd61" : undefined,
                }}
              />
            </View>
          ),
          tabBarActiveBackgroundColor: "#f5f5f5",
        }}
        name="Document"
        component={Document}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                source={require('../assets/user.png')}
                resizeMode="cover"
                style={{
                  width: 50,
                  height: 50,
                  tintColor: focused ? "#ffcd61" : undefined,
                }}
              />
            </View>
          ),
          tabBarActiveBackgroundColor: "#f5f5f5",
        }}
        name="Profile"
        component={Profile}
      />
    </Tab.Navigator>
  );
};

const Router = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Dashboard" component={Dashboard} options={{ tabBarVisible: false }}/>
      <Stack.Screen name="BottomTab" component={BottomTab} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Kebisingan" component={Kebisingan} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Document" component={Document} />
      <Stack.Screen name="Add" component={Add} />
      <Stack.Screen name="AddDataKebisingan" component={addDataKebisingan} />
      <Stack.Screen name="ShowDataKebisingan" component={showDataKebisingan} />
    </Stack.Navigator>
  );
};

export default Router;
