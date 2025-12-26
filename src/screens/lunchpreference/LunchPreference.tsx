import DateTimePicker from '@react-native-community/datetimepicker';
import { ChevronLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';

import {
  getGmailConnectUrl,
  requestLunchOptOut,
} from '../../api/lunch-api/lunchApi';
import { GradientButton } from '../../components/GradientButton';
import { useUserStore } from '../../store/useUserStore';
import { TEXT_STYLES } from '../../utils/theme';
import styles from '../homescreen/components/VisionBoardStyles';

const LunchPreferenceScreen = ({ navigation, userId }: any) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'tomorrow' | 'range' | null>(
    null,
  );
  const [showGmailModal, setShowGmailModal] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const user = useUserStore(state => state.user);
  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#6B7280' }}>
          User data missing. Please login again.
        </Text>
      </View>
    );
  }

  /* -----------------------------
     Date helpers
  ------------------------------ */
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const normalizeDate = (d: Date) => {
    const n = new Date(d);
    n.setHours(0, 0, 0, 0);
    return n;
  };

  const isRangeValid =
    selectedMode &&
    startDate &&
    endDate &&
    normalizeDate(endDate) >= normalizeDate(startDate);

  /* -----------------------------
     API
  ------------------------------ */
  const sendLunchRequest = async () => {
    if (!startDate || !endDate) return;

    await requestLunchOptOut({
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
    });

    navigation.goBack();
  };

  const getConfirmText = () => {
    if (!startDate || !endDate) return '';

    const sameDay = startDate.toDateString() === endDate.toDateString();

    return sameDay
      ? `You want to opt out of lunch on ${startDate.toDateString()}.`
      : `You want to opt out of lunch from ${startDate.toDateString()} to ${endDate.toDateString()}.`;
  };

  /* -----------------------------
     Gmail callback
  ------------------------------ */
  const handleConnectGmail = async () => {
    if (loading) return;
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const processUrl = async (url: string) => {
      if (!url || !url.includes('gmail/callback')) return;

      const isSuccess = url.includes('success=true');

      if (isSuccess && pendingSubmit) {
        try {
          setLoading(true);
          await sendLunchRequest();
        } finally {
          setLoading(false);
          setPendingSubmit(false);
          setShowGmailModal(false);
        }
      } else if (!isSuccess) {
        setShowGmailModal(false);
      }
    };

    const subscription = Linking.addEventListener('url', event => {
      processUrl(event.url);
    });

    Linking.getInitialURL().then(url => {
      if (url) processUrl(url);
    });

    return () => subscription.remove();
  }, [pendingSubmit, startDate, endDate]);
  /* -----------------------------
     Submit
  ------------------------------ */
  const onSubmit = async () => {
    if (loading) return;
    setLoading(true); // 👈 start immediately

    try {
      setPendingSubmit(false);
      await sendLunchRequest();
    } catch (e: any) {
      if (e.response?.status === 428) {
        setPendingSubmit(true);
        setShowGmailModal(true);
      }
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------
     UI
  ------------------------------ */
  return (
    <View className="flex-1 bg-white px-4 pt-4">
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={28} color="#000" />
        </TouchableOpacity>

        <Text style={{ ...TEXT_STYLES.title }} className="flex-1 text-center">
          Lunch Preference
        </Text>

        <View style={{ width: 28 }} />
      </View>

      {/* Intro */}
      <Text className="text-base text-[#374151] mb-4 leading-6">
        Planning a leave or working remotely?
        {'\n'}
        Make sure to opt out of lunch — let’s reduce food waste 🌱
      </Text>

      {/* Tomorrow option */}
      <TouchableOpacity
        onPress={() => {
          const t = new Date();
          t.setDate(t.getDate() + 1);

          setStartDate(t);
          setEndDate(t);
          setSelectedMode('tomorrow');
        }}
        style={{
          borderWidth: 1,
          borderColor: selectedMode === 'tomorrow' ? '#5829c7' : '#E5E7EB',
          backgroundColor: selectedMode === 'tomorrow' ? '#F3E8FF' : '#FFFFFF',
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
          opacity: selectedMode === null ? 0.6 : 1,
        }}
      >
        <Text style={{ color: '#5829c7', fontWeight: '600', fontSize: 16 }}>
          I don’t want lunch tomorrow
        </Text>
      </TouchableOpacity>

      {/* Range */}
      <Text className="text-sm text-[#6B7280] mb-2">
        I don’t want lunch from
      </Text>

      <View className="flex-row gap-3">
        <TouchableOpacity
          className="flex-1 border border-[#E5E7EB] rounded-lg p-4"
          onPress={() => {
            setSelectedMode('range');
            setShowStartPicker(true);
          }}
        >
          <Text className="text-[#111827]">
            {startDate ? startDate.toDateString() : 'Start date'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 border border-[#E5E7EB] rounded-lg p-4"
          onPress={() => {
            setSelectedMode('range');
            setShowEndPicker(true);
          }}
        >
          <Text className="text-[#111827]">
            {endDate ? endDate.toDateString() : 'End date'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Send */}
      <TouchableOpacity
        disabled={!isRangeValid || loading}
        style={{
          marginTop: 32,
          backgroundColor: !isRangeValid ? '#D1D5DB' : '#5829c7',
          paddingVertical: 16,
          borderRadius: 12,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
        }}
        onPress={() => {
          if (loading) return;
          setShowConfirm(true);
        }}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '600' }}>
            Send
          </Text>
        )}
      </TouchableOpacity>

      {/* Confirmation modal */}
      {showConfirm && (
        <Modal animationType="fade" transparent>
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setShowConfirm(false)}
            activeOpacity={1}
          >
            <TouchableOpacity
              style={styles.modalCard}
              onPress={e => e.stopPropagation()}
              activeOpacity={1}
            >
              <Text style={styles.modalTitle}>Confirm Lunch Opt-Out</Text>

              <Text style={{ textAlign: 'center', marginVertical: 20 }}>
                {getConfirmText()}
              </Text>

              <View style={styles.footerRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowConfirm(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <GradientButton
                  title={loading ? 'Sending…' : 'Confirm'}
                  onPress={async () => {
                    setShowConfirm(false);
                    await onSubmit();
                  }}
                />
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Pickers */}
      {showStartPicker && (
        <DateTimePicker
          value={startDate || today}
          minimumDate={today}
          mode="date"
          display="calendar"
          onChange={(_, d) => {
            setShowStartPicker(false);
            if (!d) return;

            const nd = normalizeDate(d);
            setStartDate(nd);

            if (!endDate || normalizeDate(endDate) < nd) {
              setEndDate(nd);
            }
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate || startDate || today}
          minimumDate={startDate || today}
          mode="date"
          display="calendar"
          onChange={(_, d) => {
            setShowEndPicker(false);
            if (d) setEndDate(normalizeDate(d));
          }}
        />
      )}
      <Modal
        visible={showGmailModal}
        transparent
        animationType="fade"
        onRequestClose={() => !loading && setShowGmailModal(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => !loading && setShowGmailModal(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
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
                To notify the lunch manager, we need to connect your Gmail
                account.
              </Text>

              <TouchableOpacity
                disabled={loading}
                onPress={handleConnectGmail}
                style={{
                  paddingVertical: 14,
                  borderRadius: 10,
                  backgroundColor: loading ? '#D1D5DB' : '#5B21B6',
                  marginBottom: 10,
                  alignItems: 'center',
                }}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
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
};

export default LunchPreferenceScreen;
