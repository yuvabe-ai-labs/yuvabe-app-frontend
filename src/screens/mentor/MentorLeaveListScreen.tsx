import { Calendar, ChevronLeft, CloudOff } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchPendingLeaves } from '../../api/profile-api/profileApi';
import { useLoadingStore } from '../../store/useLoadingStore';

export default function MentorLeaveListScreen({ navigation }: any) {
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPendingLeaves(); // 👉 first load uses GLOBAL LOADING
  }, []);

  const loadPendingLeaves = async (isRefresh = false) => {
    const { showLoading, hideLoading } = useLoadingStore.getState();

    if (!isRefresh) {
      showLoading('pending', 'Loading pending leaves...');
    }

    try {
      const res = await fetchPendingLeaves();

      const sorted = res.data.data.sort(
        (a: any, b: any) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      );

      setPendingLeaves(sorted);
    } catch (err: any) {
      console.log('🔥 mentor list error:', err);
    } finally {
      if (!isRefresh) hideLoading();
      if (isRefresh) setRefreshing(false);
    }
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('MentorApproval', { leaveId: item.id })
      }
      style={{
        backgroundColor: '#F4F6F9',
        padding: 18,
        borderRadius: 12,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontWeight: '700', fontSize: 18, color: '#2C3E50' }}>
          {item.leave_type}
        </Text>

        <Text style={{ fontSize: 15, fontWeight: '600', color: '#007AFF' }}>
          {item.user_name}
        </Text>
      </View>

      <View
        style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}
      >
        <Calendar size={18} color="#555" strokeWidth={2} />

        <Text style={{ marginLeft: 6, color: '#555', fontSize: 15 }}>
          {item.from_date} → {item.to_date}
        </Text>
      </View>

      <View style={{ marginTop: 6 }}>
        <Text style={{ fontSize: 12, color: 'gray' }}>
          Updated: {item.updated_at?.slice(0, 10)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={{ flex: 1, padding: 16 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ padding: 6, marginRight: 10 }}
          >
            <ChevronLeft size={28} color="#000" strokeWidth={2} />
          </TouchableOpacity>

          <Text style={{ fontWeight: '800', fontSize: 18, color: '#1C1C1E' }}>
            Pending Leave Requests
          </Text>
        </View>

        {/* LIST */}
        <FlatList
          data={pendingLeaves}
          keyExtractor={(item: any) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadPendingLeaves(true); // 👉 refresh mode
              }}
            />
          }
          ListEmptyComponent={
            !refreshing && pendingLeaves.length === 0 ? (
              <View
                style={{
                  marginTop: 80,
                  alignItems: 'center',
                }}
              >
                <CloudOff size={60} color="gray" strokeWidth={2} />
                <Text
                  style={{
                    marginTop: 10,
                    fontSize: 16,
                    color: 'gray',
                    textAlign: 'center',
                  }}
                >
                  No pending requests
                </Text>
              </View>
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
}
