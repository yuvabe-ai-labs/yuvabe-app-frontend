import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV();

export const setItem = (key: string, value: string) => {
  storage.set(key, value);
};

export const getItem = (key: string): string | null => {
  return storage.getString(key) || null;
};

export const removeItem = (key: string) => {
  storage.remove(key);
};

const visionBoardStorage = createMMKV({
  id: 'visionBoardStorage',
});

export const getVisionBoard = (email: string) => {
  const key = `VISION_BOARD_TILES_${email}`;
  const value = visionBoardStorage.getString(key);
  return value ? JSON.parse(value) : null;
};

export const setVisionBoard = (email: string, tiles: any[]) => {
  const key = `VISION_BOARD_TILES_${email}`;
  visionBoardStorage.set(key, JSON.stringify(tiles));
};

export const removeVisionBoard = (email: string) => {
  const key = `VISION_BOARD_TILES_${email}`;
  visionBoardStorage.remove(key);
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
