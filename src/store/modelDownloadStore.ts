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
  progress: number; // 0 - 100
  startDownload: () => Promise<void>;
  resetDownload: () => Promise<void>;
}

export const useModelDownloadStore = create<ModelDownloadStore>((set, get) => ({
  downloadState: 'idle',
  progress: 0,

  // 🔄 RESET (only when incomplete)
  resetDownload: async () => {
    const { downloadState } = get();

    // If already completed → do NOT reset
    if (downloadState === 'completed') return;

    set({ downloadState: 'idle', progress: 0 });

    // Remove partial files safely
    await RNFS.unlink(MODEL_1_PATH).catch(() => {});
    await RNFS.unlink(MODEL_2_PATH).catch(() => {});
    await RNFS.unlink(MODEL_3_PATH).catch(() => {});
    await RNFS.unlink(COMPLETE_FLAG_PATH).catch(() => {});
  },

  startDownload: async () => {
    const { downloadState } = get();
    if (downloadState === 'downloading') return;

    // 1️⃣ Check Wi-Fi
    const netState = await NetInfo.fetch();

    if (!netState.isConnected) {
      console.log('❌ No internet — cannot download models.');
      set({ downloadState: 'error', progress: 0 });
      return;
    }

    if (netState.type !== 'wifi') {
      console.log('⚠️ Not on Wi-Fi — skipping model download.');
      set({ downloadState: 'idle', progress: 0 });
      return;
    }

    // 2️⃣ Check if fully ready (models exist + .complete exists)
    const modelsExist = await checkModelsExist();
    const flagExists = await RNFS.exists(COMPLETE_FLAG_PATH);

    if (modelsExist && flagExists) {
      console.log('✅ Models already fully ready. Skipping download.');
      set({ downloadState: 'completed', progress: 100 });
      return;
    }

    // 3️⃣ Detect partial models
    const [m1, m2, m3] = await Promise.all([
      RNFS.exists(MODEL_1_PATH),
      RNFS.exists(MODEL_2_PATH),
      RNFS.exists(MODEL_3_PATH),
    ]);

    const partialExists = m1 || m2 || m3 || flagExists;

    // 4️⃣ If partial/incomplete → clean everything
    if (partialExists) {
      console.log('🧹 Cleaning partial/incomplete model files...');
      await RNFS.unlink(MODEL_1_PATH).catch(() => {});
      await RNFS.unlink(MODEL_2_PATH).catch(() => {});
      await RNFS.unlink(MODEL_3_PATH).catch(() => {});
      await RNFS.unlink(COMPLETE_FLAG_PATH).catch(() => {});
    }

    // 5️⃣ Begin fresh download
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

      // 6️⃣ Mark completion
      await RNFS.writeFile(COMPLETE_FLAG_PATH, 'ok');

      set({ downloadState: 'completed', progress: 100 });
      console.log('🎉 Model download completed successfully!');
    } catch (e) {
      console.log('❌ Download failed', e);
      set({ downloadState: 'error' });
    }
  },
}));
