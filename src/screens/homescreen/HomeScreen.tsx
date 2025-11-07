import React from 'react';
import { styles } from './homeStyles';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useUserStore } from '../../store/useUserStore';

const HomeScreen = ({ navigation }: any) => {
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
