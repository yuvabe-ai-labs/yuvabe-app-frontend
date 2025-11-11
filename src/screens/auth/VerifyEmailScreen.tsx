import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { COLORS } from '../../utils/theme';
import styles from './AuthStyles';// (you can reuse the signup email sending logic if needed)
import Icon from 'react-native-vector-icons/Feather';

const VerifyEmailScreen = ({ route, navigation }: any) => {
  const { email } = route.params; // 👈 get user email from signup
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0); // countdown
  const [showButton, setShowButton] = useState(true); // control UI

  const handleSendVerification = async () => {
    setLoading(true);
    try {
      // ✅ Call your API to send verification link
      const response = await fetch('https://68c71e06225c.ngrok-free.app/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send verification link');
      }

      setShowButton(false);
      setTimer(60); // start 60-sec countdown
    } catch (error: any) {
      console.error('Verification error:', error);
      Alert.alert(error.message || 'Failed to send verification link');
    } finally {
      setLoading(false);
    }
  };

  // ⏱ Countdown effect
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !showButton) {
      setShowButton(true); // show resend after countdown
    }
  }, [showButton, timer]);

  return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <View
        style={{
          backgroundColor: COLORS.white,
          padding: 25,
          borderRadius: 15,
          alignItems: 'center',
          width: '85%',
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 4,
        }}
      >
        <Icon name="mail" size={40} color={COLORS.primary} style={{ marginBottom: 15 }} />
        <Text style={[styles.title, { fontSize: 20 }]}>Activate Your Account</Text>
        <Text
          style={{
            textAlign: 'center',
            color: COLORS.textSecondary,
            marginVertical: 10,
            fontSize: 15,
          }}
        >
          To continue, please verify your email. Click the button below to receive your verification link.
        </Text>

        {/* 👇 Button / Timer logic */}
        {showButton ? (
          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.6 }]}
            onPress={handleSendVerification}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>
                {timer === 0 ? 'Send Verification Link' : 'Resend Verification Link'}
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <Text style={{ color: COLORS.primary, fontSize: 16, marginTop: 10 }}>
            Resend available in {timer}s
          </Text>
        )}
      </View>
    </View>
  );
};

export default VerifyEmailScreen;


