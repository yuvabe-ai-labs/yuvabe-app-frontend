import { ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

      const bal = await getUserLeaveBalance(data.user_id);
      setSick(bal.data.data.sick_remaining);
      setCasual(bal.data.data.casual_remaining);
    } catch (err) {
      showToast('Error', 'Unable to load leave details');
      console.log(err);
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

  const toReadableDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' }); // Jan, Feb, Mar
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
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

  // Loading State
  if (loading || !leave) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FBFF' }}>
      {/* 🔵 CUSTOM HEADER */}
      {/* 🔵 CUSTOM HEADER */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 16,
          paddingHorizontal: 15,
          backgroundColor: '#fff',
          borderBottomWidth: 1,
          borderBottomColor: '#E6E6E6',
        }}
      >
        {/* LEFT: Back + Title */}
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ padding: 5 }}
          >
            <ChevronLeft size={28} color="#4A90E2" strokeWidth={2.5} />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              marginLeft: 12,
              color: '#333',
            }}
          >
            Leave Approval
          </Text>
        </View>

        {/* RIGHT: LOGO */}
        <Image
          source={require('../../assets/logo/yuvabe-logo.png')}
          style={{
            width: 40,
            height: 40,
            resizeMode: 'contain',
          }}
        />
      </View>

      {/* CONTENT */}
      <ScrollView style={{ padding: 18 }}>
        {/* Employee Name */}
        <View>
          <Text style={{ fontSize: 15, color: '#777' }}>Employee</Text>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 2 }}>
            {leave.user_name || 'Unknown User'}
          </Text>
        </View>

        {/* Leave Balance */}
        <View style={{ flexDirection: 'row', marginTop: 25 }}>
          <View
            style={{
              flex: 1,
              padding: 18,
              backgroundColor: '#E9F3FF',
              borderRadius: 14,
            }}
          >
            <Text style={{ fontSize: 15 }}>Sick Remaining</Text>
            <Text
              style={{ fontSize: 22, fontWeight: 'bold', color: '#1A73E8' }}
            >
              {sick}
            </Text>
          </View>

          <View style={{ width: 15 }} />

          <View
            style={{
              flex: 1,
              padding: 18,
              backgroundColor: '#FFF3E9',
              borderRadius: 14,
            }}
          >
            <Text style={{ fontSize: 15 }}>Casual Remaining</Text>
            <Text
              style={{ fontSize: 22, fontWeight: 'bold', color: '#E67E22' }}
            >
              {casual}
            </Text>
          </View>
        </View>

        {/* Leave Info */}
        <View style={{ marginTop: 30 }}>
          <Text style={{ fontSize: 16, color: '#777' }}>Leave Type</Text>
          <Text style={{ fontSize: 19, fontWeight: 'bold', marginTop: 3 }}>
            {leave.leave_type}
          </Text>

          <Text style={{ fontSize: 16, color: '#777', marginTop: 15 }}>
            From
          </Text>
          <Text style={{ fontSize: 18 }}>
            {toReadableDate(leave.from_date)}
          </Text>

          <Text style={{ fontSize: 16, color: '#777', marginTop: 15 }}>To</Text>
          <Text style={{ fontSize: 18 }}>{toReadableDate(leave.to_date)}</Text>

          <Text style={{ fontSize: 16, color: '#777', marginTop: 15 }}>
            Reason
          </Text>
          <Text style={{ fontSize: 18 }}>{leave.reason}</Text>
        </View>

        {/* Reject Comment */}
        <Text style={{ marginTop: 30, fontSize: 16, fontWeight: '600' }}>
          Reject Comment
        </Text>
        <TextInput
          placeholder="Enter reason if rejecting"
          style={{
            borderWidth: 1,
            borderColor: '#CFCFCF',
            padding: 14,
            borderRadius: 12,
            marginTop: 10,
            fontSize: 16,
            backgroundColor: '#fff',
          }}
          value={rejectComment}
          onChangeText={setRejectComment}
          multiline
        />

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', marginTop: 35 }}>
          {/* APPROVE BUTTON */}
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: submitLoading ? '#7BC47F' : '#2E8B57',
              padding: 15,
              borderRadius: 12,
              marginRight: 12,
              opacity: submitLoading ? 0.8 : 1,
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
              backgroundColor: submitLoading ? '#F1948A' : '#D94343',
              padding: 15,
              borderRadius: 12,
              opacity: submitLoading ? 0.8 : 1,
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
            color="#4A90E2"
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
