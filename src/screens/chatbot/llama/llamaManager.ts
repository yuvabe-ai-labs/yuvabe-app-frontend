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
    n_threads: 4,
    use_mlock: true,
    n_gpu_layers: 0,
    flash_attn: true,
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

  let firstTokenLatency: number | null = null;
  let tokenCount = 0;
  const startTime = Date.now();

  const stopWords = ['</s>', '<|end|>', '<|eot_id|>', '<|end_of_text|>', '<|im_end|>'];

  const result = await llamaContext.completion(
    {
      messages,
      n_predict: 256,
      stop: stopWords,
    },
    (data: any) => {
      tokenCount++;
      if (firstTokenLatency === null) {
        firstTokenLatency = Date.now() - startTime;
        console.log('First token latency:', firstTokenLatency, 'ms');
      }

      onToken(data.token);
    },
  );
  const totalTime = Date.now() - startTime;
  const tps = tokenCount / (totalTime / 1000);

  console.log('LLaMA Benchmark:');
  console.log('Total Time:', totalTime, 'ms');
  console.log('Tokens Per Second:', tps.toFixed(2));
  console.log('Tokens Generated:', tokenCount);
  console.log('First Token Latency:', firstTokenLatency, 'ms');

  return result.text ?? '';
}

// for qwen 
function buildQwenPrompt(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>
): string {
  let prompt = "";

  for (const m of messages) {
    prompt += `<|im_start|>${m.role}\n${m.content}<|im_end|>\n`;
  }

  // Qwen ALWAYS expects assistant tag open before generation
  prompt += `<|im_start|>assistant\n`;

  return prompt;
}

export async function qwenChat(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  onToken: (t: string) => void,
): Promise<string> {
  if (!llamaContext) throw new Error('Qwen model not loaded');

  let firstTokenLatency: number | null = null;
  let tokenCount = 0;
  const startTime = Date.now();

  // Build Qwen-formatted prompt
  const prompt = buildQwenPrompt(messages);

  // Qwen stop token
  const stopWords = ['<|im_end|>'];

  const result = await llamaContext.completion(
    {
      prompt,
      n_predict: 256,
      stop: stopWords,
    },
    (data: any) => {
      if (data?.token) {
        tokenCount++;

        if (firstTokenLatency === null) {
          firstTokenLatency = Date.now() - startTime;
          console.log("Qwen first token latency:", firstTokenLatency, "ms");
        }

        onToken(data.token);
      }
    }
  );

  const totalTime = Date.now() - startTime;
  const tps = tokenCount / (totalTime / 1000);

  console.log("Qwen Benchmark:");
  console.log("Total Time:", totalTime, "ms");
  console.log("Tokens Per Second:", tps.toFixed(2));
  console.log("Tokens Generated:", tokenCount);
  console.log("First Token Latency:", firstTokenLatency, "ms");

  return result.text ?? "";
}
