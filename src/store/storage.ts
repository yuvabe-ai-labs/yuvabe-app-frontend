import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV();

export const setItem = (key: string, value: string) => {
  storage.set(key, value);
  console.log('Stored keys:', storage.getAllKeys());
  console.log('Profile image:', storage.getString('profile_image'));
};

export const getItem = (key: string): string | null => {
  return storage.getString(key) || null;
};

export const removeItem = (key: string) => {
  storage.remove(key);
};

export const setTokens = (accessToken: string, refreshToken: string) => {
  storage.set('access_token', accessToken);
  storage.set('refresh_token', refreshToken);
};

export const getToken = (): string | undefined => {
  return storage.getString('jwt_token');
};

export const getAccessToken = (): string | null => {
  return storage.getString('access_token') || null;
};

export const getRefreshToken = (): string | null => {
  return storage.getString('refresh_token') || null;
};

export const clearTokens = () => {
  storage.remove('access_token');
  storage.remove('refresh_token');
};
