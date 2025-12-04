import Toast from 'react-native-toast-message';

export const showToast = (
  title: string,
  message?: string,
  status: 'success' | 'error' = 'success'
) => {
  Toast.show({
    type: 'customToast',
    text1: title,
    text2: message,
    props: { status }, // 👈 pass status
  });
};

 