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
    showLoading('history', 'Loading history');
    try {
      const res = await fetchMyLeaveHistory();
      setLeaves(res.data.data);
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

    const statusColors: any = {
      Approved: '#4CAF50',
      Pending: '#FFA000',
      Cancelled: '#3F1ABF',
      Rejected: '#FF3B30',
    };

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('LeaveDetails', { leaveId: item.id })
        }
        style={{
          marginBottom: 18,
        }}
      >
        <View
          style={{
            backgroundColor: '#FFFFFF',
            padding: 18,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: '#592AC7',
          }}
        >
          {/* TITLE + STATUS BADGE */}
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#000' }}>
              {item.leave_type} Leave
            </Text>

            <View
              style={{
                backgroundColor: statusColors[item.status] || '#999',
                paddingVertical: 4,
                paddingHorizontal: 14,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>
                {item.status} 
              </Text>
            </View>
          </View>

          {/* DATES */}
          <Text style={{ marginTop: 10, fontSize: 14, color: '#000' }}>
            {formatDate(item.from_date)} → {formatDate(item.to_date)}
          </Text>

          {/* DAYS */}
          <Text style={{ marginTop: 10, fontSize: 14, color: '#000' }}>
            Number of Days: {item.days}
          </Text>

          {/* APPROVED BY */}
          <Text style={{ marginTop: 10, fontSize: 14, color: '#000' }}>
            Approved by: {item.mentor_name || '—'}
          </Text>

          {/* UPDATED ON */}
          <Text style={{ marginTop: 12, fontSize: 13, color: '#8A8A8A' }}>
            Updated on: {formatDate(item.updated_at)}
          </Text>

          {/* CANCEL BUTTON (same logic) */}
          {canCancel && (
            <TouchableOpacity
              onPress={() => handleCancel(item)}
              style={{
                marginTop: 12,
                backgroundColor: '#E53935',
                paddingVertical: 7,
                paddingHorizontal: 18,
                borderRadius: 20,
                alignSelf: 'flex-end',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>
                Cancel
              </Text>
            </TouchableOpacity>
          )}
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
              Leave History
            </Text>
          </View>
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
