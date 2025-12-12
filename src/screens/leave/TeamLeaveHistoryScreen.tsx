import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchTeamLeaveHistory } from '../../api/profile-api/profileApi';
import { useLoadingStore } from '../../store/useLoadingStore';
import { FONTS } from '../../utils/theme';
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
  const navigation = useNavigation<any>();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { showLoading, hideLoading } = useLoadingStore.getState();
    showLoading('teamHistory', 'Loading  leave history ');
    try {
      const res = await fetchTeamLeaveHistory();
      setLeaves(res.data.data);
    } finally {
      hideLoading();
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Approved':
        return { bg: '#17A42A', color: '#FFFFFF' };
      case 'Cancelled':
        return { bg: '#1C0E96', color: '#FFFFFF' };
      case 'Rejected':
        return { bg: '#FF383C', color: '#FFFFFF' };
      case 'Pending':
      default:
        return { bg: '#F9A91E', color: '#FFFFFF' };
    }
  };

  const renderItem = ({ item }: any) => {
    const status = getStatusStyles(item.status);

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('MentorDetailLeave', { leaveId: item.id })
        }
      >
        <View
          style={{
            backgroundColor: '#fff',
            padding: 16,
            borderRadius: 14,
            borderWidth: 1.4,
            borderColor: '#592AC7',
            marginBottom: 18,
          }}
        >
          {/* NAME + STATUS */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 6,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                fontFamily: FONTS.gilroy.bold,
                color: '#000',
              }}
            >
              {item.user_name}
            </Text>

            <View
              style={{
                backgroundColor: status.bg,
                paddingVertical: 4,
                paddingHorizontal: 12,
                borderRadius: 50,
              }}
            >
              <Text
                style={{
                  color: status.color,
                  fontWeight: '600',
                  fontFamily: FONTS.gilroy.bold,
                }}
              >
                {item.status}
              </Text>
            </View>
          </View>

          {/* LEAVE TYPE */}
          <Text
            style={{
              fontSize: 15,
              fontWeight: '400',
              fontFamily: FONTS.gilroy.bold,
              marginTop: 4,
            }}
          >
            Leave Type:{' '}
            <Text
              style={{ fontWeight: '400', fontFamily: FONTS.gilroy.regular }}
            >
              {item.leave_type} leave
            </Text>
          </Text>

          {/* DATE ROW */}
          <Text
            style={{
              marginTop: 10,
              fontSize: 15,
              fontFamily: FONTS.gilroy.regular,
            }}
          >
            {formatDate(item.from_date)} → {formatDate(item.to_date)}
          </Text>

          {/* DAYS */}
          <Text
            style={{
              marginTop: 6,
              fontSize: 15,
              fontFamily: FONTS.gilroy.regular,
            }}
          >
            Number of Days: {item.days}
          </Text>

          {/* UPDATED ON */}
          <Text
            style={{
              marginTop: 12,
              fontSize: 13,
              fontFamily: FONTS.gilroy.regular,
              color: '#8A8A8A',
            }}
          >
            Updated on: {formatDate(item.updated_at?.slice(0, 10))}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* HEADER */}
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
            Team Leave History
          </Text>
        </View>
      </View>

      {/* LIST */}
      <View style={{ padding: 16, flex: 1 }}>
        <FlatList
          data={leaves}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}
