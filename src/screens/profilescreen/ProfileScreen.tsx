// src/screens/profilescreen/ProfileScreen.tsx
import { CommonActions, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { setItem } from '../../store/storage';
import { useUserStore } from '../../store/useUserStore';
import { styles } from './ProfileStyles';

export const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { setIsLoggedIn, setIsVerified, resetUser } = useUserStore();

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            console.log('🚪 Logging out...');
            resetUser();
            setIsLoggedIn(false);
            setIsVerified(false);

            await setItem('is_verified', 'false');
            await setItem('pending_email', '');
            await setItem('access_token', '');
            await setItem('refresh_token', '');

            console.log('✅ Logged out successfully');
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Auth' }], // 👈 RootNavigator will show SignIn
              }),
            );
          } catch (error) {
            console.error('❌ Logout error:', error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* ✅ Logout in top-right corner */}

      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Welcome to your profile screen!</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
