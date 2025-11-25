import messaging from '@react-native-firebase/messaging';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import RootNavigator, { navigationRef } from './src/navigation/RootNavigator';
import { getDeviceToken } from './src/utils/pushNotifications';

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

  function safeNavigateToHome() {
    const tryNav = () => {
      if (navigationRef.current?.isReady()) {
        navigationRef.current.navigate(
          'Root' as any,
          {
            screen: 'Home',
          } as never,
        );
      } else {
        setTimeout(tryNav, 300);
      }
    };
    tryNav();
  }

  useEffect(() => {
    getDeviceToken();

    messaging().onNotificationOpenedApp(remoteMessage => {
      if (!remoteMessage?.data) return;

      const { type, screen, leave_id, message } = remoteMessage.data;

      Toast.show({
        type: 'info',
        text1: remoteMessage.notification?.title,
        text2: remoteMessage.notification?.body,
      });

      if (type === 'home_alert') {
        (globalThis as any).homeAlert = {
          visible: true,
          message: message || 'Hello!',
        };
        safeNavigateToHome();
        return;
      }

      safeNavigate(screen as any, leave_id as any);
    });

    messaging().onMessage(async remoteMessage => {
      const { type, message } = remoteMessage.data || {};

      if (type === 'home_alert') {
        (globalThis as any).homeAlert = {
          visible: true,
          message: message,
        };
      }

      Toast.show({
        type: 'info',
        text1: remoteMessage.notification?.title,
        text2: remoteMessage.notification?.body,
      });
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
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootNavigator />
      <Toast />
    </GestureHandlerRootView>
  );
}

export default App;
