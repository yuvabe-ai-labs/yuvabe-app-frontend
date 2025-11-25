import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  getLeaveDetails,
  getUserLeaveBalance,
  mentorDecision,
} from '../../api/profile-api/profileApi';

export default function MentorApprovalScreen({ route, navigation }: any) {
  const { leaveId } = route.params;

  const [loading, setLoading] = useState(true);
  const [leave, setLeave] = useState<any>(null);

  const [sick, setSick] = useState(0);
  const [casual, setCasual] = useState(0);

  const [rejectComment, setRejectComment] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await getLeaveDetails(leaveId);
      const data = res.data.data;
      setLeave(data);

      // Load leave balance for that user
      const bal = await getUserLeaveBalance(data.user_id);
      setSick(bal.data.data.sick_remaining);
      setCasual(bal.data.data.casual_remaining);
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Unable to load leave details');
    } finally {
      setLoading(false);
    }
  };

  const approveLeave = async () => {
    setSubmitLoading(true);
    try {
      await mentorDecision(leaveId, { status: 'Approved' });
      Alert.alert('Success', 'Leave Approved');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const rejectLeave = async () => {
    if (!rejectComment.trim()) {
      return Alert.alert('Error', 'Comment required to reject');
    }
    setSubmitLoading(true);
    try {
      await mentorDecision(leaveId, {
        status: 'Rejected',
        comment: rejectComment,
      });
      Alert.alert('Rejected', 'Leave request rejected');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading || !leave) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Leave Approval</Text>

      {/* Leave Balance */}
      <View style={{ flexDirection: 'row', marginTop: 20 }}>
        <View
          style={{
            flex: 1,
            padding: 15,
            backgroundColor: '#eee',
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 16 }}>Sick Remaining</Text>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{sick}</Text>
        </View>

        <View style={{ width: 15 }} />

        <View
          style={{
            flex: 1,
            padding: 15,
            backgroundColor: '#eee',
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 16 }}>Casual Remaining</Text>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{casual}</Text>
        </View>
      </View>

      {/* Leave Info */}
      <View style={{ marginTop: 30 }}>
        <Text style={{ fontSize: 17 }}>Leave Type:</Text>
        <Text style={{ fontSize: 19, fontWeight: 'bold' }}>
          {leave.leave_type}
        </Text>

        <Text style={{ fontSize: 17, marginTop: 10 }}>From:</Text>
        <Text style={{ fontSize: 19 }}>{leave.from_date}</Text>

        <Text style={{ fontSize: 17, marginTop: 10 }}>To:</Text>
        <Text style={{ fontSize: 19 }}>{leave.to_date}</Text>

        <Text style={{ fontSize: 17, marginTop: 10 }}>Reason:</Text>
        <Text style={{ fontSize: 19 }}>{leave.reason}</Text>
      </View>

      {/* Reject Comment */}
      <Text style={{ marginTop: 20 }}>Reject Comment</Text>
      <TextInput
        placeholder="Enter reason if rejecting"
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          borderRadius: 8,
          marginTop: 5,
        }}
        value={rejectComment}
        onChangeText={setRejectComment}
      />

      {/* Buttons */}
      <View style={{ flexDirection: 'row', marginTop: 30 }}>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'green',
            padding: 16,
            borderRadius: 10,
            marginRight: 10,
          }}
          onPress={approveLeave}
          disabled={submitLoading}
        >
          <Text style={{ color: '#fff', textAlign: 'center', fontSize: 17 }}>
            Approve
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'red',
            padding: 16,
            borderRadius: 10,
          }}
          onPress={rejectLeave}
          disabled={submitLoading}
        >
          <Text style={{ color: '#fff', textAlign: 'center', fontSize: 17 }}>
            Reject
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
