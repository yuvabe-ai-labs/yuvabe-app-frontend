import messaging from '@react-native-firebase/messaging';

export async function checkNotificationPermission() {
  const status = await messaging().hasPermission();
  return status === messaging.AuthorizationStatus.AUTHORIZED;
}

export async function requestNotificationPermission() {
  const currentStatus = await messaging().hasPermission();

  if (currentStatus === messaging.AuthorizationStatus.AUTHORIZED) {
    return true;
  }

  if (currentStatus === messaging.AuthorizationStatus.NOT_DETERMINED) {
    const requestStatus = await messaging().requestPermission();
    return requestStatus === messaging.AuthorizationStatus.AUTHORIZED;
  }
  return false;
}

export async function getDeviceToken() {
  const currentStatus = await messaging().hasPermission();

  if (currentStatus === messaging.AuthorizationStatus.AUTHORIZED) {
    const token = await messaging().getToken();
    return token;
  }

  if (currentStatus === messaging.AuthorizationStatus.NOT_DETERMINED) {
    const requestStatus = await messaging().requestPermission();

    if (requestStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      const token = await messaging().getToken();
      return token;
    }

    return null;
  }

  return null;
}
