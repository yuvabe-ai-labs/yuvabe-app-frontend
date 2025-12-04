import React from 'react';
import GlobalAlertProvider from './GlobalAlertProvider';
import GlobalLoaderProvider from './GlobalLoaderProvider';

export default function AppProviders({ children }: any) {
  return (
    <GlobalAlertProvider>
      <GlobalLoaderProvider>
        {children}
      </GlobalLoaderProvider>
    </GlobalAlertProvider>
  );
}
