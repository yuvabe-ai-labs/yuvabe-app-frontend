import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';

import {
  markAllNotificationsRead,
  markNotificationRead,
} from '../../api/leave-api/leave_api';

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

export default function NotificationScreen({ navigation }: any) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUserStore();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await fetchNotifications();
      const all = res.data.data;

      // Mentor sees only pending
      let filtered =
        user?.role === 'mentor'
          ? all.filter((n: any) => n.type === 'Pending')
          : all;

      const sorted = filtered.sort(
        (a: NotificationItem, b: NotificationItem) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      );

      setNotifications(sorted);
    } catch (e) {
      console.log('notif error:', e);
    } finally {
      setLoading(false);
    }
  };

  // Header button
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Notifications',
      headerRight: () =>
        notifications.length > 0 ? (
          <TouchableOpacity
            onPress={async () => {
              await markAllNotificationsRead();
              setNotifications([]);
            }}
            style={{
              marginRight: 12,
              backgroundColor: '#ff4d4d',
              padding: 6,
              borderRadius: 20,
            }}
          >
            <Icon name="x" size={18} color="#fff" />
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, notifications.length]);

  // Loading
  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  // Mentor empty state
  if (user?.role === 'mentor' && notifications.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, color: 'gray' }}>
          No new notifications
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 15 }}
        renderItem={({ item }) => (
          <Swipeable
            overshootRight={false}
            onSwipeableOpen={async () => {
              // Auto delete on swipe
              await markNotificationRead(item.id);
              setNotifications(prev => prev.filter(n => n.id !== item.id));
            }}
          >
            <TouchableOpacity
              onPress={async () => {
                await markNotificationRead(item.id);
                setNotifications(prev => prev.filter(n => n.id !== item.id));

                navigation.navigate(
                  user?.role === 'mentor' ? 'MentorApproval' : 'LeaveDetails',
                  { leaveId: item.id },
                );
              }}
              style={{
                backgroundColor: '#fff',
                padding: 18,
                borderRadius: 12,
                marginBottom: 12,
                elevation: 3,
                position: 'relative',
              }}
            >
              {/* Title */}
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                {item.title}
              </Text>

              {/* Unread Badge */}
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

              {/* Body */}
              <Text style={{ marginTop: 5 }}>{item.body}</Text>

              {/* Date */}
              <Text
                style={{
                  fontSize: 12,
                  color: 'gray',
                  marginTop: 8,
                  textAlign: 'right',
                }}
              >
                {item.updated_at.slice(0, 10)}
              </Text>
            </TouchableOpacity>
          </Swipeable>
        )}
      />
    </View>
  );
}
