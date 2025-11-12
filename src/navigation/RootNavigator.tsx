import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { getAccessToken, getItem, storage } from '../store/storage';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

const RootNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  const checkLoginStatus = () => {
    const userToken = getAccessToken();
    const verified = getItem('is_verified');
    console.log('🔍 Checking login state:', { userToken, verified });

    setIsLoggedIn(!!userToken);
    setIsVerified(verified === 'true');
  };

  useEffect(() => {
    checkLoginStatus();

    const listener = storage.addOnValueChangedListener(() => {
      checkLoginStatus();
    });
    return () => listener.remove();
  }, []);

  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        // ✅ Logged in → only AppNavigator (Home + Verify if needed)
        <AppNavigator />
      ) : (
        // ✅ Not logged in → show Auth flow (SignIn, SignUp, VerifyEmail)
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
