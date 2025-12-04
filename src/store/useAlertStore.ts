import { create } from 'zustand';

type AlertConfig = {
  visible: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  destructive: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export const useAlertStore = create<
  AlertConfig & {
    showAlert: (config: Partial<AlertConfig>) => void;
    hideAlert: () => void;
  }
>(set => ({
  visible: false,
  title: '',
  message: '',
  confirmText: 'OK',
  cancelText: 'Cancel',
  destructive: false,
  onConfirm: () => {},
  onCancel: () => {},

  showAlert: config =>
    set({
      visible: true,
      title: config.title ?? '',
      message: config.message ?? '',
      confirmText: config.confirmText ?? 'OK',
      cancelText: config.cancelText ?? 'Cancel',
      destructive: config.destructive ?? false,
      onConfirm: config.onConfirm ?? (() => {}),
      onCancel: config.onCancel ?? (() => set({ visible: false })),
    }),

  hideAlert: () => set({ visible: false }),
}));
