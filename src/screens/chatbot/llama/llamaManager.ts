import * as RNFS from '@dr.pogodin/react-native-fs';
import { initLlama, releaseAllLlama } from "llama.rn";

let llamaContext: any = null;

export async function loadLlama(modelPath: string) {
  try {
    const exists = await RNFS.exists(modelPath);
    if (!exists) throw new Error("Llama model file not found at " + modelPath);

    if (llamaContext) {
      await releaseAllLlama();
      llamaContext = null;
    }

    console.log("🔵 Loading Llama model:", modelPath);

    llamaContext = await initLlama({
      model: modelPath,
      n_ctx: 2048,
      use_mlock: true,
      n_gpu_layers: 0,        // 0 = CPU; increase if you want GPU layers
    });

    console.log("🟢 Llama model loaded successfully");
    return true;
  } catch (err) {
    console.error("❌ Failed to load Llama:", err);
    throw err;
  }
}

export function isLlamaReady() {
  return llamaContext != null;
}

export async function llamaGenerate(prompt: string) {
  if (!llamaContext) throw new Error("Llama model not loaded");

  const stopWords = ["</s>", "<|end|>"];

  const result = await llamaContext.completion(
    {
      prompt,
      n_predict: 512,
      stop: stopWords,
    },
    () => {}
  );

  return result.text.trim();
}
