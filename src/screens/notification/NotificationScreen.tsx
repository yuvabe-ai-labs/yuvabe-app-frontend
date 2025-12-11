import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, { Layout, SlideOutRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { markNotificationRead } from '../../api/leave-api/leave_api';
import { fetchNotifications } from '../../api/profile-api/profileApi';
import { useUserStore } from '../../store/useUserStore';

type NotificationItem = {
  id: string;
  mentor_id: string;
  title: string;
  body: string;
  updated_at: string;
  type?: string;
  is_read: boolean;
};

type Props = {
  navigation: any;
  visible: boolean;
};

export default function NotificationScreen({ navigation, visible }: Props) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    loadNotifications();
  }, [visible]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetchNotifications();
      const all = res.data.data;

      const filtered =
        user?.role === 'mentor'
          ? all.filter((n: any) => n.type === 'Pending')
          : all;

      const sorted = filtered.sort((a, b) => {
        if (a.is_read === b.is_read) {
          return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
        }
        return a.is_read ? 1 : -1;
      });

      setNotifications(sorted);
    } catch (e) {
      console.log('notif error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (item: NotificationItem) => {
    await markNotificationRead(item.id);

    setNotifications(prev =>
      prev
        .map(n => (n.id === item.id ? { ...n, is_read: true } : n))
        .sort((a, b) => {
          if (a.is_read !== b.is_read) return a.is_read ? 1 : -1;
          return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
        }),
    );
  };

  const EmptyAction = () => <View style={{ width: 1 }} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* HEADER */}
      <View style={{ paddingVertical: 12, paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: '#000' }}>
          Notifications
        </Text>
      </View>

      {/* CIRCLE LOADING INDICATOR */}
      {loading && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      )}

      {/* LIST (only show when NOT loading) */}
      {!loading && (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          contentContainerStyle={{
            padding: 15,
            flexGrow: 1,
          }}
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 40,
              }}
            >
              <Text
                style={{ fontSize: 16, fontWeight: '500', marginBottom: 6 }}
              >
                No new notifications
              </Text>
              <Text
                style={{ fontSize: 13, color: 'gray', textAlign: 'center' }}
              >
                You’re all caught up.
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <Animated.View
              layout={Layout.springify().damping(18)}
              exiting={SlideOutRight.duration(380)}
            >
              <Swipeable
                overshootRight={false}
                renderLeftActions={EmptyAction}
                onSwipeableOpen={() => handleSwipe(item)}
              >
                <TouchableOpacity
                  onPress={async () => {
                    await markNotificationRead(item.id);

                    setNotifications(prev =>
                      prev
                        .map(n =>
                          n.id === item.id ? { ...n, is_read: true } : n,
                        )
                        .sort((a, b) => {
                          if (a.is_read !== b.is_read)
                            return a.is_read ? 1 : -1;
                          return (
                            new Date(b.updated_at).getTime() -
                            new Date(a.updated_at).getTime()
                          );
                        }),
                    );

                    if (user?.role === 'mentor') {
                      navigation.navigate('MentorApproval', {
                        leaveId: item.id,
                      });
                    } else {
                      navigation.navigate('LeaveDetails', { leaveId: item.id });
                    }
                  }}
                  style={{
                    backgroundColor: item.is_read ? '#FFFFFF' : '#E6F0FF',
                    padding: 18,
                    borderRadius: 12,
                    marginBottom: 12,
                  }}
                >
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                    {item.title}
                  </Text>
                  <Text style={{ marginTop: 5 }}>{item.body}</Text>
                </TouchableOpacity>
              </Swipeable>

              <View
                style={{
                  height: 1,
                  backgroundColor: '#e0e0e0',
                  marginVertical: 6,
                }}
              />
            </Animated.View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
