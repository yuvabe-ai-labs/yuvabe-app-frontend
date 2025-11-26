import messaging from '@react-native-firebase/messaging';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/components/customToast';
import RootNavigator, { navigationRef } from './src/navigation/RootNavigator';
import { getDeviceToken } from './src/utils/pushNotifications';
import { showToast } from './src/utils/ToastHelper';

function App(): React.JSX.Element {
  function safeNavigate(screen: string, leaveId: string) {
    const tryNav = () => {
      if (navigationRef.current?.isReady()) {
        console.log('📌 Navigating to:', screen);
        navigationRef.current.navigate(screen as any, { leaveId } as never);
      } else {
        console.log('⏳ Navigation not ready. Retrying...');
        setTimeout(tryNav, 300);
      }
    };

    tryNav();
  }

  useEffect(() => {
    getDeviceToken();

    // 🔥 APP IN BACKGROUND
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (!remoteMessage?.data) return;

      const { screen, leave_id } = remoteMessage.data;

      showToast(
        remoteMessage.notification?.title ?? 'Notification',
        remoteMessage.notification?.body ?? '',
      );

      safeNavigate(screen as any, leave_id as any);
    });

    // APP IS OPEN (FOREGROUND)
    messaging().onMessage(async remoteMessage => {
      console.log('🔥 Foreground Notification:', remoteMessage);

      showToast(
        remoteMessage.notification?.title ?? 'Notification',
        remoteMessage.notification?.body ?? '',
      );
    });

    // 🔥 APP KILLED (QUIT)
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (!remoteMessage?.data) return;

        const { screen, leave_id } = remoteMessage.data;

        // delay to wait for navigator to mount
        setTimeout(() => {
          safeNavigate(screen as any, leave_id as any);
        }, 500);
      });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootNavigator />
      <Toast config={toastConfig} />
    </GestureHandlerRootView>
  );
}

export default App;
