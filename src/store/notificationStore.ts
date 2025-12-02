import { create } from 'zustand';

type NotificationStore = {
  notificationEnabled: boolean;
  setNotificationEnabled: (value: boolean) => void;
};

export const useNotificationStore = create<NotificationStore>(set => ({
  notificationEnabled: true,
  setNotificationEnabled: value => set({ notificationEnabled: value }),
}));
