import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchTeamLeaveHistory } from '../../api/profile-api/profileApi';
import { useLoadingStore } from '../../store/useLoadingStore';
import { formatDate } from './LeaveDetailsScreen';

type LeaveHistory = {
  user_name: string;
  leave_type: string;
  status: string;
  from_date: string;
  to_date: string;
  days: number;
  reason: string;
  updated_at?: string;
  created_at?: string;
};

export default function TeamLeaveHistoryScreen() {
  const [leaves, setLeaves] = useState<LeaveHistory[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { showLoading, hideLoading } = useLoadingStore.getState();
    showLoading('teamHistory', 'Loading  leave history ');
    try {
      const res = await fetchTeamLeaveHistory();
      const sorted = [...res.data.data].reverse();
      setLeaves(sorted);
    } finally {
      hideLoading();
    }
  };

  const renderItem = ({ item }: any) => (
    <View
      style={{
        backgroundColor: '#F5F5F5',
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
      }}
    >
      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
        {item.user_name} — {item.leave_type} ({item.status})
      </Text>

      <Text>
        {formatDate(item.from_date)} → {formatDate(item.to_date)}
      </Text>
      <Text>Days: {item.days}</Text>
      <Text>Reason: {item.reason}</Text>

      <Text style={{ color: 'gray', marginTop: 8 }}>
        Updated: {formatDate(item.updated_at?.slice(0, 10))}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* ⭐ CUSTOM HEADER */}
      {/* ⭐ CUSTOM HEADER */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 16,
          backgroundColor: '#fff',
        }}
      >
        {/* LEFT: Back + Title */}
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={28} color="#000" />
          </TouchableOpacity>

          <Text
            style={{
              marginLeft: 15,
              fontSize: 18,
              fontWeight: '600',
              color: '#000',
            }}
          >
            Team Leave History
          </Text>
        </View>

        {/* RIGHT: Logo */}
        {/* <Image
          source={require('../../assets/logo/yuvabe-logo.png')}
          style={{
            width: 40,
            height: 40,
            resizeMode: 'contain',
          }}
        /> */}
      </View>

      {/* LIST */}
      <View style={{ padding: 15, flex: 1 }}>
        <FlatList
          data={leaves}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>
    </SafeAreaView>
  );
}
