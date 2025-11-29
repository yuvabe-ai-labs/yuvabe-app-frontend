import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState<AssetDTO[]>([]);
  const [refreshing, setRefreshing] = useState(false);

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

  const refreshAssets = useCallback(async () => {
    setRefreshing(true);
    await loadAssets();
    setRefreshing(false);
  }, []);

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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {/* ⭐ CUSTOM HEADER */}
        <View
          style={[
            styles.header,
            { flexDirection: 'row', alignItems: 'center' },
          ]}
        >
          {/* LEFT SIDE: Back button + Title */}
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeft size={28} color="#000" />
            </TouchableOpacity>

            <Text style={[styles.headerTitle, { marginLeft: 10 }]}>
              My Assets
            </Text>
          </View>

          {/* RIGHT SIDE: Logo in corner */}
          <Image
            source={require('../../assets/logo/yuvabe-logo.png')}
            style={{
              width: 40,
              height: 40,
              resizeMode: 'contain',
            }}
          />
        </View>

        {/* ⭐ IF NO ASSETS SHOW MESSAGE */}
        {assets.length === 0 ? (
          <FlatList
            data={[]}
            renderItem={() => null}
            ListEmptyComponent={
              <Text style={styles.empty}>No assets assigned</Text>
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refreshAssets}
              />
            }
          />
        ) : (
          <FlatList
            data={assets}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refreshAssets}
              />
            }
            contentContainerStyle={{ paddingBottom: 50, paddingTop: 30 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default AssetSection;
