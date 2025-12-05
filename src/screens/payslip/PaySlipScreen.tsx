'use client';

import { ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
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
      showToast('Error', '"From" date must be before "To" date', 'error');
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
        // After successful OAuth flow (user comes back to app)
        setGmailConnected(true);
        setShowGmailModal(false);
        showToast('Success', 'Gmail connected!', 'success');
      }
    } catch (error: any) {
      console.log('Gmail Error:', error.response?.data);
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
  const getPresetDateRange = () => {
    const now = new Date();
    if (presetMode === '3_months') {
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      return `${threeMonthsAgo.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })} - ${now.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })}`;
    } else {
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
      return `${sixMonthsAgo.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })} - ${now.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })}`;
    }
  };

  // 🔻 UI BELOW IS EXACTLY YOURS (unchanged JSX)

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* HEADER */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: 20,
          paddingHorizontal: 16,
          paddingBottom: 24,
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 0,
          borderBottomColor: '#E9E5FF',
        }}
      >
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <ChevronLeft size={24} color="#5B21B6" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 24,
            fontWeight: '700',
            color: '#1F2937',
            marginLeft: 12,
          }}
        >
          Request Payslip
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1, padding: 16 }}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* MODE SELECTION CARD */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: '#E9E5FF',
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: '#6B7280',
              marginBottom: 12,
            }}
          >
            Select Period Type
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {[
              { id: 'preset', label: 'Preset Range' },
              { id: 'manual', label: 'Custom Range' },
            ].map(option => (
              <TouchableOpacity
                key={option.id}
                onPress={() => setMode(option.id as any)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: mode === option.id ? '#5B21B6' : '#F3F4F6',
                  borderWidth: 1.5,
                  borderColor: mode === option.id ? '#5B21B6' : '#E5E7EB',
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 13,
                    fontWeight: '600',
                    color: mode === option.id ? '#FFFFFF' : '#4B5563',
                  }}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* PRESET MODE - 3/6 MONTHS */}
        {mode === 'preset' && (
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: '#E9E5FF',
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: '#6B7280',
                marginBottom: 12,
              }}
            >
              Choose Duration
            </Text>
            <View style={{ gap: 10 }}>
              {[
                {
                  value: '3_months',
                  label: 'Last 3 Months',
                  desc: getPresetDateRange(),
                },
                {
                  value: '6_months',
                  label: 'Last 6 Months',
                  desc: getPresetDateRange(),
                },
              ].map(option => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setPresetMode(option.value as any)}
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 14,
                    borderRadius: 10,
                    backgroundColor:
                      presetMode === option.value ? '#F3E8FF' : '#F9FAFB',
                    borderWidth: 2,
                    borderColor:
                      presetMode === option.value ? '#5B21B6' : '#E5E7EB',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color:
                        presetMode === option.value ? '#5B21B6' : '#1F2937',
                    }}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#6B7280',
                      marginTop: 4,
                    }}
                  >
                    {option.desc}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* MANUAL MODE - CUSTOM DATE RANGE */}
        {mode === 'manual' && (
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: '#E9E5FF',
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: '#6B7280',
                marginBottom: 12,
              }}
            >
              Enter Date Range
            </Text>
            <Text style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 12 }}>
              Format: MM/YYYY (e.g., 01/2024)
            </Text>

            {/* From Month */}
            <Text
              style={{
                fontSize: 13,
                fontWeight: '500',
                color: '#374151',
                marginBottom: 6,
              }}
            >
              From
            </Text>
            <TextInput
              placeholder="01/2024"
              placeholderTextColor="#D1D5DB"
              value={fromMonth}
              onChangeText={setFromMonth}
              style={{
                borderWidth: 1.5,
                borderColor: '#E5E7EB',
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                fontSize: 14,
                color: '#1F2937',
                marginBottom: 16,
              }}
              maxLength={7}
            />

            {/* To Month */}
            <Text
              style={{
                fontSize: 13,
                fontWeight: '500',
                color: '#374151',
                marginBottom: 6,
              }}
            >
              To
            </Text>
            <TextInput
              placeholder="12/2024"
              placeholderTextColor="#D1D5DB"
              value={toMonth}
              onChangeText={setToMonth}
              style={{
                borderWidth: 1.5,
                borderColor: '#E5E7EB',
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                fontSize: 14,
                color: '#1F2937',
              }}
              maxLength={7}
            />
          </View>
        )}
      </ScrollView>

      {/* REQUEST BUTTON - FIXED AT BOTTOM */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 16,
          borderTopWidth: 1,
          borderTopColor: '#E9E5FF',
          backgroundColor: '#FFFFFF',
        }}
      >
        <TouchableOpacity
          disabled={loading}
          onPress={handleRequestPayslip}
          style={{
            paddingVertical: 14,
            borderRadius: 10,
            backgroundColor: loading ? '#D1D5DB' : '#5B21B6',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
              Request Payslip
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* GMAIL CONNECTION MODAL */}
      <Modal
        visible={showGmailModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => !loading && setShowGmailModal(false)}
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
                  style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '600' }}
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
      </Modal>
    </View>
  );
}
