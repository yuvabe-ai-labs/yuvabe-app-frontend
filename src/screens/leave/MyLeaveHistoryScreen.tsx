import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  cancelLeave,
  fetchMyLeaveHistory,
} from '../../api/profile-api/profileApi';
import CustomAlert from '../../components/CustomAlert';
import { useLoadingStore } from '../../store/useLoadingStore';
import { showToast } from '../../utils/ToastHelper';
import { formatDate } from './LeaveDetailsScreen';

export default function MyLeaveHistoryScreen() {
  const navigation = useNavigation<any>();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  const [showCancelLeave, setShowCancelLeave] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { showLoading, hideLoading } = useLoadingStore.getState();
    showLoading('history', 'Loading leave history');
    try {
      const res = await fetchMyLeaveHistory();
      setLeaves(res.data.data);
    } finally {
      hideLoading();
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const handleCancel = (item: any) => {
    setSelectedLeave(item);
    setShowCancelLeave(true);
  };

  // Render Leave Card
  const renderItem = ({ item }: any) => {
    const leaveDate = new Date(item.from_date);
    const today = new Date();

    const canCancel =
      (item.status === 'Approved' || item.status === 'Pending') &&
      leaveDate > today;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('LeaveDetails', { leaveId: item.id })
        }
      >
        <View
          style={{
            backgroundColor: '#F5F5F5',
            padding: 15,
            marginVertical: 10,
            borderRadius: 12,
          }}
        >
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
            {item.leave_type} ({item.status})
          </Text>

          <Text style={{ marginTop: 4 }}>
            {formatDate(item.from_date)} → {formatDate(item.to_date)}
          </Text>

          <Text style={{ marginTop: 2 }}>Days: {item.days}</Text>
          <Text style={{ marginTop: 2 }}>
            Mentor: {item.mentor_name || '—'}
          </Text>

          {/* FOOTER */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 12,
            }}
          >
            <Text style={{ color: 'gray', fontSize: 13 }}>
              Updated: {item.updated_at?.slice(0, 10)}
            </Text>

            {canCancel && (
              <TouchableOpacity
                onPress={() => handleCancel(item)}
                style={{
                  backgroundColor: '#E53935',
                  paddingVertical: 6,
                  paddingHorizontal: 14,
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 13,
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {/* ⭐ CUSTOM HEADER */}
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
          {/* LEFT SIDE: Arrow + Title */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeft size={28} color="#000" />
            </TouchableOpacity>

            <Text
              style={{
                marginLeft: 15, // 👈 spacing between arrow & title
                fontSize: 18,
                fontWeight: '600',
              }}
            >
              My Leave History
            </Text>
          </View>

          {/* RIGHT SIDE: LOGO */}
          {/* <Image
            source={require('../../assets/logo/yuvabe-logo.png')}
            style={{
              width: 40,
              height: 40,
              resizeMode: 'contain',
            }}
          /> */}
        </View>
        <CustomAlert
          visible={showCancelLeave}
          title="Cancel Leave"
          message="Are you sure?"
          confirmText="Yes"
          cancelText="No"
          destructive
          onCancel={() => {
            setShowCancelLeave(false);
            setSelectedLeave(null);
          }}
          onConfirm={async () => {
            setShowCancelLeave(false);

            if (!selectedLeave) return;
            const { showLoading, hideLoading } = useLoadingStore.getState();
            showLoading('cancelLeave', 'Cancelling leave...');

            try {
              await cancelLeave(selectedLeave.id);
              showToast('Success', 'Leave cancelled', 'success');
              load();
            } catch (err: any) {
              showToast(
                'Error',
                err.response?.data?.detail || 'Failed',
                'error',
              );
            } finally {
              hideLoading();
            }
          }}
        />

        {/* LIST */}
        <View style={{ flex: 1, paddingHorizontal: 15 }}>
          <FlatList
            data={leaves}
            renderItem={renderItem}
            keyExtractor={(item: any) => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <Text
                style={{ textAlign: 'center', marginTop: 40, color: 'gray' }}
              >
                No leave history found
              </Text>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
