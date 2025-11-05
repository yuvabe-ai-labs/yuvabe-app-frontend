import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import styles from './AuthStyles';
import { useForm, Controller } from 'react-hook-form';
import { COLORS } from '../../utils/theme';

type FormData = {
  email: string;
  password: string;
};

const SignInScreen = ({ navigation }: any) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);

    navigation.navigate('Home');
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
        <Text style={styles.buttonText}>Sign In</Text>
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
