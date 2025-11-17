import { CommonActions, useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { getItem, setItem } from '../../store/storage';
import { useUserStore } from '../../store/useUserStore';
import { styles } from './ProfileStyles';

export const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { user, resetUser, setIsLoggedIn, setIsVerified } = useUserStore();
  const storedImage = getItem('profile_image');

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          resetUser();
          setIsLoggedIn(false);
          setIsVerified(false);

          await Promise.all([
            setItem('is_verified', 'false'),
            setItem('pending_email', ''),
            setItem('access_token', ''),
            setItem('refresh_token', ''),
          ]);

          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Auth' }],
            }),
          );
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={{
            uri:
              storedImage ||
              user?.profile_picture ||
              'https://i.pravatar.cc/150?img=3',
          }}
          style={styles.profileImage}
        />

        <Text style={styles.name}>{user?.name || 'User'}</Text>

        <Text style={styles.email}>{user?.email || 'example@yuvabe.com'}</Text>
      </View>

      {/* Sections */}
      <View style={styles.sectionWrapper}>
        <SectionItem
          icon="edit-3"
          label="Edit Profile"
          onPress={() => navigation.navigate('EditProfile')}
        />
        <SectionItem
          icon="briefcase"
          label="My Assets"
          onPress={() => navigation.navigate('AssetsScreen')}
        />
        <SectionItem
          icon="calendar"
          label="Leave Requests"
          onPress={() => navigation.navigate('LeaveScreen')}
        />
        <SectionItem
          icon="info"
          label="Information"
          onPress={() => navigation.navigate('InformationScreen')}
        />

        <SectionItem
          icon="activity"
          label="Consistency Streak"
          onPress={() => {}}
        />
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out" size={18} color="#FF3B30" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const SectionItem = ({ label, icon, onPress }: any) => (
  <TouchableOpacity style={styles.sectionRow} onPress={onPress}>
    <Icon name={icon} size={22} color="#4A90E2" />
    <Text style={styles.sectionLabel}>{label}</Text>
    <Icon name="chevron-right" size={22} color="#C4C4C4" />
  </TouchableOpacity>
);
