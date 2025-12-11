import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  markNotificationRead
} from '../../api/leave-api/leave_api';
import { fetchNotifications } from '../../api/profile-api/profileApi';
import { useUserStore } from '../../store/useUserStore';

// ⭐ Horizontal slide animation
import Animated, { Layout, SlideOutRight } from 'react-native-reanimated';
import { useLoadingStore } from '../../store/useLoadingStore';

type NotificationItem = {
  id: string;
  mentor_id: string;
  title: string;
  body: string;
  updated_at: string;
  type?: string;
  is_read: boolean;
};

export default function NotificationScreen({ navigation }: any) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const { user } = useUserStore();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const { showLoading, hideLoading } = useLoadingStore.getState();
    showLoading('notification', 'Loading...');
    try {
      const res = await fetchNotifications();
      const all = res.data.data;

      const filtered =
        user?.role === 'mentor'
          ? all.filter((n: any) => n.type === 'Pending' && !n.is_read)
          : all.filter((n: any) => !n.is_read);

      const sorted = filtered.sort(
        (a: NotificationItem, b: NotificationItem) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      );

      setNotifications(sorted);
    } catch (e) {
      console.log('notif error:', e);
    } finally {
      hideLoading();
    }
  };

  // ⭐ clear all animation (slower now)
  // const clearAllWithAnimation = async () => {
  //   try {
  //     await markAllNotificationsRead();

  //     const count = notifications.length;

  //     for (let i = 0; i < count; i++) {
  //       // ⏳ make this a bit slower (was 120)
  //       await new Promise(res => setTimeout(res, 220));
  //       setNotifications(prev => prev.slice(1));
  //     }
  //   } catch (e) {
  //     console.log('markAllNotificationsRead error:', e);
  //   }
  // };

  // ⭐ Invisible right action (required for swipe)
  const EmptyAction = () => <View style={{ width: 1 }} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* HEADER */}
      <View
        style={{
          paddingVertical: 12,
          paddingHorizontal: 16,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: '700',
            color: '#000',
          }}
        >
          Notifications
        </Text>
      </View>

      {/* LIST */}
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        contentContainerStyle={{
          padding: 15,
          flexGrow: 1, // ✅ so empty state can center
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
            <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 6 }}>
              No new notifications
            </Text>
            <Text style={{ fontSize: 13, color: 'gray', textAlign: 'center' }}>
              You’re all caught up.
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <Animated.View
            // ⭐ smoother layout animation
            layout={Layout.springify().damping(18)}
            // ⭐ slower exit (was 200)
            exiting={SlideOutRight.duration(380)}
          >
            <Swipeable
              overshootRight={false}
              renderLeftActions={EmptyAction}
              onSwipeableOpen={() => {
                // ⭐ Instant delete from UI
                setNotifications(prev => prev.filter(n => n.id !== item.id));

                // ⭐ API in background (no delay)
                markNotificationRead(item.id).catch(err =>
                  console.log('API failed:', err),
                );
              }}
            >
              <TouchableOpacity
                onPress={async () => {
                  await markNotificationRead(item.id);
                  setNotifications(prev => prev.filter(n => n.id !== item.id));

                  console.log('User Role:', user?.role);

                  if (user?.role === 'mentor') {
                    navigation.navigate('MentorApproval', { leaveId: item.id });
                  } else {
                    navigation.navigate('LeaveDetails', { leaveId: item.id });
                  }
                }}
                style={{
                  backgroundColor: '#F5F5F5',
                  padding: 18,
                  borderRadius: 12,
                  marginBottom: 12,
                  position: 'relative',
                }}
              >
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                  {item.title}
                </Text>

                {!item.is_read && (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: 'dodgerblue',
                      position: 'absolute',
                      right: 12,
                      top: 12,
                    }}
                  />
                )}

                <Text style={{ marginTop: 5 }}>{item.body}</Text>

                
              </TouchableOpacity>
            </Swipeable>
          </Animated.View>
        )}
      />
    </SafeAreaView>
  );
}
