// src/screens/auth/VerifyEmailScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { sendVerificationEmail } from '../../api/auth-api/authApi';
import { setTokens } from '../../store/storage';
import { COLORS } from '../../utils/theme';
import styles from './styles/VerifyEmailStyles';

const VerifyEmailScreen = ({ route, navigation }: any) => {
  const { email } = route.params;
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showButton, setShowButton] = useState(true);

  // ✅ Send verification link
  const handleSendVerification = async () => {
    setLoading(true);
    try {
      const response = await sendVerificationEmail(email);
      console.log('Verification response:', response);
      Alert.alert(
        'Email Sent',
        'A verification link has been sent to your email address.',
      );
      setShowButton(false);
      setTimer(60);
    } catch (error: any) {
      console.error('Verification error:', error);
      Alert.alert('Error', error.message || 'Failed to send verification link');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Listen for deep link (yuvabe://verified?token=XYZ)
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const parseQueryParams = (url: string) => {
        console.log('Deep link triggered:', event.url);
        const queryString = url.split('?')[1];
        const queryParams: Record<string, string> = {};

        if (!queryString) return queryParams;

        queryString.split('&').forEach(param => {
          const [key, value] = param.split('=');
          queryParams[decodeURIComponent(key)] = decodeURIComponent(
            value || '',
          );
        });

        return queryParams;
      };

      const queryParams = parseQueryParams(event.url);
      const token = queryParams.token;

      if (token) {
        console.log('✅ JWT token received:', token);
        setTokens(token, '');
        Alert.alert('Success', 'Your email has been verified!');

        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Handle cold start (app opened directly from link)
    Linking.getInitialURL().then(url => {
      if (url) handleDeepLink({ url });
    });

    return () => subscription.remove();
  }, [navigation]);

  // ⏱ Timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !showButton) {
      setShowButton(true);
    }
  }, [showButton, timer]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Icon
          name="mail"
          size={40}
          color={COLORS.primary}
          style={styles.icon}
        />
        <Text style={styles.title}>Activate Your Account</Text>
        <Text style={styles.description}>
          To continue, please verify your email. Click the button below to
          receive your verification link.
        </Text>

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
                {timer === 0
                  ? 'Send Verification Link'
                  : 'Resend Verification Link'}
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <Text style={styles.timerText}>Resend available in {timer}s</Text>
        )}
      </View>
    </View>
  );
};

export default VerifyEmailScreen;
