import { create } from 'zustand';
import { logWater, updateWaterLog } from '../api/wellbeing/wellBeingApi';

let saveTimer: any;

interface WaterState {
  today: number;
  lastLogId: string | null;

  setToday: (val: number) => void;
  loadToday: (val: number, logId: string | null) => void;
}

export const useWaterStore = create<WaterState>((set, get) => ({
  today: 0,
  lastLogId: null,

  loadToday: (val, logId) => {
    set({ today: val, lastLogId: logId });
  },

  setToday: (val: number) => {
    set({ today: val });

    clearTimeout(saveTimer);

    // 🔥 Debounced DB sync (no race, no stale)
    saveTimer = setTimeout(async () => {
      const { lastLogId } = get();

      try {
        if (lastLogId) {
          await updateWaterLog(lastLogId, val);
        } else {
          const saved = await logWater(val);
          set({ lastLogId: saved.id });
        }
      } catch (err) {
        console.log('DB sync failed', err);
      }
    }, 600);
  },
}));
