import React from "react";
import { View, Image } from "react-native";

// imported screen
import Login from "./screens/Login";
import Home from "./screens/Home";

import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTab = () => {
  <Tab.Navigator
    initialRouteName="Home"
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
            source={require('../assets/home.png')}
              resizeMode="cover"
              style={{
                width: 50,
                height: 50,
                tintColor: focused && "#ffcd61",
              }}
            />
          </View>
        ),
        tabBarActiveBackgroundColor: "#f5f5f5",
      }}
      name="Home"
      component={Home}
    />
  </Tab.Navigator>;
};

const Router = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="BotTab" component={BottomTab} />
    </Stack.Navigator>
  );
};

export default Router;
