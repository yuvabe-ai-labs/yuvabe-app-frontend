import { Home, Smile, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { fetchUserDetails } from '../../api/auth-api/authApi';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../utils/theme';

const InformationScreen = () => {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    loadInfo();
  }, []);

  const loadInfo = async () => {
    try {
      const response = await fetchUserDetails();
      setInfo(response);
    } catch (error) {
      console.error('Error loading information', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={{ marginTop: 10, color: 'gray' }}>
              Loading ...
            </Text>
          </View>
        </SafeAreaView>
      );

  const user = info?.user;
  const home = info?.home_data;

  return (
    <ScrollView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Information</Text>

      {/* Welcome Message */}
      <View style={styles.card}>
        <Smile size={22} color="#4A90E2" strokeWidth={2} />

        <Text style={styles.label}>Message</Text>
        <Text style={styles.value}>{info?.message}</Text>
      </View>

      {/* User Information */}
      <View style={styles.card}>
        <User size={22} color="#4A90E2" strokeWidth={2} />

        <Text style={styles.label}>User Information</Text>

        <InfoRow label="Name" value={user?.name} />
        <InfoRow label="Email" value={user?.email} />
        <InfoRow
          label="Status"
          value={user?.is_verified ? 'Active' : 'InActive'}
        />
        <InfoRow label="Date of Birth" value={user?.dob} />
      </View>

      {/* Home Data */}
      <View style={styles.card}>
        <Home size={22} color="#4A90E2" strokeWidth={2} />

        <Text style={styles.label}>Announcements</Text>

        {home?.announcements?.map((item: string, index: number) => (
          <Text key={index} style={styles.announcement}>
            • {item}
          </Text>
        ))}

        {/* <InfoRow label="Timestamp" value={home?.timestamp} /> */}
      </View>
    </ScrollView>
  );
};

export default InformationScreen;

const InfoRow = ({ label, value }: any) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}:</Text>
    <Text style={styles.rowValue}>{value || '-'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 15,
    borderRadius: 12,
    elevation: 3,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 8,
    color: '#4A4A4A',
  },
  value: {
    fontSize: 16,
    color: '#555',
  },
  row: {
    flexDirection: 'row',
    marginTop: 6,
  },
  rowLabel: {
    fontWeight: '600',
    width: 120,
    color: '#444',
  },
  rowValue: {
    color: '#555',
  },
  announcement: {
    fontSize: 15,
    color: '#333',
    marginVertical: 2,
  },
});
