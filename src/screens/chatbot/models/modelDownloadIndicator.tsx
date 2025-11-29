import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useModelDownloadStore } from '../../../store/modelDownloadStore';

const ChatDownloadIndicator = () => {
  const { downloadState } = useModelDownloadStore();

  if (downloadState !== 'downloading') return null;

  return (
    <View
      style={{
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'transparent',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        zIndex: 999,
      }}
    >
      <ActivityIndicator size="small" color="#5829c7" />
    </View>
  );
};

export default ChatDownloadIndicator;
