import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getLeaveDetails } from '../../api/profile-api/profileApi';
import { useLoadingStore } from '../../store/useLoadingStore';
import { FONTS } from '../../utils/theme';

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

export default function MentorDetailLeaveScreen({ route }: any) {
  const { leaveId } = route.params;
  const navigation = useNavigation<any>();

  const [leave, setLeave] = useState<any>(null);

  useEffect(() => {
    loadLeave();
  }, []);

  const loadLeave = async () => {
    const { showLoading, hideLoading } = useLoadingStore.getState();
    showLoading('details', 'Loading  leave details ');
    try {
      const res = await getLeaveDetails(leaveId);
      setLeave(res.data.data);
    } catch (e) {
      console.log('Leave Error:', e);
    } finally {
      hideLoading();
    }
  };

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
        {/* HEADER */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 14,
            paddingHorizontal: 16,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={28} color="#000" />
          </TouchableOpacity>

          <View
            style={{
              flex: 1,
              alignItems: 'center',
              marginLeft: -28,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: '#000',
              }}
            >
              Leave Details
            </Text>
          </View>
        </View>

        <View style={{ padding: 20 }}>
          <View
            style={{
              backgroundColor: '#F5F5F5',
              padding: 20,
              borderRadius: 15,
              borderWidth: 1,
              borderColor: '#592AC7',
            }}
          >
            {/* EMPLOYEE NAME (NEW FIELD) */}
            <Text style={{ fontSize: 16, fontWeight: '600',fontFamily: FONTS.gilroy.bold }}>
              Employee Name
            </Text>
            <Text style={{ fontSize: 18, marginTop: 3,fontFamily: FONTS.gilroy.regular }}>
              {leave.user_name}
            </Text>

            {/* Leave Type */}
            <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 20,fontFamily: FONTS.gilroy.bold }}>
              Leave Type
            </Text>
            <Text style={{ fontSize: 18, marginTop: 3,fontFamily: FONTS.gilroy.regular }}>
              {leave.leave_type}
            </Text>

            {/* Reason */}
            <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 20 ,fontFamily: FONTS.gilroy.bold}}>
              Reason for Leave
            </Text>
            <Text style={{ fontSize: 18, marginTop: 3,fontFamily: FONTS.gilroy.regular }}>{leave.reason}</Text>

            {/* Dates */}
            <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 20 ,fontFamily: FONTS.gilroy.bold}}>
              From → To
            </Text>
            <Text style={{ fontSize: 18, marginTop: 3,fontFamily: FONTS.gilroy.regular }}>
              {formatDate(leave.from_date)} ➜ {formatDate(leave.to_date)}
            </Text>

            {/* Days */}
            <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 20 ,fontFamily: FONTS.gilroy.bold}}>
              Total Days
            </Text>
            <Text style={{ fontSize: 18, marginTop: 3 ,fontFamily: FONTS.gilroy.regular}}>{leave.days}</Text>

            {/* Status */}
            <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 20,fontFamily: FONTS.gilroy.bold }}>
              Status
            </Text>
            <Text
              style={{
                fontSize: 18,
                marginTop: 3,
                fontFamily: FONTS.gilroy.bold,
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
            <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 20 ,fontFamily: FONTS.gilroy.bold}}>
              Updated At
            </Text>
            <Text style={{ fontSize: 14, marginTop: 3,fontFamily: FONTS.gilroy.regular }}>
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
