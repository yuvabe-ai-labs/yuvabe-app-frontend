import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useModelDownloadStore } from '../store/modelDownloadStore';

const ModelDownloadIndicator = () => {
  const { downloadState, progress } = useModelDownloadStore();

  if (downloadState !== 'downloading') return null;

  return (
    <View
      style={{
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#00000080',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <ActivityIndicator size="small" color="#fff" />
      <Text style={{ color: '#fff', marginLeft: 6 }}>
        {progress.toFixed(0)}%
      </Text>
    </View>
  );
};

export default ModelDownloadIndicator;
