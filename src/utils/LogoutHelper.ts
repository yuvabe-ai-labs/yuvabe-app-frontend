import { CommonActions } from '@react-navigation/native';
import { logoutDevice } from '../api/profile-api/profileApi';
import { setItem } from '../store/storage';
import { useAlertStore } from '../store/useAlertStore';
import { useLoadingStore } from '../store/useLoadingStore';
import { useUserStore } from '../store/useUserStore';

export const logoutUser = (navigation: any) => {
  const { resetUser, setIsLoggedIn, setIsVerified } = useUserStore.getState();

  const { showAlert, hideAlert } = useAlertStore.getState();
  const { showLoading, hideLoading } = useLoadingStore.getState();

  showAlert({
    title: 'Logout',
    message: 'Are you sure?',
    confirmText: 'Logout',
    cancelText: 'Cancel',
    destructive: true,

    onCancel: () => hideAlert(),

    onConfirm: async () => {
      hideAlert();

      // ⭐ GLOBAL LOADING STARTS
      showLoading('logout', 'Logging out...');

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

      // ⭐ GLOBAL LOADING ENDS
      hideLoading();

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Auth' }],
        }),
      );
    },
  });
};
