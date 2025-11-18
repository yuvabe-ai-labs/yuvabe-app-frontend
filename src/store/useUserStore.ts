// store/useUserStore.ts
import { create } from 'zustand';

type User = {
  id: string; 
  name?: string;
  email?: string;
  is_verified?: boolean;
  dob?: string | null;
  profile_picture?: string | null;
};

type UserStore = {
  user: User | null;
  isLoggedIn: boolean;
  isVerified: boolean;
  setUser: (userData: User) => void;
  setIsLoggedIn: (status: boolean) => void;
  setIsVerified: (status: boolean) => void;
  resetUser: () => void;
};

export const useUserStore = create<UserStore>(set => ({
  user: null,
  isLoggedIn: false,
  isVerified: false,

  setUser: userData => set({ user: userData }),
  setIsLoggedIn: status => set({ isLoggedIn: status }),
  setIsVerified: status => set({ isVerified: status }),
  resetUser: () => set({ user: null, isLoggedIn: false, isVerified: false }),
}));
