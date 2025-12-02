import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getLeaveDetails } from '../../api/profile-api/profileApi';

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

export default function LeaveDetailsScreen({ route }: any) {
  const { leaveId } = route.params;
  const navigation = useNavigation<any>();

  const [leave, setLeave] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeave();
  }, []);

  const loadLeave = async () => {
    try {
      const res = await getLeaveDetails(leaveId);
      setLeave(res.data.data);
    } catch (e) {
      console.log('leave error:', e);
    } finally {
      setLoading(false);
    }
  };

  // Loading Screen
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={{ marginTop: 10, color: 'gray' }}>
            Loading leave details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error Screen
  if (!leave) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{ fontSize: 16, color: 'gray' }}>Leave not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={{ flex: 1 }}>
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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1, // takes remaining width but keeps them LEFT
            }}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeft size={28} color="#000" />
            </TouchableOpacity>

            <Text
              style={{
                marginLeft: 12, // space between arrow and title
                fontSize: 18,
                fontWeight: '600',
              }}
            >
              Leave Details
            </Text>
          </View>
          {/* <Image
            source={require('../../assets/logo/yuvabe-logo.png')}
            style={{
              width: 40,
              height: 40,
              resizeMode: 'contain',
            }}
          /> */}
        </View>

        <View style={{ padding: 20 }}>
          <View
            style={{
              backgroundColor: '#F5F5F5',
              padding: 20,
              borderRadius: 15,
            }}
          >
            {/* Leave Type */}
            <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 10 }}>
              Leave Type
            </Text>
            <Text style={{ fontSize: 18, marginTop: 3 }}>
              {leave.leave_type}
            </Text>

            {/* Reason */}
            <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 20 }}>
              Reason
            </Text>
            <Text style={{ fontSize: 18, marginTop: 3 }}>{leave.reason}</Text>

            {/* Dates */}
            <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 20 }}>
              From → To
            </Text>
            <Text style={{ fontSize: 18, marginTop: 3 }}>
              {formatDate(leave.from_date)} ➜ {formatDate(leave.to_date)}
            </Text>

            {/* Days */}
            <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 20 }}>
              Total Days
            </Text>
            <Text style={{ fontSize: 18, marginTop: 3 }}>{leave.days}</Text>

            {/* Status */}
            <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 20 }}>
              Status
            </Text>
            <Text
              style={{
                fontSize: 18,
                marginTop: 3,
                fontWeight: 'bold',
                color:
                  leave.status === 'Approved'
                    ? 'green'
                    : leave.status === 'Rejected'
                    ? 'red'
                    : leave.status === 'Cancelled'
                    ? '#E53935'
                    : 'orange',
              }}
            >
              {leave.status}
            </Text>

            {/* Updated Date */}
            <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 20 }}>
              Updated At
            </Text>
            <Text style={{ fontSize: 18, marginTop: 3 }}>
              {formatDate(leave.updated_at?.slice(0, 10))}
            </Text>

            {/* Reject Reason */}
            {leave.reject_reason && (
              <>
                <Text
                  style={{ fontSize: 16, fontWeight: '600', marginTop: 20 }}
                >
                  Reject Reason
                </Text>
                <Text style={{ fontSize: 18, marginTop: 3, color: 'red' }}>
                  {leave.reject_reason}
                </Text>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
