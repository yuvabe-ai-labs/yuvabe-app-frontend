import { ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
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
import { useLoadingStore } from '../../store/useLoadingStore';
import { showToast } from '../../utils/ToastHelper';

export default function MentorApprovalScreen({ route, navigation }: any) {
  const { leaveId } = route.params;

  const [leave, setLeave] = useState<any>(null);
  const [sick, setSick] = useState(0);
  const [casual, setCasual] = useState(0);
  const [rejectComment, setRejectComment] = useState('');

  const { showLoading, hideLoading } = useLoadingStore.getState();

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true),
    );
    const hideSub = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false),
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    const loadData = async () => {
      showLoading('mentorApproval', 'Loading leave details...');
      try {
        const res = await getLeaveDetails(leaveId);
        const data = res.data.data;
        setLeave(data);

        const bal = await getUserLeaveBalance(data.user_id);
        setSick(bal.data.data.sick_remaining);
        setCasual(bal.data.data.casual_remaining);
      } catch (err) {
        console.log(err);
        showToast('Error', 'Unable to load leave details', 'error');
      } finally {
        hideLoading();
      }
    };

    loadData();
  }, []);

  const approveLeave = async () => {
    showLoading('submit', 'Approving...');
    try {
      await mentorDecision(leaveId, { status: 'Approved' });
      showToast('Success', 'Leave Approved', 'success');
      navigation.goBack();
    } catch (err: any) {
      const isNetworkError =
        err.message?.toLowerCase().includes('network') ||
        err.code === 'ERR_NETWORK' ||
        (err.response === undefined && err.request); // <-- best RN check

      if (isNetworkError) {
        showToast(
          'No Internet',
          'Please check your internet connection.',
          'error',
        );
        return;
      }

      showToast(
        'Update failed',
        err.response?.data?.detail || err.message || 'Something went wrong',
        'error',
      );
    } finally {
      hideLoading();
    }
  };

  const rejectLeave = async () => {
    if (!rejectComment.trim()) {
      return showToast('Error', 'Comment required to reject', 'error');
    }

    showLoading('submit', 'Rejecting...');
    try {
      await mentorDecision(leaveId, {
        status: 'Rejected',
        comment: rejectComment,
      });
      showToast('Rejected', 'Leave request rejected', 'error');
      navigation.goBack();
    } catch (err: any) {
      const isNetworkError =
        err.message?.toLowerCase().includes('network') ||
        err.code === 'ERR_NETWORK' ||
        (err.response === undefined && err.request); // <-- best RN check

      if (isNetworkError) {
        showToast(
          'No Internet',
          'Please check your internet connection.',
          'error',
        );
        return;
      }

      showToast(
        'Update failed',
        err.response?.data?.detail || err.message || 'Something went wrong',
        'error',
      );
    } finally {
      hideLoading();
    }
  };

  const toReadableDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // ⚠ NO EARLY RETURN — RENDER EMPTY STATE INSTEAD
  if (!leave) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 18, color: 'gray' }}>
            Loading leave details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // AFTER leave exists → render UI
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        {/* FIXED HEADER */}
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
              Mentor Approval
            </Text>
          </View>
        </View>

        {/* FIXED LEAVE BALANCE BOXES */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 10,
            marginBottom: 30,
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            {/* Sick */}
            <View
              style={{
                flex: 1,
                backgroundColor: '#FFF9E8',
                padding: 20,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#F3D395',
              }}
            >
              <Text
                style={{ textAlign: 'center', fontSize: 16, fontWeight: '600' }}
              >
                Sick Leave
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 26,
                  fontWeight: '800',
                  marginTop: 5,
                }}
              >
                {sick}
              </Text>
              <Text
                style={{ textAlign: 'center', marginTop: 4, color: '#777' }}
              >
                Remaining
              </Text>
            </View>

            <View style={{ width: 14 }} />

            {/* Casual */}
            <View
              style={{
                flex: 1,
                backgroundColor: '#F6F1FF',
                padding: 18,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#C6B7F2',
              }}
            >
              <Text
                style={{ textAlign: 'center', fontSize: 16, fontWeight: '600' }}
              >
                Casual Leave
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 26,
                  fontWeight: '800',
                  marginTop: 5,
                }}
              >
                {casual}
              </Text>
              <Text
                style={{ textAlign: 'center', marginTop: 4, color: '#777' }}
              >
                Remaining
              </Text>
            </View>
          </View>
        </View>

        {/* SCROLLABLE CONTENT */}
        <ScrollView
          style={{ flex: 1, paddingHorizontal: 30, marginTop: 10 }}
          contentContainerStyle={{ paddingBottom: 200 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Details */}
          <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 10 }}>
            Employee Name
          </Text>
          <Text style={{ fontSize: 17, marginTop: 3 }}>{leave.user_name}</Text>

          <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 20 }}>
            Leave Type
          </Text>
          <Text style={{ fontSize: 17, marginTop: 3 }}>{leave.leave_type}</Text>

          <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 20 }}>
            Reason for Leave
          </Text>
          <Text style={{ fontSize: 17, marginTop: 3 }}>{leave.reason}</Text>

          <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 20 }}>
            Leave Date
          </Text>
          <Text style={{ fontSize: 17, marginTop: 3 }}>
            {toReadableDate(leave.from_date)} → {toReadableDate(leave.to_date)}
          </Text>

          <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 20 }}>
            Total Days
          </Text>
          <Text style={{ fontSize: 17, marginTop: 3 }}>
            {leave.days} 
          </Text>

          <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 25 }}>
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
        </ScrollView>

        {/* FIXED BUTTONS ABOVE KEYBOARD */}
        <View
          style={{
            padding: 16,
            flexDirection: 'row',
            backgroundColor: '#FFFFFF',
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: '#2E8B57',
              padding: 15,
              borderRadius: 12,
              marginRight: 10,
            }}
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
              Approve
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: '#D94343',
              padding: 15,
              borderRadius: 12,
            }}
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
              Reject
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
