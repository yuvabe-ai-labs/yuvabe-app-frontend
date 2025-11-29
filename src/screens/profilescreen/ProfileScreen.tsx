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
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  fetchProfileDetails,
  logoutDevice,
} from '../../api/profile-api/profileApi';
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
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

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
          setIsLoggingOut(true);
          try {
            await logoutDevice();
          } catch (e) {
            console.log('Error removing device:', e);
          }
          resetUser();
          setIsLoggedIn(false);
          setIsVerified(false);

          await Promise.all([
            setItem('is_verified', 'false'),
            setItem('pending_email', ''),
            setItem('access_token', ''),
            setItem('refresh_token', ''),
          ]);

          setIsLoggingOut(false);

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

  if (isLoggingOut) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.3)',
        }}
      >
        <View
          style={{
            padding: 25,
            backgroundColor: '#fff',
            borderRadius: 10,
            elevation: 4,
          }}
        >
          <Text style={{ fontSize: 16, marginBottom: 15 }}>Logging out...</Text>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 🔵 Gradient Header */}
        <LinearGradient
          colors={['#4A90E2', '#5A6FF0']}
          style={styles.headerBg}
        />

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
        <Image
          source={require('../../assets/logo/yuvabe-logo.png')}
          style={{
            position: 'absolute',
            top: 15,
            right: 15,
            width: 38,
            height: 38,
            resizeMode: 'contain',
            zIndex: 0,
          }}
        />

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
    </SafeAreaView>
  );
};

const SectionItem = ({ label, onPress }: any) => (
  <TouchableOpacity style={styles.sectionRow} onPress={onPress}>
    <Pencil
      size={20}
      color="#4A90E2"
      strokeWidth={2}
      style={{ marginRight: 12 }}
    />
    <Text style={styles.sectionLabel}>{label}</Text>
    <ChevronRight size={22} color="#C4C4C4" strokeWidth={2} />
  </TouchableOpacity>
);

export default ProfileScreen;
