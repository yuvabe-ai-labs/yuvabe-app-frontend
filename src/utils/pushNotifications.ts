import messaging from '@react-native-firebase/messaging';

export async function checkNotificationPermission() {
  const status = await messaging().hasPermission();
  return status === messaging.AuthorizationStatus.AUTHORIZED;
}

export async function getDeviceToken() {
  const currentStatus = await messaging().hasPermission();

  // 1) Allowed
  if (currentStatus === messaging.AuthorizationStatus.AUTHORIZED) {
    return await messaging().getToken();
  }

  // 2) Ask permission only if never asked
  if (currentStatus === messaging.AuthorizationStatus.NOT_DETERMINED) {
    const requestStatus = await messaging().requestPermission();

    if (requestStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      return await messaging().getToken();
    }

    return null;
  }

  // 3) Denied → don't ask again
  return null;
}
