import {
  createNavigationContainerRef,
  NavigationContainer,
  NavigationContainerRefWithCurrent,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import BootSplash from 'react-native-bootsplash';
import { fetchUserDetails } from '../api/auth-api/authApi';
import { getAccessToken, getItem, setItem } from '../store/storage';
import { useUserStore } from '../store/useUserStore';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';
import VerifyNavigator from './VerifyNavigator';

export const navigationRef: NavigationContainerRefWithCurrent<any> =
  createNavigationContainerRef();

export function navigate(name: string, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { isLoggedIn, isVerified, setUser, setIsLoggedIn, setIsVerified } =
    useUserStore();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = getAccessToken();
      const storedVerified = getItem('is_verified');
      const storedEmail = getItem('pending_email');
      if (storedVerified === 'false' && storedEmail) {
        setIsLoggedIn(true);
        setIsVerified(false);
        setIsAuthChecked(true);
        return;
      }
      if (!token) {
        setIsLoggedIn(false);
        setIsVerified(false);
        setIsAuthChecked(true);
        return;
      }
      try {
        let userData = null;
        try {
          userData = await fetchUserDetails();
        } catch (e) {
          console.log('User fetch failed, using cached user', e);
        }

        const verified = userData.user?.is_verified ?? false;
        const email = userData.user?.email || '';

        setUser(userData.user);
        setIsLoggedIn(true);
        setIsVerified(verified);

        setItem('is_verified', verified ? 'true' : 'false');
        setItem('pending_email', email);
      } catch (err) {
        console.error(' Could not verify user:', err);
        setIsLoggedIn(false);
        setIsVerified(false);
      } finally {
        setIsAuthChecked(true);
      }
    };

    initAuth();
  }, [setIsLoggedIn, setIsVerified, setUser]);

  if (!isAuthChecked) {
    return null;
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        BootSplash.hide({ fade: true });
      }}
    >
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
