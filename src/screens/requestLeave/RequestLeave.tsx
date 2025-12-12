import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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

import { useNavigation } from '@react-navigation/native';

import {
  fetchLeaveBalance,
  requestLeave,
} from '../../api/profile-api/profileApi';

import { ChevronLeft } from 'lucide-react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { showToast } from '../../utils/ToastHelper';
import { newLeaveStyles as styles } from './RequestLeaveStyles';

export default function RequestLeaveScreen() {
  const navigation = useNavigation<any>();

  const [leaveType, setLeaveType] = useState('');

  const [showLeaveType, setShowLeaveType] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(true);

  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  // NEW STATE FOR BALANCE
  const [sickCount, setSickCount] = useState(0);
  const [casualCount, setCasualCount] = useState(0);

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const isSubmitDisabled = !leaveType || !reason.trim();

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
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      setBalanceLoading(true);
      const res = await fetchLeaveBalance();
      const data = res.data.data;

      setSickCount(data.sick_remaining);
      setCasualCount(data.casual_remaining);
    } catch (err) {
      console.log('Balance error:', err);
    } finally {
      setBalanceLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      return showToast('Error', 'Please enter a reason.', 'error');
    }

    if (toDate < fromDate) {
      return showToast(
        'Error',
        '"To date" must be after "From date".',
        'error',
      );
    }

    const mappedType = leaveType === 'Sick Leave' ? 'Sick' : 'Casual';

    const days =
      Math.floor(
        (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24),
      ) + 1;

    const body = {
      leave_type: mappedType,
      from_date: fromDate.toISOString().split('T')[0],
      to_date: toDate.toISOString().split('T')[0],
      days,
      reason,
    };

    try {
      setLoading(true);

      const response = await requestLeave(body);

      showToast('Success', 'Leave request submitted!', 'success');
      console.log('Leave created:', response);

      // Reset form
      setReason('');
      setLeaveType('Sick Leave');
      setFromDate(new Date());
      setToDate(new Date());

      // refresh balance after applying leave
      loadBalance();

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (err: any) {
      const msg = err?.message?.toLowerCase() || '';

      if (msg.includes('network')) {
        showToast(
          'No Internet',
          'Please check your connection and try again.',
          'error',
        );
      } else {
        showToast('Error', err.message || 'Something went wrong.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------
  // UI
  // ---------------------------------------
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={
          keyboardVisible ? (StatusBar.currentHeight ?? 10) : 0
        }
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 30,
              paddingTop: 20,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 30,
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ width: 40, alignItems: 'flex-start' }}
              >
                <ChevronLeft size={28} color="#000" />
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: '#000',
                  textAlign: 'center',
                  flex: 1,
                }}
              >
                Request Leave
              </Text>

              {/* RIGHT: Empty placeholder (same width as left) */}
              <View style={{ width: 40 }} />
            </View>

            {/* RIGHT SECTION: LOGO IN CORNER */}
            {/* <Image
            source={require('../../assets/logo/yuvabe-logo.png')}
            style={{
              width: 40,
              height: 40,
              resizeMode: 'contain',
            }}
          /> */}
          </View>

          {/* Leave Balance */}
          <View style={styles.countContainer}>
            <View style={styles.countCard}>
              <Text style={styles.countLabel}>Sick Leave</Text>
              <Text style={styles.countValue}>
                {balanceLoading ? '--' : sickCount}
              </Text>
              <Text style={styles.countSub}>Remaining</Text>
            </View>

            <View style={styles.countCardCasual}>
              <Text style={styles.countLabel}>Casual Leave</Text>
              <Text style={styles.countValue}>
                {balanceLoading ? '--' : casualCount}
              </Text>
              <Text style={styles.countSub}>Remaining</Text>
            </View>
          </View>

          {/* Leave Type */}
          <Text style={styles.label}>Leave Type</Text>
          <TouchableOpacity
            style={styles.dropdownBox}
            onPress={() => setShowLeaveType(!showLeaveType)}
          >
            <Text
              style={[
                styles.dropdownText,
                { color: leaveType ? '#000' : '#A0A0A0' },
              ]}
            >
              {leaveType || 'Select leave type'}
            </Text>
          </TouchableOpacity>

          {showLeaveType && (
            <View style={styles.dropdownMenu}>
              {['Sick Leave', 'Casual Leave'].map(type => (
                <TouchableOpacity
                  key={type}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setLeaveType(type);
                    setShowLeaveType(false);
                  }}
                >
                  <Text>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Dates */}
          <View style={styles.dateRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>From</Text>
              <TouchableOpacity
                style={styles.dateBox}
                onPress={() => setShowFromPicker(true)}
              >
                <Text>{fromDate.toDateString()}</Text>
              </TouchableOpacity>
            </View>

            <View style={{ width: 15 }} />

            <View style={{ flex: 1 }}>
              <Text style={styles.label}>To</Text>
              <TouchableOpacity
                style={styles.dateBox}
                onPress={() => setShowToPicker(true)}
              >
                <Text>{toDate.toDateString()}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {showFromPicker && (
            <DateTimePicker
              value={fromDate}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={(e, d) => {
                setShowFromPicker(false);
                if (d) setFromDate(d);
              }}
            />
          )}

          {showToPicker && (
            <DateTimePicker
              value={toDate}
              mode="date"
              display="default"
              minimumDate={fromDate}
              onChange={(e, d) => {
                setShowToPicker(false);
                if (d) setToDate(d);
              }}
            />
          )}

          {/* Reason */}
          <Text style={styles.label}>Reason</Text>
          <TextInput
            style={styles.reasonBox}
            multiline
            placeholder="Enter your reason..."
            value={reason}
            onChangeText={setReason}
          />

          {/* Submit Button */}
          <View style={{ marginTop: 50, marginBottom: 20 }}>
            <TouchableOpacity
              disabled={loading || isSubmitDisabled}
              onPress={handleSubmit}
              style={{
                paddingVertical: 16,
                borderRadius: 12,
                backgroundColor: isSubmitDisabled ? '#BDA0FF' : '#592AC7',
                alignItems: 'center',
              }}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text
                  style={{
                    fontSize: 16,
                    color: '#FFFFFF',
                    fontWeight: '600',
                  }}
                >
                  Submit Leave Request
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
