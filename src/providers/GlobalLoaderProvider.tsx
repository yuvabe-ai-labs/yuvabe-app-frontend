import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useLoadingStore } from '../store/useLoadingStore';
import { COLORS } from '../utils/theme';

export default function GlobalLoaderProvider({ children }: any) {
  const { loading, loadingMessage } = useLoadingStore();

  return (
    <>
      {children}

      {loading && (
        <View
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#FFFFFF',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
          }}
        >
          <View
            style={{
              padding: 25,
              backgroundColor: '#F4F6F9',
              borderRadius: 12,
              width: 150,
              alignItems: 'center',
            }}
          >
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text
              style={{
                marginTop: 10,
                fontSize: 16,
                color: COLORS.textPrimary,
                textAlign: 'center',
              }}
            >
              {loadingMessage}
            </Text>
          </View>
        </View>
      )}
    </>
  );
}
