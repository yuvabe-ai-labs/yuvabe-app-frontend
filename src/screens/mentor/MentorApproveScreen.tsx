import { ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FBFF' }}>
      {/* HEADER */}
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
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ padding: 5 }}
          >
            <ChevronLeft size={28} color="#000" />
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

        <Image
          source={require('../../assets/logo/yuvabe-logo.png')}
          style={{
            width: 40,
            height: 40,
            resizeMode: 'contain',
          }}
        />
      </View>

      {/* BODY */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={
          keyboardVisible ? (StatusBar.currentHeight ?? 80) : 0
        }
      >
        <ScrollView
          style={{ padding: 18 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Employee info */}
          <View>
            <Text style={{ fontSize: 15, color: '#777' }}>Employee</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 2 }}>
              {leave.user_name}
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

            <Text style={{ fontSize: 16, color: '#777', marginTop: 15 }}>
              To
            </Text>
            <Text style={{ fontSize: 18 }}>
              {toReadableDate(leave.to_date)}
            </Text>

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

          {/* Buttons */}
          <View style={{ flexDirection: 'row', marginTop: 35 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: '#2E8B57',
                padding: 15,
                borderRadius: 12,
                marginRight: 12,
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
