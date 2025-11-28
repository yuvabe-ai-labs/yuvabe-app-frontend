import { CommonActions, useNavigation } from '@react-navigation/native';
import {
  ChevronLeft,
  ChevronRight,
  User as IconLucideUser,
  UserCheck as IconLucideUserCheck,
  Users as IconLucideUsers,
  LogOut,
  Pencil,
} from 'lucide-react-native';
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
import { fetchProfileDetails } from '../../api/profile-api/profileApi';
import { getItem, setItem } from '../../store/storage';
import { useUserStore } from '../../store/useUserStore';
import { styles } from './ProfileStyles';

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { user, resetUser, setIsLoggedIn, setIsVerified } = useUserStore();
  const { setProfileDetails } = useUserStore();
  const { team_name, mentor_name } = useUserStore();

  // Saved image from storage
  const storedImage = getItem('profile_image');
  const profileSrc = storedImage || user?.profile_picture;

  // Load profile details
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
      {/* 🔵 Gradient Header */}
      <LinearGradient colors={['#4A90E2', '#5A6FF0']} style={styles.headerBg} />

      {/* 🔙 Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          top: 15,
          left: 15,
          zIndex: 10,
          padding: 5,
        }}
      >
        <ChevronLeft size={32} color="#fff" strokeWidth={2.5} />
      </TouchableOpacity>

      {/* 🧍 Profile Card */}
      <View
        style={[
          styles.profileCard,
          { flexDirection: 'row', alignItems: 'center' },
        ]}
      >
        <View
          style={{
            width: 65,
            height: 65,
            borderRadius: 32.5,
            backgroundColor: '#e6e6e6',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 20,
            overflow: 'hidden',
          }}
        >
          {profileSrc ? (
            <Image
              source={{ uri: profileSrc }}
              style={{ width: 65, height: 65, borderRadius: 32.5 }}
            />
          ) : (
            <IconLucideUser size={34} color="#4A90E2" strokeWidth={2.5} />
          )}
        </View>
        {/* Details */}
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{user?.name || 'User'}</Text>
          <Text style={styles.email}>
            {user?.email || 'example@yuvabe.com'}
          </Text>

          {/* Team */}
          <View style={[styles.infoRow, { marginTop: 8 }]}>
            <IconLucideUsers
              size={18}
              color="#4A90E2"
              style={styles.infoIcon}
            />
            <Text style={styles.infoLabel}>Team:</Text>
            <Text style={styles.infoValue}>{team_name || '—'}</Text>
          </View>

          {/* Mentor */}
          <View style={[styles.infoRow, { marginTop: 4 }]}>
            <IconLucideUserCheck
              size={18}
              color="#4A90E2"
              style={styles.infoIcon}
            />
            <Text style={styles.infoLabel}>Mentor:</Text>
            <Text style={styles.infoValue}>{mentor_name || '—'}</Text>
          </View>
        </View>
      </View>

      {/* ⚙️ Only Edit Profile Section */}
      <View style={styles.sectionWrapper}>
        <SectionItem
          icon="edit-3"
          label="Edit Profile"
          onPress={() => navigation.navigate('EditProfile')}
        />
      </View>

      {/* Spacer */}
      <View style={{ flex: 1 }} />

      {/* 🔴 Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={18} color="#FF3B30" strokeWidth={2} />

        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const SectionItem = ({ label, onPress }: any) => (
  <TouchableOpacity style={styles.sectionRow} onPress={onPress}>
    <Pencil size={20} color="#4A90E2" strokeWidth={2} style={{ marginRight: 12 }} />
    <Text style={styles.sectionLabel}>{label}</Text>
    <ChevronRight size={22} color="#C4C4C4" strokeWidth={2} />
  </TouchableOpacity>
);

export default ProfileScreen;
