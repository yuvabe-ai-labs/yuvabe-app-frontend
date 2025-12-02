import messaging from '@react-native-firebase/messaging';

export async function checkNotificationPermission() {
  const status = await messaging().hasPermission();
  return status === messaging.AuthorizationStatus.AUTHORIZED;
}

export async function requestNotificationPermission() {
  const currentStatus = await messaging().hasPermission();

  if (currentStatus === messaging.AuthorizationStatus.AUTHORIZED) {
    console.log('[v0] Notifications already authorized');
    return true;
  }

  if (currentStatus === messaging.AuthorizationStatus.NOT_DETERMINED) {
    const requestStatus = await messaging().requestPermission();
    console.log('[v0] Permission request status:', requestStatus);
    return requestStatus === messaging.AuthorizationStatus.AUTHORIZED;
  }

  console.log('[v0] Notifications denied by user');
  return false;
}

export async function getDeviceToken() {
  const currentStatus = await messaging().hasPermission();

  // 1) Allowed
  if (currentStatus === messaging.AuthorizationStatus.AUTHORIZED) {
    const token = await messaging().getToken();
    console.log('[v0] Device token retrieved:', token);
    return token;
  }

  // 2) Ask permission only if never asked
  if (currentStatus === messaging.AuthorizationStatus.NOT_DETERMINED) {
    const requestStatus = await messaging().requestPermission();

    if (requestStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      const token = await messaging().getToken();
      console.log('[v0] Device token retrieved after permission:', token);
      return token;
    }

    return null;
  }

  // 3) Denied → don't ask again
  console.log('[v0] Cannot get token - notifications denied');
  return null;
}
