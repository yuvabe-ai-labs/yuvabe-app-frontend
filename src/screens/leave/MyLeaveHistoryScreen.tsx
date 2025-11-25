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

export default function MyLeaveHistoryScreen() {
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
            Alert.alert('Success', 'Leave cancelled');
            load();
          } catch (err: any) {
            Alert.alert('Error', err.response?.data?.detail || 'Failed');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: any) => {
    const leaveDate = new Date(item.from_date);
    const today = new Date();

    const canCancel =
      (item.status === 'Approved' || item.status === 'Pending') &&
      leaveDate > today;

    return (
      <View
        style={{
          backgroundColor: '#fff',
          padding: 15,
          marginVertical: 10,
          borderRadius: 12,
          elevation: 2,
        }}
      >
        {/* HEADER ROW */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 6,
          }}
        >
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
            {item.leave_type} ({item.status})
          </Text>
        </View>

        {/* DETAILS */}
        <Text style={{ marginTop: 2 }}>
          {item.from_date} → {item.to_date}
        </Text>
        <Text style={{ marginTop: 2 }}>Days: {item.days}</Text>
        <Text style={{ marginTop: 2 }}>Mentor: {item.mentor_name || '—'}</Text>

        {/* UPDATED + CANCEL BUTTON SAME ROW */}
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
    );
  };

  // FIRST LOAD LOADING SCREEN
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
