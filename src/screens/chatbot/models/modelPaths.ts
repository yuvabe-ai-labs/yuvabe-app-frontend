import * as RNFS from '@dr.pogodin/react-native-fs';

export const MODEL_URL_1 =
  'https://huggingface.co/onnx-community/embeddinggemma-300m-ONNX/resolve/main/onnx/model.onnx';
export const MODEL_URL_2 =
  'https://huggingface.co/onnx-community/embeddinggemma-300m-ONNX/resolve/main/onnx/model.onnx_data';
export const MODEL_URL_3 =
  'https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF/resolve/main/qwen2.5-1.5b-instruct-q4_0.gguf';
// Llama-3.2-1B-Instruct-Q4_K_S.gguf // Llama-3.2-1B-Instruct-Q5_K_M.gguf // Llama-3.2-1B-Instruct-IQ3_M.gguf https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q2_k.gguf https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-IQ3_M.gguf

export const MODEL_1_PATH = RNFS.DocumentDirectoryPath + '/model.onnx';
export const MODEL_2_PATH = RNFS.DocumentDirectoryPath + '/model.onnx_data';
export const MODEL_3_PATH = RNFS.DocumentDirectoryPath + '/model3.gguf';
export const MODELS_DIR = RNFS.DocumentDirectoryPath; 
export const COMPLETE_FLAG_PATH = `${MODELS_DIR}/.complete`;
