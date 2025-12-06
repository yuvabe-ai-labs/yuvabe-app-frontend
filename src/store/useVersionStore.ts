import { create } from 'zustand';

type VersionState = {
  localVersion: string | null;
  serverVersion: string | null;
  apkUrl: string | null;
  forceBlock: boolean;
  setVersionInfo: (info: {
    localVersion: string;
    serverVersion: string;
    apkUrl: string;
  }) => void;
  setForceBlock: (value: boolean) => void;
};

export const useVersionStore = create<VersionState>(set => ({
  localVersion: null,
  serverVersion: null,
  apkUrl: null,
  forceBlock: false,

  setVersionInfo: info =>
    set({
      localVersion: info.localVersion,
      serverVersion: info.serverVersion,
      apkUrl: info.apkUrl,
    }),

  setForceBlock: value => set({ forceBlock: value }),
}));
