// src/navigation/AppNavigator.tsx
import React from 'react';

import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
// import { NavigationContainer } from "@react-navigation/native/lib/typescript/src";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
