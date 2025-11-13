// src/navigation/VerifyNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import VerifyEmailScreen from '../screens/auth/VerifyEmailScreen';

const VerifyStack = createNativeStackNavigator();

const VerifyNavigator = ({ email }: { email?: string }) => {
  return (
    <VerifyStack.Navigator initialRouteName="VerifyEmail">
      <VerifyStack.Screen name="VerifyEmail" options={{ headerShown: false }}>
        {props => <VerifyEmailScreen {...props} email={email} />}
      </VerifyStack.Screen>
    </VerifyStack.Navigator>
  );
};

export default VerifyNavigator;
