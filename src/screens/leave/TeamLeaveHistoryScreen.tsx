import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { fetchTeamLeaveHistory } from '../../api/profile-api/profileApi';

export default function TeamLeaveHistoryScreen() {
  const [leaves, setLeaves] = useState([]);

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
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
      }}
    >
      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
        {item.user_name} — {item.leave_type} ({item.status})
      </Text>

      <Text>
        {item.from_date} → {item.to_date}
      </Text>
      <Text>Days: {item.days}</Text>
      <Text>Reason: {item.reason}</Text>

      <Text style={{ color: 'gray', marginTop: 8 }}>
        Updated: {item.updated_at?.slice(0, 10)}
      </Text>
    </View>
  );

  return (
    <View style={{ padding: 15 }}>
      <FlatList data={leaves} renderItem={renderItem} />
    </View>
  );
}
