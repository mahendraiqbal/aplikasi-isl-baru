import 'react-native-gesture-handler';

// Import React and Component
import React from 'react';

// Import Navigators from React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import Screens
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/Login';
import DrawerNavigationRoutes from './screens/DrawerNavigationRoutes';
import Limbah from './screens/DrawerScreens/AIR/Limbah';
// import Tabs from './Screen/DrawerScreens/FdlAirCreen';

const Stack = createStackNavigator();

const Auth = () => {
    return (
        <Stack.Navigator initialRouteName="LoginScreen">
            <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

const App = () => {
    return (
            <Stack.Navigator initialRouteName="SplashScreen">
                {/* SplashScreen which will come once for 5 Seconds */}
                <Stack.Screen
                    name="SplashScreen"
                    component={SplashScreen}
                    // Hiding header for Splash Screen
                    options={{ headerShown: false }}
                />
                {/* Auth Navigator: Include Login and Signup */}
                <Stack.Screen
                    name="Auth"
                    component={Auth}
                    options={{ headerShown: false }}
                />
                {/* Navigation Drawer as a landing page */}
                <Stack.Screen
                    name="DrawerNavigationRoutes"
                    component={DrawerNavigationRoutes}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Limbah"
                    component={Limbah}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
    );
};

export default App;