import * as RNFS from '@dr.pogodin/react-native-fs';
import {
  MODEL_1_PATH,
  MODEL_2_PATH,
  MODEL_3_PATH,
  MODEL_URL_1,
  MODEL_URL_2,
  MODEL_URL_3,
} from './modelPaths';

export const checkModelsExist = async () => {
  const e1 = await RNFS.exists(MODEL_1_PATH);
  const e2 = await RNFS.exists(MODEL_2_PATH);
  const e3 = await RNFS.exists(MODEL_3_PATH);

  return e1 && e2 && e3;
};

export const cleanAllModels = async () => {
  await RNFS.unlink(MODEL_1_PATH).catch(() => {});
  await RNFS.unlink(MODEL_2_PATH).catch(() => {});
  await RNFS.unlink(MODEL_3_PATH).catch(() => {});
};

const downloadFile = (url: string, path: string, cb: (p: number) => void) =>
  RNFS.downloadFile({
    fromUrl: url,
    toFile: path,
    progressDivider: 1,
    progress: data => {
      const p = (data.bytesWritten / data.contentLength) * 100;
      cb(p);
    },
  }).promise;

export const downloadAllModels = async (
  setP1: (v: number) => void,
  setP2: (v: number) => void,
  setP3: (v: number) => void,
) => {
  await Promise.all([
    downloadFile(MODEL_URL_1, MODEL_1_PATH, setP1),
    downloadFile(MODEL_URL_2, MODEL_2_PATH, setP2),
    downloadFile(MODEL_URL_3, MODEL_3_PATH, setP3),
  ]);
};
