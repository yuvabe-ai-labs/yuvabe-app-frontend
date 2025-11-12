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

export const setToken = (token: string) => {
  storage.set('jwt_token', token);
};

export const getToken = (): string | undefined => {
  return storage.getString('jwt_token');
};

export const removeToken = () => {
  storage.remove('jwt_token');
};
