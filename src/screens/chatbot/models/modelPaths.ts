import * as RNFS from '@dr.pogodin/react-native-fs';

export const MODEL_URL_1 =
  'https://huggingface.co/onnx-community/embeddinggemma-300m-ONNX/resolve/main/onnx/model.onnx';
export const MODEL_URL_2 =
  'https://huggingface.co/onnx-community/embeddinggemma-300m-ONNX/resolve/main/onnx/model.onnx_data';
export const MODEL_URL_3 =
  'https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q5_K_M.gguf';

export const MODEL_1_PATH = RNFS.DocumentDirectoryPath + '/model.onnx';
export const MODEL_2_PATH = RNFS.DocumentDirectoryPath + '/model.onnx_data';
export const MODEL_3_PATH = RNFS.DocumentDirectoryPath + '/model3.gguf';
