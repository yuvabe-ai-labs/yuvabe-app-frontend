import * as RNFS from '@dr.pogodin/react-native-fs';
import NetInfo from '@react-native-community/netinfo';
import { create } from 'zustand';
import {
  checkModelsExist,
  downloadAllModels,
} from '../screens/chatbot/models/modelDownloader';
import {
  COMPLETE_FLAG_PATH,
  MODEL_1_PATH,
  MODEL_2_PATH,
  MODEL_3_PATH,
} from '../screens/chatbot/models/modelPaths';

type DownloadState = 'idle' | 'downloading' | 'completed' | 'error';

interface ModelDownloadStore {
  downloadState: DownloadState;
  progress: number;
  startDownload: () => Promise<void>;
  resetDownload: () => Promise<void>;
}

export const useModelDownloadStore = create<ModelDownloadStore>((set, get) => ({
  downloadState: 'idle',
  progress: 0,

  resetDownload: async () => {
    const { downloadState } = get();

    if (downloadState === 'completed') return;

    set({ downloadState: 'idle', progress: 0 });

    await RNFS.unlink(MODEL_1_PATH).catch(() => {});
    await RNFS.unlink(MODEL_2_PATH).catch(() => {});
    await RNFS.unlink(MODEL_3_PATH).catch(() => {});
    await RNFS.unlink(COMPLETE_FLAG_PATH).catch(() => {});
  },

  startDownload: async () => {
    const { downloadState } = get();
    if (downloadState === 'downloading') return;

    const netState = await NetInfo.fetch();

    if (!netState.isConnected) {
      set({ downloadState: 'error', progress: 0 });
      return;
    }

    if (netState.type !== 'wifi') {
      set({ downloadState: 'idle', progress: 0 });
      return;
    }

    const modelsExist = await checkModelsExist();
    const flagExists = await RNFS.exists(COMPLETE_FLAG_PATH);

    if (modelsExist && flagExists) {
      set({ downloadState: 'completed', progress: 100 });
      return;
    }

    const [m1, m2, m3] = await Promise.all([
      RNFS.exists(MODEL_1_PATH),
      RNFS.exists(MODEL_2_PATH),
      RNFS.exists(MODEL_3_PATH),
    ]);

    const partialExists = m1 || m2 || m3 || flagExists;

    if (partialExists) {
      await RNFS.unlink(MODEL_1_PATH).catch(() => {});
      await RNFS.unlink(MODEL_2_PATH).catch(() => {});
      await RNFS.unlink(MODEL_3_PATH).catch(() => {});
      await RNFS.unlink(COMPLETE_FLAG_PATH).catch(() => {});
    }

    set({ downloadState: 'downloading', progress: 0 });

    try {
      let p1 = 0,
        p2 = 0,
        p3 = 0;

      const updateProgress = () => {
        const total = (p1 + p2 + p3) / 3;
        set({ progress: total });
      };

      await downloadAllModels(
        v => {
          p1 = v;
          updateProgress();
        },
        v => {
          p2 = v;
          updateProgress();
        },
        v => {
          p3 = v;
          updateProgress();
        },
      );

      await RNFS.writeFile(COMPLETE_FLAG_PATH, 'ok');

      set({ downloadState: 'completed', progress: 100 });
    } catch {
      set({ downloadState: 'error' });
    }
  },
}));
