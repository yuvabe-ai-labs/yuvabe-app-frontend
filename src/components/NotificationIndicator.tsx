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
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Bell size={18} color="#CC7A00" />
      <Text style={{ marginLeft: 6, color: '#CC7A00', fontWeight: '600' }}>
        Notifications are off — tap to enable
      </Text>
    </TouchableOpacity>
  );
};

export default NotificationIndicator;
