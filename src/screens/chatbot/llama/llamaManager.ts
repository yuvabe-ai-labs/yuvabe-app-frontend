import * as RNFS from '@dr.pogodin/react-native-fs';
import { initLlama, releaseAllLlama, type LlamaContext } from 'llama.rn';

let llamaContext: LlamaContext | null = null;

export async function loadLlama(modelPath: string): Promise<boolean> {
  const exists = await RNFS.exists(modelPath);
  if (!exists) throw new Error(`Llama model not found at ${modelPath}`);

  if (llamaContext) {
    await releaseAllLlama();
    llamaContext = null;
  }

  llamaContext = await initLlama({
    model: modelPath,
    n_ctx: 2048,
    use_mlock: true,
    n_gpu_layers: 0,
  });

  return true;
}

export function isLlamaReady(): boolean {
  return llamaContext !== null;
}

export async function llamaChat(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  onToken: (t: string) => void,
): Promise<string> {
  if (!llamaContext) throw new Error('Llama model not loaded');

  const stopWords = ['</s>', '<|end|>', '<|eot_id|>', '<|end_of_text|>'];

  const result = await llamaContext.completion(
    {
      messages,
      n_predict: 256,
      stop: stopWords,
    },
    (data: any) => {
      if (data?.token) onToken(data.token);
    },
  );

  return result.text ?? '';
}
