import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/auth/SplashScreen';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';
import VerifyNavigator from './VerifyNavigator';
import { getAccessToken, getItem, setItem } from '../store/storage';
import { fetchUserDetails } from '../api/auth-api/authApi';
import { useUserStore } from '../store/useUserStore';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { isLoggedIn, isVerified, setUser, setIsLoggedIn, setIsVerified } =
    useUserStore();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = getAccessToken();
      const storedVerified = await getItem('is_verified');
      const storedEmail = await getItem('pending_email');

      console.log('🔍 Token:', token);
      console.log('🔍 Stored is_verified:', storedVerified);
      console.log('🔍 Stored email:', storedEmail);

      // 🧠 STEP 1: If user is unverified, go to Verify first (even without token)
      if (storedVerified === 'false' && storedEmail) {
        console.log('📧 User unverified → Go to Verify screen');
        setIsLoggedIn(true);
        setIsVerified(false);
        setIsAuthChecked(true);
        return;
      }

      // 🧠 STEP 2: If no token, show Sign-In
      if (!token) {
        console.log('🚪 No token → Show Sign-In');
        setIsLoggedIn(false);
        setIsVerified(false);
        setIsAuthChecked(true);
        return;
      }

      // 🧠 STEP 3: If token exists, verify via API
      try {
        const userData = await fetchUserDetails();
        console.log('🧠 User from backend:', userData);

        const verified = userData.user?.is_verified ?? false;
        const email = userData.user?.email || '';

        setUser(userData.user);
        setIsLoggedIn(true);
        setIsVerified(verified);

        await setItem('is_verified', verified ? 'true' : 'false');
        await setItem('pending_email', email);
      } catch (err) {
        console.error('❌ Could not verify user:', err);
        setIsLoggedIn(false);
        setIsVerified(false);
      } finally {
        setIsAuthChecked(true);
      }
    };

    initAuth();
  }, [setIsLoggedIn, setIsVerified, setUser]);

  if (!isAuthChecked) {
    return <SplashScreen navigation={{ replace: () => {} }} />;
  }

  // ✅ Zustand handles re-rendering automatically here
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn && isVerified ? (
          <Stack.Screen name="App" component={AppNavigator} />
        ) : isLoggedIn && !isVerified ? (
          <Stack.Screen name="Verify" component={VerifyNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
