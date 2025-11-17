import { setTokens } from '../../store/storage';
import api from './axiosInstance';

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

export const sendVerificationEmail = async (email: string) => {
  try {
    console.log('📧 Sending verification email for:', email);
    const response = await api.post('/auth/send-verification', { email });
    console.log('✅ Verification email response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(' Verification email error:', error.response?.data || error);

    if (error.response) {
      const detail = error.response.data?.detail;
      const message =
        typeof detail === 'string'
          ? detail
          : typeof detail === 'object'
          ? JSON.stringify(detail)
          : 'Failed to send verification link';

      throw new Error(message);
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
    console.log(`inside sign in function before api call`);
    const response = await api.post('/auth/login', { email, password });

    console.log(`inside sign in function after api call`);
    console.log(' Raw Axios response:', response);

    const data = response.data.data;
    console.log(' Parsed data:', data);

    // If backend wraps tokens inside "data"
    setTokens(data.access_token, data.refresh_token);
    return data;
  } catch (error: any) {
    console.log('Full login error:', error);

    if (error.response) {
      console.log('Response data:', error.response.data);
      console.log('Status:', error.response.status);
      const message =
        error.response.data.detail ||
        error.response.data.message ||
        'Login failed';
      throw new Error(message);
    }

    if (error.request) {
      console.log('Request made but no response:', error.request);
      throw new Error('No response from server');
    }

    throw new Error(error.message || 'Network error');
  }
};

export const getHome = async () => {
  // api is your axios instance that automatically adds Authorization header
  const response = await api.get('/auth/home');
  console.log(`The fetched user details is ${response}`);
  return response.data; // returns { code: 200, data: { ... } }
};

export const fetchUserDetails = async () => {
  try {
    const response = await api.get('/auth/home');

    console.log('Fetched:', response.data.data);

    // root navigator expects this EXACT structure:
    // return { message, user, home_data }
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to fetch user details:', error);
    throw error;
  }
};
