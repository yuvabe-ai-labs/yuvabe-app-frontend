import React, { useEffect } from 'react';
import { AppState, Linking, Platform } from 'react-native';
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
      const { version, apk_download_link, ios_download_link } = await getAppVersion();

      const updateUrl = Platform.OS === 'android'
        ? apk_download_link
        : ios_download_link;
      
      setVersionInfo({
        localVersion: local,
        serverVersion: version.trim(),
        apkUrl: updateUrl,
      });

      if (local !== version.trim()) {
        setForceBlock(true);

        const url = updateUrl;
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
