import axios from 'axios';
import Config from 'react-native-config';
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from '../../store/storage';

const API_BASE_URL = Config.API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// 🧠 Automatically attach access token
api.interceptors.request.use(async config => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔄 Handle token expiration
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // If token expired & we haven’t retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const newAccessToken = res.data.data.access_token;
        const currentRefreshToken = getRefreshToken(); // reuse same refresh token
        setTokens(newAccessToken, currentRefreshToken!);

        // Retry failed request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        clearTokens();
      }
    }

    return Promise.reject(error);
  },
);

export default api;
