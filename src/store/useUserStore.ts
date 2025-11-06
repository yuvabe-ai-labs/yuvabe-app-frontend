import { create } from 'zustand';

type User = {
  name?: string;
  email?: string;
};

type UserStore = {
  user: User | null;
  setUser: (userData: User) => void;
};

export const useUserStore = create<UserStore>(set => ({
  user: null,

  setUser: userData => set({ user: userData }),
}));
