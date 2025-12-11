import { Bell } from 'lucide-react-native';
import React from 'react';
import { Linking, Text, TouchableOpacity } from 'react-native';
import { useNotificationStore } from '../store/notificationStore';

const NotificationIndicator = () => {
  const notificationEnabled = useNotificationStore(
    state => state.notificationEnabled,
  );

  if (notificationEnabled) return null;

  return (
    <TouchableOpacity
      onPress={() => Linking.openSettings()}
      style={{
        backgroundColor: '#FFF4CC',
        borderColor: '#FFAA00',
        borderWidth: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Bell size={18} color="#CC7A00" />
      <Text style={{ marginLeft: 6, color: '#CC7A00', fontWeight: '600' }}>
        Notifications are Off — Tap to Enable
      </Text>
    </TouchableOpacity>
  );
};

export default NotificationIndicator;
