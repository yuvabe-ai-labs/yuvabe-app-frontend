import notifee, { AndroidImportance } from '@notifee/react-native';

export async function createDefaultChannel() {
  await notifee.createChannel({
    id: 'default',
    name: 'Default Notifications',
    importance: AndroidImportance.HIGH, 
    sound: 'default',
  });
}
