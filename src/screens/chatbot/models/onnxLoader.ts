import * as ort from 'onnxruntime-react-native';
import { MODEL_1_PATH } from './modelPaths';

export const loadOnnxModel = async () => {
  return await ort.InferenceSession.create(`file://${MODEL_1_PATH}`);
};
