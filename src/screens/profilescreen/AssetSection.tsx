import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AssetDTO, fetchAssets } from '../../api/profile-api/assetsApi';
import { useLoadingStore } from '../../store/useLoadingStore';
import { styles } from './AssetStyle';

export const ASSET_ICONS: Record<string, string> = {
  laptop: '💻',
  keyboard: '⌨️',
  mouse: '🖱️',
  monitor: '🖥️',
  mobile: '📱',
  headphone: '🎧',
  tablet: '📱',
};

const AssetSection = () => {
  const navigation = useNavigation();

  const [assets, setAssets] = useState<AssetDTO[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [networkError, setNetworkError] = useState(false); 

  const loadAssets = async () => {
    const { showLoading, hideLoading } = useLoadingStore.getState();

    showLoading('assets', 'Loading assets...');
    setNetworkError(false); // reset every load

    try {
      const res = await fetchAssets();
      setAssets(res);
    } catch (e: any) {
      console.log('Failed to load assets:', e);

      const isNetworkError =
        e.message?.toLowerCase().includes('network') ||
        e.code === 'ERR_NETWORK' ||
        (e.response === undefined && e.request); 
      if (isNetworkError) {
        setNetworkError(true);
        setAssets([]);
      }
    } finally {
      hideLoading();
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
          
          <Text style={styles.assetName}>{item.asset_id}</Text>
          <Text style={styles.assetType}>{item.type}</Text>
        </View>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        
        <View
          style={[
            styles.header,
            { flexDirection: 'row', alignItems: 'center' },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeft size={28} color="#000" />
            </TouchableOpacity>

            <Text style={[styles.headerTitle, { marginLeft: 10 }]}>
              My Assets
            </Text>
          </View>
        </View>

        
        {networkError ? (
          <View style={{ marginTop: 40, alignItems: 'center' }}>
            <Text style={styles.empty}>Check your internet connection</Text>
          </View>
        ) : assets.length === 0 ? (
         
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
