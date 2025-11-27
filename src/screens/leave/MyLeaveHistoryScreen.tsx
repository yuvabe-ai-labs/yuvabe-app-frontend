import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  cancelLeave,
  fetchMyLeaveHistory,
} from '../../api/profile-api/profileApi';
import { showToast } from '../../utils/ToastHelper';

export default function MyLeaveHistoryScreen() {
  const navigation = useNavigation<any>();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await fetchMyLeaveHistory();
      setLeaves(res.data.data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  // Cancel leave handler
  const handleCancel = (leave: any) => {
    Alert.alert('Cancel Leave', 'Are you sure?', [
      { text: 'No' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          try {
            await cancelLeave(leave.id);
            showToast('Success', 'Leave cancelled');
            load();
          } catch (err: any) {
            showToast('Error', err.response?.data?.detail || 'Failed');
          }
        },
      },
    ]);
  };

  // Render Leave Card
  const renderItem = ({ item }: any) => {
    const leaveDate = new Date(item.from_date);
    const today = new Date();

    const canCancel =
      (item.status === 'Approved' || item.status === 'Pending') &&
      leaveDate > today;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('LeaveDetails', { leaveId: item.id })
        }
      >
        <View
          style={{
            backgroundColor: '#fff',
            padding: 15,
            marginVertical: 10,
            borderRadius: 12,
          }}
        >
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
            {item.leave_type} ({item.status})
          </Text>

          <Text style={{ marginTop: 4 }}>
            {item.from_date} → {item.to_date}
          </Text>

          <Text style={{ marginTop: 2 }}>Days: {item.days}</Text>
          <Text style={{ marginTop: 2 }}>
            Mentor: {item.mentor_name || '—'}
          </Text>

          {/* FOOTER */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 12,
            }}
          >
            <Text style={{ color: 'gray', fontSize: 13 }}>
              Updated: {item.updated_at?.slice(0, 10)}
            </Text>

            {canCancel && (
              <TouchableOpacity
                onPress={() => handleCancel(item)}
                style={{
                  backgroundColor: '#E53935',
                  paddingVertical: 6,
                  paddingHorizontal: 14,
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 13,
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // FIRST LOAD LOADING
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={{ marginTop: 10, color: 'gray' }}>
          Loading your leave history...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 15 }}>
      <FlatList
        data={leaves}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 40, color: 'gray' }}>
            No leave history found
          </Text>
        }
      />
    </View>
  );
}
