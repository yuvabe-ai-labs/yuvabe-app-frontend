import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { AssetDTO, fetchAssets } from '../../api/profile-api/assetsApi';
import { styles } from './AssetStyle';

export const ASSET_ICONS: Record<string, string> = {
  laptop: '💻',
  keyboard: '⌨️',
  mouse: '🖱️',
  monitor: '🖥️',
  mobile: '📱',
  headset: '🎧',
  tablet: '📱',
};

const AssetSection = () => {
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState<AssetDTO[]>([]);

  const loadAssets = async () => {
    try {
      const res = await fetchAssets();
      setAssets(res);
    } catch (e) {
      console.error('Failed to load assets', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const renderItem = ({ item }: { item: AssetDTO }) => {
    const icon = ASSET_ICONS[item.type.toLowerCase()] || '📦';

    return (
      <View style={styles.assetCard}>
        <Text style={styles.assetIcon}>{icon}</Text>

        <View style={{ flex: 1 }}>
          <Text style={styles.assetName}>{item.name}</Text>
          <Text style={styles.assetType}>{item.type}</Text>
        </View>

        <View style={[styles.statusBadge]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    );
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

  if (assets.length === 0)
    return <Text style={styles.empty}>No assets assigned</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={assets}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        scrollEnabled={false}
      />
    </View>
  );
};

export default AssetSection;