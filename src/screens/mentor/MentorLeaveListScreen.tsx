import { Calendar, ChevronLeft, CloudOff } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchPendingLeaves } from '../../api/profile-api/profileApi';

export default function MentorLeaveListScreen({ navigation }: any) {
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPendingLeaves();
  }, []);

  const loadPendingLeaves = async () => {
    try {
      setLoading(true);
      const res = await fetchPendingLeaves();

      const sorted = res.data.data.sort(
        (a: any, b: any) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      );

      setPendingLeaves(sorted);
    } catch (err: any) {
      console.log('🔥 mentor list error:', err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('MentorApproval', { leaveId: item.id })
      }
      style={{
        backgroundColor: '#ffffff',
        padding: 18,
        borderRadius: 12,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}
    >
      {/* Leave Type + User */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontWeight: '700', fontSize: 18, color: '#2C3E50' }}>
          {item.leave_type}
        </Text>

        <Text style={{ fontSize: 15, fontWeight: '600', color: '#007AFF' }}>
          {item.user_name}
        </Text>
      </View>

      {/* Dates */}
      <View
        style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}
      >
        <Calendar size={18} color="#555" strokeWidth={2} />

        <Text style={{ marginLeft: 6, color: '#555', fontSize: 15 }}>
          {item.from_date} → {item.to_date}
        </Text>
      </View>

      {/* Updated At */}
      <View style={{ marginTop: 6 }}>
        <Text style={{ fontSize: 12, color: 'gray' }}>
          Updated: {item.updated_at?.slice(0, 10)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F6F9' }}>
      <View style={{ flex: 1, padding: 16 }}>
        {/* Header */}
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          {/* LEFT: Back + Title */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                padding: 6,
                marginRight: 10,
              }}
            >
              <ChevronLeft size={28} color="#000" strokeWidth={2} />
            </TouchableOpacity>

            <Text
              style={{
                fontWeight: '800',
                fontSize: 18,
                color: '#1C1C1E',
              }}
            >
              Pending Leave Requests
            </Text>
          </View>

          {/* RIGHT: Logo */}
          {/* <Image
            source={require('../../assets/logo/yuvabe-logo.png')}
            style={{
              width: 40,
              height: 40,
              resizeMode: 'contain',
            }}
          /> */}
        </View>

        <FlatList
          data={pendingLeaves}
          keyExtractor={(item: any) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={loadPendingLeaves}
            />
          }
          ListEmptyComponent={
            !loading ? (
              <View style={{ marginTop: 80, alignItems: 'center' }}>
                <CloudOff size={60} color="gray" strokeWidth={2} />

                <Text
                  style={{
                    marginTop: 10,
                    fontSize: 16,
                    color: 'gray',
                    textAlign: 'center',
                  }}
                >
                  No pending requests
                </Text>
              </View>
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
}
