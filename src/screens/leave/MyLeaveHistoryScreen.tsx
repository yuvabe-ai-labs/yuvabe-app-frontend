import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  cancelLeave,
  fetchMyLeaveHistory,
} from '../../api/profile-api/profileApi';
import { showToast } from '../../utils/ToastHelper';
import { formatDate } from './LeaveDetailsScreen';

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
            backgroundColor: '#F5F5F5',
            padding: 15,
            marginVertical: 10,
            borderRadius: 12,
          }}
        >
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
            {item.leave_type} ({item.status})
          </Text>

          <Text style={{ marginTop: 4 }}>
            {formatDate(item.from_date)} → {formatDate(item.to_date)}
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

  // FIRST LOAD LOADING UI
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
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {/* ⭐ CUSTOM HEADER */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 14,
            paddingHorizontal: 16,
            backgroundColor: '#fff',
            marginBottom: 10,
          }}
        >
          {/* LEFT SIDE: Arrow + Title */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeft size={28} color="#000" />
            </TouchableOpacity>

            <Text
              style={{
                marginLeft: 15, // 👈 spacing between arrow & title
                fontSize: 18,
                fontWeight: '600',
              }}
            >
              My Leave History
            </Text>
          </View>

          {/* RIGHT SIDE: LOGO */}
          <Image
            source={require('../../assets/logo/yuvabe-logo.png')}
            style={{
              width: 40,
              height: 40,
              resizeMode: 'contain',
            }}
          />
        </View>

        {/* LIST */}
        <View style={{ flex: 1, paddingHorizontal: 15 }}>
          <FlatList
            data={leaves}
            renderItem={renderItem}
            keyExtractor={(item: any) => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <Text
                style={{ textAlign: 'center', marginTop: 40, color: 'gray' }}
              >
                No leave history found
              </Text>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
