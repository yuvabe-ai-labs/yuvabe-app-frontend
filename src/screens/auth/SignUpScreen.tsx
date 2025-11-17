// src/screens/SignUpScreen.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { fetchUserDetails, signUp } from '../../api/auth-api/authApi';
import { signUpSchema, SignUpSchemaType } from '../../schemas/authSchema';
import { setItem } from '../../store/storage';
import { useUserStore } from '../../store/useUserStore';
import { COLORS } from '../../utils/theme';
import styles from './styles/AuthStyles';

const SignUpScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const { setUser, setIsLoggedIn, setIsVerified } = useUserStore();

  const [showPassword, setShowPassword] = useState(false); // 👈 new state

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpSchemaType) => {
    if (loading) return;
    setLoading(true);
    Keyboard.dismiss();

    try {
      const res = await signUp(data.name, data.email, data.password);
      console.log('Signup successful:', res);

      // const accessToken = res.data?.access_token;
      // const refreshToken = res.data?.refresh_token;

      // if (accessToken && refreshToken) {
      //   console.log('✅ Tokens received at signup');
      //   setTokens(accessToken, refreshToken);
      // } else {
      //   console.warn('⚠️ No tokens returned at signup');
      // }

      console.log('Signup successful:', res.data);

      // const email = data.email;

      // await setItem('is_verified', 'false');
      // await setItem('pending_email', data.email);
      // Alert.alert(
      //   'Verify Your Email',
      //   'We’ve sent you a verification link. Please check your inbox.',
      //   [
      //     {
      //       text: 'Go to Verification',
      //       onPress: () =>
      //         navigation.navigate('VerifyEmail', { email: data.email }),
      //     },
      //   ],
      // );

      // Navigate to verification screen
      await setItem('is_verified', 'true');
      await setItem('pending_email', data.email);

      // If your API returns token
      if (res?.data?.access_token) {
        await setItem('access_token', res.data.access_token);
      }

      const userData = await fetchUserDetails();
      console.log('User fetched after signup:', userData);

      setUser(userData.user);
      setIsLoggedIn(true);
      setIsVerified(true);

      navigation.reset({
        index: 0,
        routes: [{ name: 'App' }],
      });
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo/yuvabe-logo.png')}
        style={styles.logo}
      />

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join Yuvabe today</Text>

      {/* Name Field */}
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Full Name"
            value={value}
            onChangeText={onChange}
            style={[styles.input, errors.name && { borderColor: COLORS.error }]}
            placeholderTextColor={COLORS.textSecondary}
          />
        )}
      />
      {errors.name && (
        <Text style={styles.errorText}>{errors.name.message}</Text>
      )}

      {/* Email Field */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={value}
            onChangeText={onChange}
            style={[
              styles.input,
              errors.email && { borderColor: COLORS.error },
            ]}
            placeholderTextColor={COLORS.textSecondary}
          />
        )}
      />
      {errors.email && (
        <Text style={styles.errorText}>{errors.email.message}</Text>
      )}

      <View style={styles.passwordContainer}>
        <Controller
          control={control}
          name="password"
          rules={{
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters long',
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={value}
              onChangeText={onChange}
              style={[
                styles.passwordInput,
                errors.password && { borderColor: COLORS.error },
              ]}
              placeholderTextColor={COLORS.textSecondary}
            />
          )}
        />

        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIconContainer}
        >
          <Icon
            name={showPassword ? 'eye' : 'eye-off'}
            size={22}
            color={COLORS.primary} // 👈 make it visible
          />
        </TouchableOpacity>
      </View>

      {errors.password && (
        <Text style={styles.errorText}>{errors.password.message}</Text>
      )}

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Already have an account?{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('SignIn')}>
          Sign In
        </Text>
      </Text>
    </View>
  );
};

export default SignUpScreen;
