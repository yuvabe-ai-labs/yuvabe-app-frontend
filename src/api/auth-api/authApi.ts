import { setTokens } from '../../store/storage';
import api from '../client/axiosClient';

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
    const response = await api.post('/auth/send-verification', { email });
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

    const response = await api.post('/auth/login', { email, password });

    const data = response.data.data;

    // If backend wraps tokens inside "data"
    setTokens(data.access_token, data.refresh_token);
    return data;
  } catch (error: any) {

    if (error.response) {
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
  return response.data; // returns { code: 200, data: { ... } }
};

export const fetchUserDetails = async () => {
  try {
    const response = await api.get('/auth/home');

    // root navigator expects this EXACT structure:
    // return { message, user, home_data }

    return response.data.data;
  } catch (error: any) {
    console.error('Failed to fetch user details:', error);
    throw error;
  }
};

export const tokenizeQuery = async (text: string) => {
  try {
    const response = await api.post('/chatbot/tokenize', { text });
    return response.data;
  } catch (error: any) {


    if (error.response) {
      throw new Error(error.response.data.detail || 'Tokenization failed');
    }
    throw new Error('Network error');
  }
};
export const semanticSearch = async (
  embedding: number[],
  top_k: number = 3,
) => {
  try {
    const cleanEmbedding = Array.from(embedding).map(Number);

    const response = await api.post('/chatbot/semantic-search', {
      embedding: cleanEmbedding,
      top_k,
    });

    

    if (response.data?.data) {
      return response.data.data;
    }

    if (Array.isArray(response.data)) {
      return response.data;
    }

    throw new Error('Unexpected semantic search response format');
  } catch (error: any) {
    
    throw new Error(error.response?.data?.detail || 'Semantic search failed');
  }
};

export const submitEmotion = async (
  userId: string ,
  emotion: string | null,
  timeOfDay: 'morning' | 'evening',
) => {
  try {
    const payload: any = {
      user_id: userId,
      log_date: new Date().toISOString().split('T')[0],
    };

    if (timeOfDay === 'morning') {
      payload.morning_emotion = emotion;
    } else {
      payload.evening_emotion = emotion;
    }

    const response = await api.post('/home/emotion', payload);
    return response.data;
  } catch (error: any) {
    
    throw new Error(error.response?.data?.detail || 'Failed to submit emotion');
  }
};
