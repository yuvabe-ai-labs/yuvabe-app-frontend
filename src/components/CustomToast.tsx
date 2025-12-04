import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ToastConfig } from 'react-native-toast-message';

type CustomToastProps = {
  text1?: string;
  text2?: string;
  status?: 'success' | 'error';
};

export const CustomToast = ({ text1, text2, status }: CustomToastProps) => {
  const isSuccess = status === 'success';
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isSuccess ? '#1B5E20' : '#B71C1C' }, // GREEN or RED
        { borderLeftColor: isSuccess ? '#00E676' : '#FF1744' }, // neon green / red
      ]}
    >
      <Text style={styles.title}>{text1}</Text>
      {text2 ? <Text style={styles.message}>{text2}</Text> : null}
    </View>
  );
};

export const toastConfig: ToastConfig = {
  customToast: ({ text1, text2, props }) => (
    <CustomToast text1={text1} text2={text2} status={props.status} />
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
