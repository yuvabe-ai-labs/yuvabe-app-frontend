import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
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

  if (loading)
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  if (!leave)
    return (
      <View style={{ padding: 20 }}>
        <Text>Leave not found</Text>
      </View>
    );

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Leave Details</Text>

      <Text style={{ marginTop: 15, fontSize: 16 }}>Leave Type</Text>
      <Text style={{ fontSize: 18 }}>{leave.leave_type}</Text>

      <Text style={{ marginTop: 15, fontSize: 16 }}>Reason</Text>
      <Text style={{ fontSize: 18 }}>{leave.reason}</Text>

      <Text style={{ marginTop: 15, fontSize: 16 }}>From → To</Text>
      <Text style={{ fontSize: 18 }}>
        {leave.from_date} ➜ {leave.to_date}
      </Text>

      <Text style={{ marginTop: 15, fontSize: 16 }}>Days</Text>
      <Text style={{ fontSize: 18 }}>{leave.days}</Text>

      <Text style={{ marginTop: 15, fontSize: 16 }}>Status</Text>
      <Text style={{ fontSize: 18 }}>{leave.status}</Text>
    </View>
  );
}
