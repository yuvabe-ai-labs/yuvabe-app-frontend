import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { getLeaveDetails } from '../../api/profile-api/profileApi';

export default function LeaveDetailsScreen({ route }: any) {
  const { leaveId } = route.params;
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={{ marginTop: 10, color: 'gray' }}>
          Loading leave details...
        </Text>
      </View>
    );
  }

  // Error Screen
  if (!leave) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: 'gray' }}>Leave not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      {/* Heading */}
      <Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 20 }}>
        Leave Details
      </Text>

      {/* CARD */}
      <View
        style={{
          backgroundColor: '#fff',
          padding: 20,
          borderRadius: 15,
          elevation: 3,
        }}
      >
        {/* Leave Type */}
        <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 10 }}>
          Leave Type
        </Text>
        <Text style={{ fontSize: 18, marginTop: 3 }}>{leave.leave_type}</Text>

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
          {leave.from_date} ➜ {leave.to_date}
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
            color:
              leave.status === 'Approved'
                ? 'green'
                : leave.status === 'Rejected'
                ? 'red'
                : leave.status === 'Cancelled'
                ? '#E53935'
                : 'orange',
            fontWeight: 'bold',
          }}
        >
          {leave.status}
        </Text>

        {/* Updated Date */}
        <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 20 }}>
          Updated At
        </Text>
        <Text style={{ fontSize: 18, marginTop: 3 }}>
          {leave.updated_at?.slice(0, 10)}
        </Text>

        {/* Reject Reason */}
        {leave.reject_reason && (
          <>
            <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 20 }}>
              Reject Reason
            </Text>
            <Text style={{ fontSize: 18, marginTop: 3, color: 'red' }}>
              {leave.reject_reason}
            </Text>
          </>
        )}
      </View>
    </ScrollView>
  );
}
