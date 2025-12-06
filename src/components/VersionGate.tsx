import React, { useEffect } from 'react';
import { AppState, Linking } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { getAppVersion } from '../api/version-api/versionApi';
import { useAlertStore } from '../store/useAlertStore';
import { useVersionStore } from '../store/useVersionStore';

export const VersionGate = ({ children }: any) => {
  const { showAlert } = useAlertStore.getState();
  const { setVersionInfo, setForceBlock } = useVersionStore();

  const checkVersion = async () => {
    try {
      const local = DeviceInfo.getVersion().trim();
      const { version, apk_download_link } = await getAppVersion();

      setVersionInfo({
        localVersion: local,
        serverVersion: version.trim(),
        apkUrl: apk_download_link,
      });

      if (local !== version.trim()) {
        setForceBlock(true);

        const url = apk_download_link;
        showAlert({
          title: 'Update Required',
          onCancel: () => {},
          message: 'Your version is outdated. Please update to continue.',
          confirmText: 'Update',
          onConfirm: () => {
            Linking.openURL(url);
          },
        });
      }
    } catch (err) {
      console.log(`Error on Version Check: ${err}`);
    }
  };

  useEffect(() => {
    checkVersion();

    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        checkVersion();
      }
    });

    return () => sub.remove();
  }, []);

  return <>{children}</>;
};
