// src/screens/SignUpScreen.tsx
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { signUp } from '../../api/auth-api/authApi';
import { COLORS } from '../../utils/theme';
import styles from './AuthStyles';

type FormData = {
  name: string;
  email: string;
  password: string;
};

const SignUpScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👈 new state

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (data: FormData) => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await signUp(data.name, data.email, data.password);
      console.log('Signup successful:', res);

      Alert.alert(
        'Verification Email Sent',
        'Please check your email and click the verification link to activate your account.',
      );

      navigation.navigate('SignIn');
    } catch (error: any) {
      console.error('Signup error:', error);
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

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join Yuvabe today</Text>

      {/* Name Field */}
      <Controller
        control={control}
        name="name"
        rules={{
          required: 'Full name is required',
          minLength: {
            value: 3,
            message: 'Name must be at least 3 characters long',
          },
        }}
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

      {/* Password Field with Eye Icon */}
      {/* Password Field with Eye Icon */}
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
                styles.passwordInput, // 👈 use a lighter input style here
                errors.password && { borderColor: COLORS.error },
              ]}
              placeholderTextColor={COLORS.textSecondary}
            />
          )}
        />

        {/* 👁️ Toggle Visibility Icon */}
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIconContainer}
        >
          <Icon
            name={showPassword ? 'eye-off' : 'eye'}
            size={22}
            color={COLORS.primary} // 👈 make it visible
          />
        </TouchableOpacity>
      </View>

      {errors.password && (
        <Text style={styles.errorText}>{errors.password.message}</Text>
      )}

      {/* Sign Up Button with Loader */}
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
