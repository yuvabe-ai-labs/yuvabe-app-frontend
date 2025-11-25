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
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { fetchProfileDetails } from '../../api/profile-api/profileApi';
import { getItem, setItem } from '../../store/storage';
import { useUserStore } from '../../store/useUserStore';
import { styles } from './ProfileStyles';

export const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { user, resetUser, setIsLoggedIn, setIsVerified } = useUserStore();
  const { setProfileDetails } = useUserStore();
  const { team_name, mentor_name } = useUserStore();

  const storedImage = getItem('profile_image');

  React.useEffect(() => {
    fetchProfileDetails().then(res => {
      if (res.code === 200) {
        setProfileDetails(res.data);
      }
    });
  }, [setProfileDetails]);

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
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Gradient Header */}
      <LinearGradient colors={['#4A90E2', '#5A6FF0']} style={styles.headerBg}>
        {/* <Text style={styles.headerTitle}>My Profile</Text> */}
      </LinearGradient>

      {/* Profile Card */}
      <View style={styles.profileCard}>
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
        <View style={{ marginTop: 12, width: '60%' }}>
          <View style={styles.infoRow}>
            <Icon name="users" size={18} style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Team</Text>
            <Text style={styles.infoValue}>{team_name || '—'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="user-check" size={18} style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Mentor</Text>
            <Text style={styles.infoValue}>{mentor_name || '—'}</Text>
          </View>
        </View>
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
      </View>

      {/* Spacer to make design full */}
      <View style={{ flex: 1 }} />

      {/* Logout */}
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
