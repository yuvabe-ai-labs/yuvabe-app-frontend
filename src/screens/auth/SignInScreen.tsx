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
import { signIn } from '../../api/auth-api/authApi';
import { setItem, setTokens } from '../../store/storage';
import { useUserStore } from '../../store/useUserStore';
import { COLORS } from '../../utils/theme';
import styles from './styles/AuthStyles';

type FormData = {
  email: string;
  password: string;
};

const SignInScreen = ({ navigation }: any) => {
  const setUser = useUserStore(state => state.setUser);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: FormData) => {
    if (loading) return;
    setLoading(true);
    Keyboard.dismiss();

    try {
      console.log(' Sending login request...');
      const res = await signIn(data.email, data.password);
      console.log(' Login success:', res);

      // Save user data (you can store token if needed)
      setUser(res.user);

      console.log(res.access_token);

      Alert.alert('Welcome', `Hi ${res.user?.name}!`, [
        {
          text: 'Continue',
          onPress: () => {
            setTokens(res.access_token, res.refresh_token); // save tokens
            setItem('is_verified', res.user?.is_verified ? 'true' : 'false');
            console.log(
              '✅ Tokens saved, RootNavigator will now switch automatically',
            );
          },
        },
      ]);
    } catch (error: any) {
      console.error(' Login error:', error);
      Alert.alert('Error', error.message || 'Something went wrong');
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
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Enter a valid email address',
          },
        }}
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
            name={showPassword ? 'eye-off' : 'eye'}
            size={22}
            color={COLORS.primary}
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
