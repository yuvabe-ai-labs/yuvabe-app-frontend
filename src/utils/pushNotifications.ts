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
    console.log(' Permission request status:', requestStatus);
    return requestStatus === messaging.AuthorizationStatus.AUTHORIZED;
  }

  console.log(' Notifications denied by user');
  return false;
}

export async function getDeviceToken() {
  const currentStatus = await messaging().hasPermission();

  // 1) Allowed
  if (currentStatus === messaging.AuthorizationStatus.AUTHORIZED) {
    const token = await messaging().getToken();
    return token;
  }

  // 2) Ask permission only if never asked
  if (currentStatus === messaging.AuthorizationStatus.NOT_DETERMINED) {
    const requestStatus = await messaging().requestPermission();

    if (requestStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      const token = await messaging().getToken();
      return token;
    }

    return null;
  }

  // 3) Denied → don't ask again
  console.log('Cannot get token - notifications denied');
  return null;
}
