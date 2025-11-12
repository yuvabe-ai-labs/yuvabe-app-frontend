import React, { useEffect } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { getHome } from '../../api/auth-api/authApi';
import { useUserStore } from '../../store/useUserStore';
import { styles } from './homeStyles';

const HomeScreen = ({ navigation }: any) => {
  useEffect(() => {
    (async () => {
      try {
        const res = await getHome();
        console.log('Home response:', res);
      } catch (err) {
        console.error('Failed to load home:', err);
        // if err.response?.status === 401 it means token failed and refresh also failed
      }
    })();
  }, []);
  const user = useUserStore(state => state.user);
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo/yuvabe-logo.png')}
        style={styles.logo}
      />

      <Text style={styles.title}>
        Welcome{' '}
        {user?.email
          ? user.email.split('@')[0].charAt(0).toUpperCase() +
            user.email.split('@')[0].slice(1)
          : 'to Yuvabe'}
      </Text>
      <Text style={styles.subtitle}>Work Serve Evolve </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('Chat');
        }}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
