import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import React, { useEffect } from 'react';
import { AppState, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/components/customToast';
import RootNavigator, { navigationRef } from './src/navigation/RootNavigator';
import { useModelDownloadStore } from './src/store/modelDownloadStore';
import { useNotificationStore } from './src/store/notificationStore';
import { createDefaultChannel } from './src/utils/noificationChannel';
import {
  checkNotificationPermission,
  getDeviceToken,
} from './src/utils/pushNotifications';
import { showToast } from './src/utils/ToastHelper';

function App(): React.JSX.Element {
  const startDownload = useModelDownloadStore(state => state.startDownload);

  // Create High Importance Notification Channel
  useEffect(() => {
    createDefaultChannel();
  }, []);

  // Notification Permission Listener
  useEffect(() => {
    const updatePermission = async () => {
      const enabled = await checkNotificationPermission();
      useNotificationStore.getState().setNotificationEnabled(enabled);
    };
    updatePermission();
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        updatePermission();
      }
    });
    return () => subscription.remove();
  }, []);

  // Start Model Download
  useEffect(() => {
    startDownload();
  }, [startDownload]);

  // Navigation Helper
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

  // FCM LISTENERS
  useEffect(() => {
    getDeviceToken();

    // <CHANGE> HANDLE NOTIFEE NOTIFICATION TAP
    const unsubscribeNotifeeEvent = notifee.onForegroundEvent(
      ({ type, detail }) => {
        if (type === EventType.PRESS) {
          const { notification } = detail;
          const customData = notification?.data;

          if (customData?.type === 'home_alert') {
            (globalThis as any).homeAlert = {
              visible: true,
              message: customData?.message || 'Hello!',
            };
            safeNavigateToHome();
            return;
          }

          if (customData?.screen && customData?.leave_id) {
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
        const { type, screen, leave_id, message } = remoteMessage.data;
        showToast(
          remoteMessage.notification?.title ?? 'Notification',
          remoteMessage.notification?.body ?? '',
        );
        if (type === 'home_alert') {
          (globalThis as any).homeAlert = {
            visible: true,
            message: message || 'Hello!',
          };
          safeNavigateToHome();
          return;
        }
        safeNavigate(String(screen), String(leave_id));
      },
    );

    // <CHANGE> FOREGROUND NOTIFICATION → SHOW BANNER (FIXED)
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      // Use the pre-created channel instead of creating one each time
      await notifee.displayNotification({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        data: remoteMessage.data, // <CHANGE> ADD DATA FOR TAP HANDLING
        android: {
          channelId: 'default',
          importance: AndroidImportance.HIGH,
          pressAction: { id: 'default' },
        },
      });
    });

    // App Opened From Quit State
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
        <RootNavigator />
        <Toast config={toastConfig} />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

export default App;
