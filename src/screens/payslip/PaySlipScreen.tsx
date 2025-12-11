'use client';

import DateTimePicker from '@react-native-community/datetimepicker';
import { ChevronLeft } from 'lucide-react-native';
import { Linking, TouchableWithoutFeedback } from 'react-native';

import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import {
  getGmailConnectUrl,
  requestPayslip,
  type PayslipRequestPayload,
} from '../../api/payslip/paySlipApi';
import { useUserStore } from '../../store/useUserStore';
import { showToast } from '../../utils/ToastHelper';
import { FONTS } from '../../utils/theme';

export default function PayslipScreen({ navigation }: any) {
  const user = useUserStore(state => state.user);

  const [mode, setMode] = useState<'preset' | 'manual'>('preset');
  const [presetMode, setPresetMode] = useState<'3_months' | '6_months'>(
    '3_months',
  );
  const [fromMonth, setFromMonth] = useState('');
  const [toMonth, setToMonth] = useState('');
  const [loading, setLoading] = useState(false);

  // This is now just for local “info text” and UI,
  // NOT the source of truth for whether Gmail is connected.
  const [gmailConnected, setGmailConnected] = useState(false);
  const [showGmailModal, setShowGmailModal] = useState(false);

  // DATE PICKER STATES
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  // JOIN DATE LOGIC COMES FROM USER STORE
  const rawJoinDate = user?.join_date;

  const joinDate = rawJoinDate
    ? new Date(rawJoinDate) // use actual date
    : new Date(2020, 3, 1); // fallback: 2020 April 1

  useEffect(() => {
    const processUrl = (url: string) => {
      if (!url || !url.includes('gmail/callback')) return;

      // 💡 Add delay so screen is fully mounted
      setTimeout(() => {
        const isSuccess = url.includes('success=true');

        if (isSuccess) {
          showToast('Success', 'Gmail connected successfully!', 'success');
          setGmailConnected(true);
        } else {
          if (url.includes('email_mismatch')) {
            showToast(
              'Error',
              'Oops! That Google email isn’t linked with your current Yuvabe account.',
              'error',
            );
          } else {
            showToast('Error', 'Gmail connection failed', 'error');
          }
        }

        setShowGmailModal(false);
      }, 300); // ⏳ Delay ensures toast ALWAYS appears
    };

    // 1️⃣ When app already open
    const subscription = Linking.addEventListener('url', event => {
      processUrl(event.url);
    });

    // 2️⃣ Cold start or background open
    Linking.getInitialURL().then(url => {
      if (url) processUrl(url);
    });

    return () => subscription.remove();
  }, []);

  // 1️⃣ SAFETY CHECK — user must exist or app will crash
  if (!user) {
    return (
      <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
        <Text style={{ fontSize: 16, color: '#666' }}>
          User data missing. Please login again.
        </Text>
      </View>
    );
  }

  // 2️⃣ VALIDATION FUNCTIONS
  const validateDateInput = (date: string) => {
    // Expected format in UI: MM/YYYY
    const regex = /^(0[1-9]|1[0-2])\/\d{4}$/;
    return regex.test(date);
  };

  const validateDateRange = () => {
    if (mode === 'preset') return true;

    if (!fromMonth || !toMonth) {
      showToast('Error', 'Please enter both from and to dates', 'error');
      return false;
    }

    if (!validateDateInput(fromMonth) || !validateDateInput(toMonth)) {
      showToast('Error', 'Please use MM/YYYY format (e.g., 01/2024)', 'error');
      return false;
    }

    const [fromM, fromY] = fromMonth.split('/').map(Number);
    const [toM, toY] = toMonth.split('/').map(Number);
    const fromDate = new Date(fromY, fromM - 1);
    const toDate = new Date(toY, toM - 1);

    if (fromDate >= toDate) {
      showToast(
        'Invalid Range',
        'Start month must be earlier than end month.',
        'error',
      );
      return false;
    }

    return true;
  };

  const uiToBackendMonth = (value: string): string => {
    const [mm, yyyy] = value.split('/');
    return `${yyyy}-${mm}`;
  };

  const handleConnectGmail = async () => {
    try {
      setLoading(true);
      const res = await getGmailConnectUrl(user.id);
      const url = res.data.auth_url;

      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.open(url, {
          showTitle: true,
          toolbarColor: '#5B21B6',
          showInRecents: true,
        });
      }
    } catch (error: any) {
      console.log('Gmail Error:', error);
      showToast('Error', 'Failed to connect Gmail. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 4️⃣ REQUEST PAYSLIP
  const handleRequestPayslip = async () => {
    // ❌ Do NOT block here based on gmailConnected.
    // Always let backend decide if Gmail is connected or not.

    if (!validateDateRange()) {
      return;
    }

    try {
      setLoading(true);

      let payload: PayslipRequestPayload;

      if (mode === 'preset') {
        payload = {
          mode: presetMode,
        };
      } else {
        payload = {
          mode: 'manual',
          start_month: uiToBackendMonth(fromMonth),
          end_month: uiToBackendMonth(toMonth),
        };
      }

      await requestPayslip(payload);
      showToast(
        'Success',
        'Payslip requested successfully! Check your email.',
        'success',
      );

      // Reset form
      setFromMonth('');
      setToMonth('');
      setPresetMode('3_months');
      setMode('preset');
    } catch (error: any) {
      const detail: string | undefined = error?.response?.data?.detail;

      if (detail && detail.toLowerCase().includes('connect your gmail')) {
        setShowGmailModal(true);

        showToast('Gmail Required', detail, 'error');
      } else {
        const msg = detail || 'Request failed';
        showToast('Error', msg, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // 5️⃣ GET READABLE DATE RANGE
  const getPresetDateRange = (mode: '3_months' | '6_months') => {
    const today = new Date();

    const end = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    let start;
    if (mode === '3_months') {
      start = new Date(end.getFullYear(), end.getMonth() - 2, 1);
    } else {
      start = new Date(end.getFullYear(), end.getMonth() - 5, 1);
    }

    return `${start.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    })} - ${end.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    })}`;
  };

  const getFromDateForMin = () => {
    if (!fromMonth) return joinDate;

    const [mm, yyyy] = fromMonth.split('/').map(Number);
    return new Date(yyyy, mm - 1, 1);
  };

  const handleFromDate = (event: any, selectedDate?: Date) => {
    setShowFromPicker(false);
    if (selectedDate) {
      const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const yyyy = selectedDate.getFullYear();
      setFromMonth(`${mm}/${yyyy}`);
    }
  };

  const handleToDate = (event: any, selectedDate?: Date) => {
    setShowToPicker(false);
    if (selectedDate) {
      const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const yyyy = selectedDate.getFullYear();
      setToMonth(`${mm}/${yyyy}`);
    }
  };
  const isRequestDisabled = () => {
    if (loading) return true;

    if (mode === 'manual') {
      return !fromMonth || !toMonth;
    }

    return false;
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* HEADER */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: 20,
          paddingBottom: 16,
          paddingHorizontal: 16,
          borderBottomWidth: 0,
          backgroundColor: '#FFFFFF',
          justifyContent: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ position: 'absolute', left: 16 }}
        >
          <ChevronLeft size={24} color="#5B21B6" strokeWidth={2} />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 18,
            fontFamily: FONTS.gilroy.bold,
            fontWeight: '700',
            color: '#475569',
          }}
        >
          Request Payslip
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Choose Duration Title */}
        <Text
          style={{
            fontSize: 18,
            fontFamily: FONTS.gilroy.medium,
            fontWeight: '700',
            color: '#1F2937',
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          Choose Duration
        </Text>

        {/* LAST 3 & 6 MONTHS CARDS */}
        <View style={{ gap: 12 }}>
          {[
            {
              value: '3_months',
              label: 'Last 3 Months',
              desc: getPresetDateRange('3_months'),
            },
            {
              value: '6_months',
              label: 'Last 6 Months',
              desc: getPresetDateRange('6_months'),
            },
          ].map(option => (
            <TouchableOpacity
              key={option.value}
              onPress={() => {
                // Switch to preset mode
                setMode('preset');

                // Highlight selected preset
                setPresetMode(option.value as any);

                // Reset custom dates when preset is chosen
                setFromMonth('');
                setToMonth('');
              }}
              style={{
                paddingVertical: 16,
                paddingHorizontal: 14,
                borderRadius: 12,
                backgroundColor:
                  presetMode === option.value ? '#F3E8FF' : '#FFFFFF',
                borderWidth: 1.5,
                borderColor:
                  presetMode === option.value ? '#5B21B6' : '#E5E7EB',
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: FONTS.gilroy.medium,
                  fontWeight: '700',
                  color: presetMode === option.value ? '#5B21B6' : '#1F2937',
                }}
              >
                {option.label}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: FONTS.gilroy.medium,
                  marginTop: 4,
                  color: '#6B7280',
                }}
              >
                {option.desc}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Divider with "or" */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 40,
          }}
        >
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: '#E5E7EB',
            }}
          />
          <Text
            style={{
              marginHorizontal: 12,
              fontSize: 14,
              color: '#6B7280',
              fontWeight: '500',
            }}
          >
            or
          </Text>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: '#E5E7EB',
            }}
          />
        </View>

        {/* CUSTOM DATE TITLE */}
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: '#1F2937',
            marginBottom: 12,
          }}
        >
          Choose custom date
        </Text>

        {/* FROM + TO INPUTS */}
        {/* PARENT ROW FOR BOTH COLUMNS */}
        <View style={{ flexDirection: 'row', gap: 14 }}>
          {/* LEFT COLUMN (FROM) */}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: '#6B7280',
                marginBottom: 6,
              }}
            >
              From
            </Text>

            <TouchableOpacity
              onPress={() => {
                setMode('manual');
                setPresetMode(null as any);
                setShowFromPicker(true);
              }}
              style={{
                borderWidth: 1.5,
                borderColor: '#E5E7EB',
                borderRadius: 10,
                paddingVertical: 14,
                paddingHorizontal: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: fromMonth ? '#1F2937' : '#9CA3AF',
                }}
              >
                {fromMonth || 'Select date'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* RIGHT COLUMN (TO) */}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: '#6B7280',
                marginBottom: 6,
                textAlign: 'left',
              }}
            >
              To
            </Text>

            <TouchableOpacity
              onPress={() => {
                setMode('manual');
                setPresetMode(null as any);
                setShowToPicker(true);
              }}
              style={{
                borderWidth: 1.5,
                borderColor: '#E5E7EB',
                borderRadius: 10,
                paddingVertical: 14,
                paddingHorizontal: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: toMonth ? '#1F2937' : '#9CA3AF',
                }}
              >
                {toMonth || 'Select date'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM BUTTON */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 16,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
        }}
      >
        <TouchableOpacity
          disabled={isRequestDisabled()}
          onPress={handleRequestPayslip}
          style={{
            paddingVertical: 16,
            borderRadius: 12,
            backgroundColor: isRequestDisabled() ? '#BDA0FF' : '#592AC7',
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
              Request Payslip
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* DATE PICKERS + GMAIL MODAL REMAIN EXACTLY SAME */}
      {showFromPicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="calendar"
          minimumDate={joinDate}
          maximumDate={new Date()}
          onChange={handleFromDate}
        />
      )}

      {showToPicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="calendar"
          minimumDate={getFromDateForMin()}
          maximumDate={new Date()}
          onChange={handleToDate}
        />
      )}

      {/* GMAIL CONNECTION MODAL */}
      <Modal
        visible={showGmailModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => !loading && setShowGmailModal(false)}
      >
        {' '}
        <TouchableWithoutFeedback
          onPress={() => {
            if (!loading) setShowGmailModal(false);
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              justifyContent: 'flex-end',
            }}
          >
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 24,
                paddingBottom: 32,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: '#1F2937',
                  marginBottom: 8,
                }}
              >
                Connect Gmail Account
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: '#6B7280',
                  lineHeight: 20,
                  marginBottom: 24,
                }}
              >
                To request payslips, we need to connect your Gmail account.
              </Text>

              <TouchableOpacity
                disabled={loading}
                onPress={handleConnectGmail}
                style={{
                  paddingVertical: 14,
                  borderRadius: 10,
                  backgroundColor: loading ? '#D1D5DB' : '#5B21B6',
                  marginBottom: 10,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 15,
                      fontWeight: '600',
                    }}
                  >
                    Connect Gmail
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                disabled={loading}
                onPress={() => setShowGmailModal(false)}
                style={{
                  paddingVertical: 14,
                  borderRadius: 10,
                  backgroundColor: '#F3F4F6',
                }}
              >
                <Text
                  style={{
                    color: '#4B5563',
                    fontSize: 15,
                    fontWeight: '600',
                    textAlign: 'center',
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
