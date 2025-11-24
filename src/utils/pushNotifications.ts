import messaging from '@react-native-firebase/messaging';

export async function getDeviceToken() {
  try {
    // Request permission
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log('Push permission denied');
      return null;
    }

    // Get token
    const token = await messaging().getToken();

    console.log('🔥 FCM DEVICE TOKEN:', token);

    return token;
  } catch (e) {
    console.log('Error getting FCM token:', e);
    return null;
  }
}
