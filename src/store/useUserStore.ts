// store/useUserStore.ts
import { create } from 'zustand';

type User = {
  id: string;
  name?: string;
  email?: string;
  join_date?: string | null;
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
  lead_label: string;
  lead_name: string;
  lead_email: string;
  join_date: string | null;
};

type UserStore = {
  userDetails: any;
  user: User | null;
  isLoggedIn: boolean;
  isVerified: boolean;
  isLogoutLoading: boolean;
  team_name?: string;
  lead_label?: string;
  lead_name?: string;
  lead_email?: string;
  setUser: (userData: User) => void;
  setProfileDetails: (details: ProfileDetails) => void;
  setIsLoggedIn: (status: boolean) => void;
  setIsVerified: (status: boolean) => void;
  setLogoutLoading: (value: boolean) => void;
  resetUser: () => void;
};

export const useUserStore = create<UserStore>(set => ({
  user: null,
  userDetails: null,
  isLoggedIn: false,
  isVerified: false,
  isLogoutLoading: false,
  team_name: '',
  lead_label: '',
  lead_name: '',
  lead_email: '',

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
            join_date: details.join_date,
          }
        : {
            id: '',
            name: details.name,
            email: details.email,
            join_date: details.join_date,
          },

      team_name: details.team_name,
      lead_label: details.lead_label,
      lead_name: details.lead_name,
      lead_email: details.lead_email,

      userDetails: details,
    })),

  setIsLoggedIn: status => set({ isLoggedIn: status }),
  setIsVerified: status => set({ isVerified: status }),

  setLogoutLoading: (value: boolean) => set({ isLogoutLoading: value }),

  resetUser: () => set({ user: null, isLoggedIn: false, isVerified: false }),
}));
