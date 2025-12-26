import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV();

const NICKNAME_KEY = 'nickname';

const STORAGE_KEYS = {
  CUMULATIVE_STEPS: 'cumulative_steps', // Steps shown to user
  LAST_HARDWARE_VAL: 'last_hardware_val', // Raw sensor number
  STEPS_DATE: 'steps_date',
};

export const saveNickname = (nick: string | null) => {
  if (!nick) {
    storage.remove(NICKNAME_KEY);
  } else {
    storage.set(NICKNAME_KEY, nick);
  }
};

export const loadNickname = (): string | null => {
  return storage.getString(NICKNAME_KEY) || null;
};

export const removeNickname = () => {
  storage.remove(NICKNAME_KEY);
};

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

const getTodayString = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.toISOString().split('T')[0];
};

export const loadTodaySteps = (): number => {
  const today = getTodayString();
  const savedDate = storage.getString(STORAGE_KEYS.STEPS_DATE);

  if (savedDate !== today) {
    storage.set(STORAGE_KEYS.CUMULATIVE_STEPS, 0);
    storage.set(STORAGE_KEYS.STEPS_DATE, today);
    // Don't reset hardware val here, only cumulative
    return 0;
  }

  return storage.getNumber(STORAGE_KEYS.CUMULATIVE_STEPS) || 0;
};

export const saveTodaySteps = (steps: number) => {
  const today = getTodayString();
  storage.set(STORAGE_KEYS.CUMULATIVE_STEPS, steps);
  storage.set(STORAGE_KEYS.STEPS_DATE, today);
};

// --- NEW FUNCTIONS FOR HARDWARE PERSISTENCE ---

export const saveLastHardwareValue = (val: number) => {
  storage.set(STORAGE_KEYS.LAST_HARDWARE_VAL, val);
};

export const loadLastHardwareValue = (): number => {
  return storage.getNumber(STORAGE_KEYS.LAST_HARDWARE_VAL) || 0;
};

export const clearTokens = () => {
  storage.remove('access_token');
  storage.remove('refresh_token');
};
