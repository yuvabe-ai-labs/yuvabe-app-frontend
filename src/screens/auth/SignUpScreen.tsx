// src/screens/SignUpScreen.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import styles from './AuthStyles';
import { useForm, Controller } from 'react-hook-form';
import { COLORS } from '../../utils/theme';

type FormData = {
  name: string;
  email: string;
  password: string;
};

const SignUpScreen = ({ navigation }: any) => {
  // react-hook-form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = (data: FormData) => {
    console.log('User signed up with:', data);

    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo/yuvabe-logo.png')}
        style={styles.logo}
      />

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join Yuvabe today </Text>

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
            secureTextEntry
            value={value}
            onChangeText={onChange}
            style={[
              styles.input,
              errors.password && { borderColor: COLORS.error },
            ]}
            placeholderTextColor={COLORS.textSecondary}
          />
        )}
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password.message}</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Sign Up</Text>
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
