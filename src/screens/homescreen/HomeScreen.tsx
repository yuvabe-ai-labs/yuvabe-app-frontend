import React from 'react';
import { styles } from './homeStyles';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo/yuvabe-logo.png')}
        style={styles.logo}
      />

      {/* Welcome text */}
      <Text style={styles.title}>Welcome to Yuvabe</Text>
      <Text style={styles.subtitle}>Work Serve Evolve </Text>

      {/* Cool Button */}
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
