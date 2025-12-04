import React from 'react';
import CustomAlert from '../components/CustomAlert';
import { useAlertStore } from '../store/useAlertStore';

export default function GlobalAlertProvider({ children }: { children: React.ReactNode }) {
  const alert = useAlertStore();

  return (
    <>
      {children}

      <CustomAlert
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        confirmText={alert.confirmText}
        cancelText={alert.cancelText}
        destructive={alert.destructive}
        onCancel={alert.onCancel}
        onConfirm={alert.onConfirm}
      />
    </>
  );
}
