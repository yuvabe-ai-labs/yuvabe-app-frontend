import { create } from "zustand";
import type { InferenceSession } from "onnxruntime-react-native";

interface ModelSessionState {
  session: InferenceSession | null;
  modelsLoaded: boolean;

  setSession: (s: InferenceSession) => void;
  setModelsLoaded: (v: boolean) => void;
}

export const useModelSessionStore = create<ModelSessionState>((set) => ({
  session: null,
  modelsLoaded: false,

  setSession: (s) => set({ session: s }),
  setModelsLoaded: (v) => set({ modelsLoaded: v }),
}));
