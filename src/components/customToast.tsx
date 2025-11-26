import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ToastConfig } from 'react-native-toast-message';

type CustomToastProps = {
  text1?: string;
  text2?: string;
};

export const CustomToast = ({ text1, text2 }: CustomToastProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{text1}</Text>
      {text2 ? <Text style={styles.message}>{text2}</Text> : null}
    </View>
  );
};

export const toastConfig: ToastConfig = {
  customToast: ({ text1, text2 }) => (
    <CustomToast text1={text1} text2={text2} />
  ),
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    backgroundColor: '#1F1F1F',
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
    borderLeftWidth: 6,
    borderLeftColor: '#00ADB5',
    elevation: 5,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    color: '#DDDDDD',
    fontSize: 14,
    marginTop: 5,
  },
});
