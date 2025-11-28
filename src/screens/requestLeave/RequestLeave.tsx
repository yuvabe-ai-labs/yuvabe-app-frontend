import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
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

import { showToast } from '../../utils/ToastHelper';
import { newLeaveStyles as styles } from './RequestLeaveStyles';

export default function RequestLeaveScreen() {
  const navigation = useNavigation<any>();

  const [leaveType, setLeaveType] = useState('Sick Leave');
  const [showLeaveType, setShowLeaveType] = useState(false);

  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  // NEW STATE FOR BALANCE
  const [sickCount, setSickCount] = useState(0);
  const [casualCount, setCasualCount] = useState(0);

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      const res = await fetchLeaveBalance();
      const data = res.data.data;

      setSickCount(data.sick_remaining);
      setCasualCount(data.casual_remaining);
    } catch (err) {
      console.log('Balance error:', err);
    }
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      return showToast('Error', 'Please enter a reason.');
    }

    if (toDate < fromDate) {
      return showToast('Error', '"To date" must be after "From date".');
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

      showToast('Success', 'Leave request submitted!');
      console.log('Leave created:', response);

      // Reset form
      setReason('');
      setLeaveType('Sick Leave');
      setFromDate(new Date());
      setToDate(new Date());

      // refresh balance after applying leave
      loadBalance();
    } catch (err: any) {
      showToast('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------
  // UI
  // ---------------------------------------
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER WITH CHEVRON + TITLE */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 30,
        }}
      >
        {/* Back Icon */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ paddingRight: 8 }}
        >
          <ChevronLeft size={28} color="#000" />
        </TouchableOpacity>

        {/* Title */}
        <Text
          style={[
            styles.heading,
            {
              textAlign: 'left', // override center
              flex: 0, // prevents taking full width
              marginBottom: 0,
              marginLeft: 30,
              fontSize: 18, // spacing fix
            },
          ]}
        >
          Request Leave
        </Text>
      </View>

      {/* Leave Balance */}
      <View style={styles.countContainer}>
        <View style={styles.countCard}>
          <Text style={styles.countLabel}>Sick Count</Text>
          <Text style={styles.countValue}>{sickCount}</Text>
        </View>

        <View style={styles.countCard}>
          <Text style={styles.countLabel}>Casual Count</Text>
          <Text style={styles.countValue}>{casualCount}</Text>
        </View>
      </View>

      {/* Leave Type */}
      <Text style={styles.label}>Leave Type</Text>
      <TouchableOpacity
        style={styles.dropdownBox}
        onPress={() => setShowLeaveType(!showLeaveType)}
      >
        <Text style={styles.dropdownText}>{leaveType}</Text>
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
          style={styles.btn}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.btnText}>
            {loading ? 'Submitting...' : 'Submit Leave Request'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
