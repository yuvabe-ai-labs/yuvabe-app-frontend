import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { fetchTeamLeaveHistory } from '../../api/profile-api/profileApi';
import { formatDate } from './LeaveDetailsScreen';

export default function TeamLeaveHistoryScreen() {
  const [leaves, setLeaves] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await fetchTeamLeaveHistory();
    setLeaves(res.data.data);
  };

  const renderItem = ({ item }: any) => (
    <View
      style={{
        backgroundColor: '#F5F5F5',
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
      }}
    >
      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
        {item.user_name} — {item.leave_type} ({item.status})
      </Text>

      <Text>
        {formatDate(item.from_date)} → {formatDate(item.to_date)}
      </Text>
      <Text>Days: {item.days}</Text>
      <Text>Reason: {item.reason}</Text>

      <Text style={{ color: 'gray', marginTop: 8 }}>
        Updated: {formatDate(item.updated_at?.slice(0, 10))}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* ⭐ CUSTOM HEADER */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 16,
          backgroundColor: '#fff',
        }}
      >
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={28} color="#000" />
        </TouchableOpacity>
        {/* Title */}
        <Text
          style={{
            marginLeft: 30,
            textAlign: 'center',
            fontSize: 18,
            fontWeight: '600',
          }}
        >
          Team Leave History
        </Text>
        <View style={{ width: 28 }} /> {/* dummy space */}
      </View>

      {/* LIST */}
      <View style={{ padding: 15, flex: 1 }}>
        <FlatList
          data={leaves}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>
    </View>
  );
}
