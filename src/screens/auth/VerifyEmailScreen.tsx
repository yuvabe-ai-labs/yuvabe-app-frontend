// src/screens/auth/VerifyEmailScreen.tsx
import { CommonActions, useNavigation } from '@react-navigation/native';
import { Mail } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { sendVerificationEmail } from '../../api/auth-api/authApi';
import { getItem, removeItem, setItem, setTokens } from '../../store/storage'; // 👈 added clearTokens, removeItem
import { useUserStore } from '../../store/useUserStore';
import { COLORS } from '../../utils/theme';
import styles from './styles/VerifyEmailStyles';

const VerifyEmailScreen = ({ route }: any) => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState<string | null>(
    route?.params?.email || null,
  );
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showButton, setShowButton] = useState(true);
  const { setIsLoggedIn, setIsVerified } = useUserStore();

  // ✅ Send verification link
  const handleSendVerification = async () => {
    setLoading(true);
    try {
      console.log('📨 Trying to send verification link to:', email);
      if (!email) {
        Alert.alert('Error', 'Email address is missing.');
        return;
      }

      const response = await sendVerificationEmail(email);
      console.log('Verification response:', response);
      Alert.alert(
        'Email Sent',
        'A verification link has been sent to your email.',
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

  useEffect(() => {
    const loadEmail = async () => {
      if (!email) {
        const storedEmail = await getItem('pending_email');
        console.log('📩 Restored email from storage:', storedEmail);
        if (storedEmail) setEmail(storedEmail);
      }
    };
    loadEmail();
  }, [email]);

  // ✅ Logout handler
  const handleLogout = async () => {
    console.log('🚪 Logging out...');
    try {
      setIsLoggedIn(false);
      setIsVerified(false);
      setItem('is_verified', 'false');
      setItem('pending_email', '');
      setItem('access_token', '');
      setItem('refresh_token', '');

      console.log('🚪 Logged out successfully');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Auth' }], // 👈 RootNavigator will show SignIn
        }),
      );
    } catch (err) {
      console.error('❌ Logout error:', err);
    }
  };

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'Exit App',
        'Are you sure you want to exit?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: true },
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

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
        setItem('is_verified', 'true');
        removeItem('pending_email');
        setIsVerified(true);
        setIsLoggedIn(true);
        Alert.alert('Success', 'Your email has been verified!');
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Handle cold start (app opened directly from link)
    Linking.getInitialURL().then(url => {
      if (url) handleDeepLink({ url });
    });

    return () => subscription.remove();
  }, [setIsLoggedIn, setIsVerified]);

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
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      <View style={styles.card}>
        <Mail
          size={40}
          color={COLORS.primary}
          strokeWidth={2}
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
