import { create } from 'zustand';

type LoadingType = string | null;

interface LoadingStore {
  loading: boolean;
  loadingType: LoadingType;
  loadingMessage: string;
  showLoading: (type: LoadingType, message?: string) => void;
  hideLoading: () => void;
}

export const useLoadingStore = create<LoadingStore>(set => ({
  loading: false,
  loadingType: null,
  loadingMessage: '',

  showLoading: (type, message = 'Loading...') =>
    set({
      loading: true,
      loadingType: type,
      loadingMessage: message,
    }),

  hideLoading: () =>
    set({
      loading: false,
      loadingType: null,
      loadingMessage: '',
    }),
}));
