import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { fetchUserDetails, signIn } from '../../api/auth-api/authApi';
import { signInSchema, SignInSchemaType } from '../../schemas/authSchema';
import { setItem, setTokens } from '../../store/storage';
import { useUserStore } from '../../store/useUserStore';
import { COLORS } from '../../utils/theme';
import { showToast } from '../../utils/ToastHelper';
import styles from './styles/AuthStyles';

const SignInScreen = ({ navigation }: any) => {
  const { setUser, setIsLoggedIn, setIsVerified } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInSchemaType) => {
    if (loading) return;
    setLoading(true);
    Keyboard.dismiss();

    try {
      console.log(' Sending login request...');
      console.log(
        `data that is being sent is : ${data.email} : ${data.password}`,
      );
      const res = await signIn(data.email, data.password);
      console.log(' Login success:', res);
      const userData = await fetchUserDetails();

      // ✅ Save user globally
      setUser(userData.user);
      setIsLoggedIn(true);
      setIsVerified(res.user.is_verified);

      // ✅ Store tokens locally
      setTokens(res.access_token, res.refresh_token);
      await setItem('is_verified', res.user.is_verified ? 'true' : 'false');
      await setItem('pending_email', data.email);
      console.log('💾 Saved is_verified:', res.user.is_verified);
      console.log('💾 Saved pending_email:', data.email);

      if (!res.user.is_verified) {
        console.log('⚠️ User not verified, navigating to VerifyEmail...');
        navigation.navigate('VerifyEmail', { email: data.email });
        return;
      }
      console.log('✅ RootNavigator will switch automatically');
      // Alert.alert('Welcome', `Hi ${res.user?.name}!`, [
      //   {
      //     text: 'Continue',
      //     onPress: () => {
      //       console.log('✅ RootNavigator will switch automatically');
      //     },
      //   },
      // ]);
    } catch (error: any) {
      console.error(' Login error:', error);

      if (
        error.message?.includes('Verify email to login') ||
        error.message?.includes('User not verified')
      ) {
        setIsVerified(false);
        setItem('is_verified', 'false');
        await setItem('pending_email', data.email);
        navigation.navigate('VerifyEmail', { email: data.email });
      } else {
        showToast('Error', error.message || 'Something went wrong');
      }
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

      <Text style={styles.title}>Welcome Back </Text>
      <Text style={styles.subtitle}>Sign in to continue to Yuvabe</Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Email"
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
            autoCapitalize="none"
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
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIconContainer}
          >
            {showPassword ? (
              <Eye size={22} color={COLORS.primary} strokeWidth={2} />
            ) : (
              <EyeOff size={22} color={COLORS.primary} strokeWidth={2} />
            )}
          </TouchableOpacity>
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
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Don’t have an account?{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>
          Sign Up
        </Text>
      </Text>
    </View>
  );
};

export default SignInScreen;
