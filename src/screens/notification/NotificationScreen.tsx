import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity } from 'react-native';
import { fetchNotifications } from '../../api/profile-api/profileApi';
import { useUserStore } from '../../store/useUserStore';

type NotificationItem = {
  mentor_id: string;
  id: string;
  title: string;
  body: string;
  updated_at: string;
  leave_type?: string;
  from_date?: string;
  to_date?: string;
  reason?: string;
  type?: string;
};

export default function NotificationScreen({ navigation }: any) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const { user } = useUserStore();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await fetchNotifications();

      const sorted = [...res.data.data].sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      );

      setNotifications(sorted);
    } catch (e) {
      console.log('notif error:', e);
    }
  };

  return (
    <FlatList
      data={notifications}
      keyExtractor={item => item.id}
      style={{ padding: 15 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => {
            if (item.type === 'Pending' && item.mentor_id === user?.id) {
              navigation.navigate('MentorApproval', { leaveId: item.id });
              return;
            }

            navigation.navigate('LeaveDetails', { leaveId: item.id });
          }}
          style={{
            backgroundColor: '#fff',
            padding: 15,
            borderRadius: 10,
            marginBottom: 12,
            elevation: 2,
          }}
        >
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.title}</Text>
          <Text style={{ marginTop: 5 }}>{item.body}</Text>
          <Text style={{ fontSize: 12, color: 'gray', marginTop: 5 }}>
            {item.updated_at.slice(0, 10)}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}
