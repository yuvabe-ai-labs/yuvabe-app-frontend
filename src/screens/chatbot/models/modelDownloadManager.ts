import RNBackgroundDownloader from 'react-native-background-downloader';
import * as RNFS from '@dr.pogodin/react-native-fs';

type Listener = (progress: number) => void;

let activeTask: any = null;
let progressListeners: Listener[] = [];
let downloadProgress = 0; // global

export const subscribeToProgress = (listener: Listener) => {
  progressListeners.push(listener);
  listener(downloadProgress); // send current value instantly
  return () => {
    progressListeners = progressListeners.filter(l => l !== listener);
  };
};

const updateProgress = (val: number) => {
  downloadProgress = val;
  progressListeners.forEach(l => l(val));
};

export const startModelDownload = async (
  url: string,
  destPath: string,
) => {
  if (activeTask) {
    console.log("Download already in progress");
    return;
  }

  // ensure directory exists
  const folder = destPath.substring(0, destPath.lastIndexOf('/'));
  await RNFS.mkdir(folder);

  activeTask = RNBackgroundDownloader.download({
    id: 'yuvabe-model-download',
    url,
    destination: destPath,
  })
    .begin(expected => {
      console.log(`Expected ${expected} bytes`);
    })
    .progress(percent => {
      updateProgress(percent * 100);
    })
    .done(() => {
      console.log('File downloaded!');
      updateProgress(100);
      activeTask = null;
    })
    .error(error => {
      console.log('Download error:', error);
      activeTask = null;
    });
};

export const isDownloading = () => activeTask !== null;
