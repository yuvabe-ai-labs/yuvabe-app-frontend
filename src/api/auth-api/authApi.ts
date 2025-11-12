import axios from 'axios';

// ✅ Use your backend base URL here
const API_BASE_URL = 'https://68c71e06225c.ngrok-free.app';

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const signUp = async (name: string, email: string, password: string) => {
  try {
    const response = await api.post('/auth/signup', { name, email, password });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.detail || 'Signup failed');
    }
    throw new Error('Network error');
  }
};

export const sendVerificationEmail = async (
  email: string,
) => {
  try {
    const response = await api.post('/auth/send-verification', {
      email,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        error.response.data.detail || 'Failed to send verification link',
      );
    }
    throw new Error('Network error');
  }
};

export const verifyOtp = async (email: string, otp: string) => {
  try {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.detail || 'OTP verification failed');
    }
    throw new Error('Network error');
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.detail || 'Login failed');
    }
    throw new Error('Network error');
  }
};
