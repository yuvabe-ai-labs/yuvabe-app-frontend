import { ChevronLeft, CloudOff } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
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

import { useFocusEffect } from '@react-navigation/native';
import { formatDate } from '../leave/LeaveDetailsScreen';

export default function MentorLeaveListScreen({ navigation }: any) {
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPendingLeaves(); // 👉 first load uses GLOBAL LOADING
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPendingLeaves(true); // refresh silently
    }, []),
  );

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
      console.log('Mentor List Error:', err);
    } finally {
      if (!isRefresh) hideLoading();
      if (isRefresh) setRefreshing(false);
    }
  };

  const formatLeaveType = (leaveType: string): string => {
    if (!leaveType) return '';

    const type = leaveType.trim().toLowerCase();

    if (type === 'sick') return 'Sick Leave';
    if (type === 'casual') return 'Casual Leave';

    return leaveType; // fallback
  };

  const badgeColor = (leaveType: string): string => {
    if (!leaveType) return '#6C757D';

    const type = leaveType.trim().toLowerCase();

    if (type === 'sick') return '#C89C00'; // yellow
    if (type === 'casual') return '#005DBD'; // blue

    // fallback if backend returns unexpected value
    return '#6C757D';
  };

  const renderItem = ({ item }: any) => (
    console.log('LEAVE TYPE FROM API:', item.leave_type),
    (
      <View style={{ paddingHorizontal: 16 }}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('MentorApproval', { leaveId: item.id })
        }
        style={{
          backgroundColor: '#FFFFFF',
          padding: 18,
          borderRadius: 12,

          marginBottom: 16,
          borderWidth: 1.6,
          borderColor: '#C9A0FF', // light purple border like screenshot
        }}
      >
        {/* TOP ROW */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontWeight: '700', fontSize: 17, color: '#2C3E50' }}>
            {item.user_name}
          </Text>

          {/* LEAVE TYPE BADGE */}
          <View
            style={{
              backgroundColor: badgeColor(item.leave_type),
              paddingVertical: 4,
              paddingHorizontal: 12,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
              {formatLeaveType(item.leave_type)}
            </Text>
          </View>
        </View>

        {/* DATE RANGE */}
        <View style={{ marginTop: 12 }}>
          <Text style={{ fontSize: 14, color: '#333' }}>
            {formatDate(item.from_date)} ➜ {formatDate(item.to_date)}
          </Text>
        </View>

        {/* NUMBER OF DAYS */}
        <View style={{ marginTop: 12 }}>
          <Text style={{ fontSize: 14, color: '#333' }}>
            Number of Days: {item.days || 0}
          </Text>
        </View>

        {/* REQUEST SENT DATE */}
        <View style={{ marginTop: 6 }}>
          <Text style={{ fontSize: 12, color: 'gray' }}>
            Request sent: {formatDate(item.requested_at?.slice(0, 10))}
          </Text>
        </View>
      </TouchableOpacity>
      </View>
    )
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={{ flex: 1 }}>
        {/* Header */}
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
          {/* LEFT ARROW */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={28} color="#000" />
          </TouchableOpacity>

          {/* CENTER TITLE */}
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              marginLeft: -28, // IMPORTANT: pulls title to perfect center
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: '#000',
              }}
            >
              Pending Leave Requests
            </Text>
          </View>
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
