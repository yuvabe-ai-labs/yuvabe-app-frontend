import React from 'react';
import Toast from 'react-native-toast-message';
import RootNavigator from './src/navigation/RootNavigator';

function App(): React.JSX.Element {
  return (
    <>
      <RootNavigator />
      <Toast />
    </>
  );
}

export default App;
