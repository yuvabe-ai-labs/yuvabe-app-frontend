import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import { showToast } from '../../utils/ToastHelper';

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
      showToast('Error', 'Unable to load leave details');
    } finally {
      setLoading(false);
    }
  };

  const approveLeave = async () => {
    setSubmitLoading(true);
    try {
      await mentorDecision(leaveId, { status: 'Approved' });
      showToast('Success', 'Leave Approved');
      navigation.goBack();
    } catch (error: any) {
      showToast('Error', error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const rejectLeave = async () => {
    if (!rejectComment.trim()) {
      return showToast('Error', 'Comment required to reject');
    }
    setSubmitLoading(true);
    try {
      await mentorDecision(leaveId, {
        status: 'Rejected',
        comment: rejectComment,
      });
      showToast('Rejected', 'Leave request rejected');
      navigation.goBack();
    } catch (error: any) {
      showToast('Error', error.message);
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
      {/* Page Title */}
      <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 20 }}>
        Leave Approval
      </Text>

      {/* Employee Name */}
      <View>
        <Text style={{ fontSize: 16, color: '#777' }}>Employee</Text>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 2 }}>
          {leave.user_name || 'Unknown User'}
        </Text>
      </View>

      {/* Leave Balance */}
      <View style={{ flexDirection: 'row', marginTop: 25 }}>
        <View
          style={{
            flex: 1,
            padding: 15,
            backgroundColor: '#F0F4F7',
            borderRadius: 12,
          }}
        >
          <Text style={{ fontSize: 15 }}>Sick Remaining</Text>
          <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{sick}</Text>
        </View>

        <View style={{ width: 15 }} />

        <View
          style={{
            flex: 1,
            padding: 15,
            backgroundColor: '#F0F4F7',
            borderRadius: 12,
          }}
        >
          <Text style={{ fontSize: 15 }}>Casual Remaining</Text>
          <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{casual}</Text>
        </View>
      </View>

      {/* Leave Info */}
      <View style={{ marginTop: 30 }}>
        <Text style={{ fontSize: 16, color: '#777' }}>Leave Type</Text>
        <Text style={{ fontSize: 19, fontWeight: 'bold', marginTop: 2 }}>
          {leave.leave_type}
        </Text>

        <Text style={{ fontSize: 16, color: '#777', marginTop: 15 }}>From</Text>
        <Text style={{ fontSize: 18 }}>{leave.from_date}</Text>

        <Text style={{ fontSize: 16, color: '#777', marginTop: 15 }}>To</Text>
        <Text style={{ fontSize: 18 }}>{leave.to_date}</Text>

        <Text style={{ fontSize: 16, color: '#777', marginTop: 15 }}>
          Reason
        </Text>
        <Text style={{ fontSize: 18 }}>{leave.reason}</Text>
      </View>

      {/* Reject Comment */}
      <Text style={{ marginTop: 25, fontSize: 16 }}>Reject Comment</Text>
      <TextInput
        placeholder="Enter reason if rejecting"
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 12,
          borderRadius: 10,
          marginTop: 8,
          fontSize: 16,
        }}
        value={rejectComment}
        onChangeText={setRejectComment}
      />

      {/* Action Buttons */}
      <View style={{ flexDirection: 'row', marginTop: 35 }}>
        {/* APPROVE BUTTON */}
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: submitLoading ? '#6DBF6B' : 'green',
            padding: 16,
            borderRadius: 12,
            marginRight: 10,
            opacity: submitLoading ? 0.7 : 1,
          }}
          disabled={submitLoading}
          onPress={approveLeave}
        >
          <Text
            style={{
              color: '#fff',
              textAlign: 'center',
              fontSize: 18,
              fontWeight: '600',
            }}
          >
            {submitLoading ? 'Approving...' : 'Approve'}
          </Text>
        </TouchableOpacity>

        {/* REJECT BUTTON */}
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: submitLoading ? '#D96666' : 'red',
            padding: 16,
            borderRadius: 12,
            opacity: submitLoading ? 0.7 : 1,
          }}
          disabled={submitLoading}
          onPress={rejectLeave}
        >
          <Text
            style={{
              color: '#fff',
              textAlign: 'center',
              fontSize: 18,
              fontWeight: '600',
            }}
          >
            {submitLoading ? 'Rejecting...' : 'Reject'}
          </Text>
        </TouchableOpacity>
      </View>

      {submitLoading && (
        <ActivityIndicator
          size="large"
          style={{ marginTop: 20 }}
          color="#007AFF"
        />
      )}
    </ScrollView>
  );
}
