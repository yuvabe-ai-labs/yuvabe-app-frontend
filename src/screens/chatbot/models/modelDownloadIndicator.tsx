import React from 'react';
import { ActivityIndicator, View,Text } from 'react-native';
import { useModelDownloadStore } from '../../../store/modelDownloadStore';

const ChatDownloadIndicator = () => {
  const { downloadState,progress } = useModelDownloadStore();

  if (downloadState !== 'downloading') return null;
const percent = Math.round(progress);
  return (
    <View
      style={{
        position: 'absolute',
        top: 12,
        right: 60,
        backgroundColor: 'transparent',
        borderRadius: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        zIndex: 999,
      }}
    >
      <ActivityIndicator size="small" color="#5829c7" />
      <Text
        style={{
          marginLeft: 8,
          fontSize: 14,
          color: '#5829c7',
          fontWeight: '600',
        }}
      >
        {percent}%
      </Text>
    </View>
  );
};

export default ChatDownloadIndicator;
