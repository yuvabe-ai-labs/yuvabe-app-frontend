import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, RefreshControl } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchPendingLeaves } from '../../api/profile-api/profileApi';

export default function MentorLeaveListScreen({ navigation }: any) {
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPendingLeaves();
  }, []);

  const loadPendingLeaves = async () => {
    try {
      setLoading(true);
      const res = await fetchPendingLeaves();

      const sorted = res.data.data.sort(
        (a: any, b: any) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      );

      setPendingLeaves(sorted);
    } catch (err: any) {
      console.log('🔥 mentor list error:', err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('MentorApproval', { leaveId: item.id })
      }
      style={{
        backgroundColor: '#ffffff',
        padding: 18,
        borderRadius: 12,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      {/* Leave Type + User */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontWeight: '700', fontSize: 18, color: '#2C3E50' }}>
          {item.leave_type}
        </Text>

        <Text style={{ fontSize: 15, fontWeight: '600', color: '#007AFF' }}>
          {item.user_name}
        </Text>
      </View>

      {/* Dates */}
      <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
        <Ionicons name="calendar-outline" size={18} color="#555" />
        <Text style={{ marginLeft: 6, color: '#555', fontSize: 15 }}>
          {item.from_date} → {item.to_date}
        </Text>
      </View>

      {/* Updated At */}
      <View style={{ marginTop: 6 }}>
        <Text style={{ fontSize: 12, color: 'gray' }}>
          Updated: {item.updated_at?.slice(0, 10)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#F4F6F9' }}>
      <Text
        style={{
          fontWeight: '800',
          fontSize: 24,
          marginBottom: 20,
          color: '#1C1C1E',
        }}
      >
        Pending Leave Requests
      </Text>

      <FlatList
        data={pendingLeaves}
        keyExtractor={(item: any) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadPendingLeaves} />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={{ marginTop: 80, alignItems: 'center' }}>
              <Ionicons name="cloud-offline-outline" size={60} color="gray" />
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
  );
}
