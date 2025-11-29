import { create } from 'zustand';
import * as RNFS from '@dr.pogodin/react-native-fs';
import { checkModelsExist, downloadAllModels } from '../screens/chatbot/models/modelDownloader';
import { MODEL_1_PATH, MODEL_2_PATH, MODEL_3_PATH } from '../screens/chatbot/models/modelPaths';

type DownloadState = 'idle' | 'downloading' | 'completed' | 'error';

interface ModelDownloadStore {
  downloadState: DownloadState;
  progress: number; // 0 - 100
  startDownload: () => Promise<void>;
  resetDownload: () => void;
}

export const useModelDownloadStore = create<ModelDownloadStore>((set, get) => ({
  downloadState: 'idle',
  progress: 0,

  resetDownload: () => {
    set({
      downloadState: 'idle',
      progress: 0,
    });
  },

  startDownload: async () => {
    const exists = await checkModelsExist();
    if (exists) {
      set({ downloadState: 'completed', progress: 100 });
      return;
    }

    // Delete partial downloads
    try {
      await RNFS.unlink(MODEL_1_PATH).catch(() => {});
      await RNFS.unlink(MODEL_2_PATH).catch(() => {});
      await RNFS.unlink(MODEL_3_PATH).catch(() => {});
    } catch {}

    set({ downloadState: 'downloading', progress: 0 });

    try {
      let p1 = 0, p2 = 0, p3 = 0;

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

      set({ downloadState: 'completed', progress: 100 });
    } catch (e) {
      console.log("Download failed", e);
      set({ downloadState: 'error' });
    }
  },
}));
