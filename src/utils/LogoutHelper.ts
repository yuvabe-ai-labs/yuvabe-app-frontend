import { CommonActions } from '@react-navigation/native';
import { Alert } from 'react-native';
import { logoutDevice } from '../api/profile-api/profileApi';
import { setItem } from '../store/storage';
import { useUserStore } from '../store/useUserStore';

export const logoutUser = (navigation: any) => {
  const { resetUser, setIsLoggedIn, setIsVerified, setLogoutLoading } =
    useUserStore.getState();

  Alert.alert('Logout', 'Are you sure?', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Logout',
      style: 'destructive',
      onPress: () => {
        // 🔥 Force UI update before async code runs
        setTimeout(async () => {
          setLogoutLoading(true);

          try {
            await logoutDevice();
          } catch (e) {
            console.log('Device logout error:', e);
          }

          resetUser();
          setIsLoggedIn(false);
          setIsVerified(false);

          await Promise.all([
            setItem('is_verified', 'false'),
            setItem('pending_email', ''),
            setItem('access_token', ''),
            setItem('refresh_token', ''),
          ]);

          // Stop loading
          setLogoutLoading(false);

          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Auth' }],
            }),
          );
        }, 0);
      },
    },
  ]);
};
