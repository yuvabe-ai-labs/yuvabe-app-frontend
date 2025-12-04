'use client';

import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import type React from 'react';
import { useEffect } from 'react';
import { AppState, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/components/CustomToast';
import RootNavigator, { navigationRef } from './src/navigation/RootNavigator';
import AppProviders from './src/providers/AppProviders';
import { useModelDownloadStore } from './src/store/modelDownloadStore';
import { useNotificationStore } from './src/store/notificationStore';
import { createDefaultChannel } from './src/utils/noificationChannel';
import {
  checkNotificationPermission,
  getDeviceToken,
  requestNotificationPermission,
} from './src/utils/pushNotifications';
import { showToast } from './src/utils/ToastHelper';

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS) {
    const data = detail.notification?.data;
    console.log('[v0] Notification pressed (background):', data);

    if (!data) return;

    if (data.type === 'home_alert') {
      (globalThis as any).homeAlert = {
        visible: true,
        message: data.message || '',
      };
      return;
    }

    if (data.screen && data.leave_id) {
      navigationRef.current?.navigate(String(data.screen), {
        leaveId: String(data.leave_id),
      });
    }
  }
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('[v0] Background message received:', remoteMessage);

  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Notifications',
    importance: AndroidImportance.HIGH,
  });

  await notifee.displayNotification({
    title: String(remoteMessage.data?.title),
    body: String(remoteMessage.data?.body),
    data: remoteMessage.data,
    android: {
      channelId,
      importance: AndroidImportance.HIGH,
      smallIcon: 'ic_stat_yuvabe',
      largeIcon: require('../yuvabe-app-frontend/src/assets/logo/yuvabe-logo.png'),
      pressAction: { id: 'default' }, // FIXED
    },
  });
});

function App(): React.JSX.Element {
  const startDownload = useModelDownloadStore(state => state.startDownload);

  useEffect(() => {
    const initializeNotifee = async () => {
      try {
        await createDefaultChannel();
        await requestNotificationPermission();
      } catch (error) {
        console.error('[v0] Failed to initialize notifications:', error);
      }
    };
    initializeNotifee();
  }, []);

  useEffect(() => {
    const updatePermission = async () => {
      const enabled = await checkNotificationPermission();
      useNotificationStore.getState().setNotificationEnabled(enabled);
    };
    updatePermission();
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') updatePermission();
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    startDownload();
  }, [startDownload]);

  function safeNavigate(screen: string, leaveId: string) {
    const tryNav = () => {
      if (navigationRef.current?.isReady()) {
        navigationRef.current.navigate(screen as any, { leaveId } as never);
      } else {
        setTimeout(tryNav, 300);
      }
    };
    tryNav();
  }

  function safeNavigateToHome() {
    const tryNav = () => {
      if (navigationRef.current?.isReady()) {
        navigationRef.current.navigate(
          'Root' as any,
          { screen: 'Home' } as never,
        );
      } else {
        setTimeout(tryNav, 300);
      }
    };
    tryNav();
  }

  useEffect(() => {
    // Device token
    getDeviceToken().then(token => {
      console.log('[v0] Device token:', token);
    });

    const unsubscribeNotifeeEvent = notifee.onForegroundEvent(
      ({ type, detail }) => {
        if (type === EventType.PRESS) {
          const customData = detail.notification?.data;
          if (!customData) return;

          // Home alert
          if (customData.type === 'home_alert') {
            (globalThis as any).homeAlert = {
              visible: true,
              message: customData.message || 'Hello!',
            };
            safeNavigateToHome();
            return;
          }

          // Other navigation
          if (customData.screen && customData.leave_id) {
            safeNavigate(
              String(customData.screen),
              String(customData.leave_id),
            );
          }
        }
      },
    );

    const unsubscribeBackground = messaging().onNotificationOpenedApp(
      remoteMessage => {
        if (!remoteMessage?.data) return;
        const { screen, leave_id } = remoteMessage.data;

        showToast(
          String(remoteMessage.data?.title),
          String(remoteMessage.data?.body),
          remoteMessage.data?.status === 'error' ? 'error' : 'success',
        );

        if (screen && leave_id) safeNavigate(String(screen), String(leave_id));
      },
    );

    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      try {
        await notifee.displayNotification({
          title: String(remoteMessage.data?.title),
          body: String(remoteMessage.data?.body),
          data: remoteMessage.data,
          android: {
            channelId: 'default',
            importance: AndroidImportance.HIGH,
            smallIcon: 'ic_stat_yuvabe',
            largeIcon: require('../yuvabe-app-frontend/src/assets/logo/yuvabe-logo.png'),
            pressAction: { id: 'default' }, // FIXED
          },
        });
      } catch (error) {
        console.error('[v0] Failed to display notification:', error);
      }
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (!remoteMessage?.data) return;
        const { type, screen, leave_id, message } = remoteMessage.data;

        setTimeout(() => {
          if (type === 'home_alert') {
            (globalThis as any).homeAlert = {
              visible: true,
              message: message || 'Hello!',
            };
            safeNavigateToHome();
            return;
          }
          safeNavigate(screen as any, leave_id as any);
        }, 500);
      });

    return () => {
      unsubscribeNotifeeEvent();
      unsubscribeBackground();
      unsubscribeForeground();
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppProviders>
          <RootNavigator />
          <Toast config={toastConfig} />
        </AppProviders>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

export default App;
