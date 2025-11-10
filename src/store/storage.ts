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
