// store/useUserStore.ts
import { create } from 'zustand';

type User = {
  id: string;
  name?: string;
  email?: string;
  is_verified?: boolean;
  team_name?: string;
  role?: string;
  appRole?: string;
  mentor_name?: string;
  dob?: string | null;
  profile_picture?: string | null;
};

type ProfileDetails = {
  name: string;
  email: string;
  team_name: string;
  mentor_name: string;
  mentor_email: string;
};

type UserStore = {
  user: User | null;
  isLoggedIn: boolean;
  isVerified: boolean;
  team_name?: string;
  mentor_name?: string;
  setUser: (userData: User) => void;
  setProfileDetails: (details: ProfileDetails) => void;
  setIsLoggedIn: (status: boolean) => void;
  setIsVerified: (status: boolean) => void;
  resetUser: () => void;
};

export const useUserStore = create<UserStore>(set => ({
  user: null,
  isLoggedIn: false,
  isVerified: false,
  team_name: '',
  mentor_name: '',

  setUser: userData =>
    set(state => ({
      user: {
        ...state.user,
        ...userData,
        role: userData.role ?? state.user?.role,
      },
    })),

  setProfileDetails: (details: ProfileDetails) =>
    set(state => ({
      user: state.user
        ? {
            ...state.user,
            name: details.name,
            email: details.email,
          }
        : {
            id: '',
            name: details.name,
            email: details.email,
          },

      team_name: details.team_name,
      mentor_name: details.mentor_name,
      mentor_email: details.mentor_email,
    })),

  setIsLoggedIn: status => set({ isLoggedIn: status }),
  setIsVerified: status => set({ isVerified: status }),
  resetUser: () => set({ user: null, isLoggedIn: false, isVerified: false }),
}));
