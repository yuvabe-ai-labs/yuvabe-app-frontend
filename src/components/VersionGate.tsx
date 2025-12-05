import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Text, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { getAppVersion } from '../api/version-api/versionApi';
import { useAlertStore } from '../store/useAlertStore';

type GateState = 'loading' | 'allowed' | 'blocked';

const UPDATE_URL = 'https://www.yuvabestudios.com';

export const VersionGate = ({ children }: any) => {
  const [state, setState] = useState<GateState>('loading');
  const { showAlert, hideAlert } = useAlertStore.getState();

  const checkVersion = async () => {
    try {
      const local = DeviceInfo.getVersion();
      const { version: server } = await getAppVersion();
      console.log(`${local.trim()} = ${server.trim()}`);
      if (local.trim() === server.trim()) {
        setState('allowed');
      } else {
        setState('blocked');

        showAlert({
          title: 'Update Required',
          message:
            'Your app version is no longer compatible. Please visit the website to download the latest version.',
          confirmText: 'Visit',
          cancelText: 'Retry',
          onConfirm: () => {
            hideAlert();
            Linking.openURL(UPDATE_URL);
          },
          onCancel: () => {
            hideAlert();
            checkVersion();
          },
        });
      }
    } catch (err: any) {
      setState('blocked');

      showAlert({
        title: 'Version Check Failed',
        message:
          'Unable to verify version. Please retry or visit the website for the latest version.',
        confirmText: 'Visit',
        cancelText: 'Retry',
        onConfirm: () => {
          hideAlert();
          Linking.openURL(UPDATE_URL);
        },
        onCancel: () => {
          hideAlert();
          checkVersion();
        },
      });
    }
  };

  useEffect(() => {
    checkVersion();
  }, []);

  if (state === 'loading') {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="mt-3 text-gray-600">Checking app version...</Text>
      </View>
    );
  }

  if (state === 'blocked') {
    return null;
  }

  return <>{children}</>;
};
