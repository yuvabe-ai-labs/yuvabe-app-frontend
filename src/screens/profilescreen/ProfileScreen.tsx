import { useNavigation } from '@react-navigation/native';
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
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { getItem } from '../../store/storage';
import { useUserStore } from '../../store/useUserStore';
import { logoutUser } from '../../utils/LogoutHelper';
import { COLORS } from '../../utils/theme';
import { styles } from './ProfileStyles';

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useUserStore();
  const { team_name, lead_label, lead_name } = useUserStore();

  // Saved image from storage
  const storedImage = getItem('profile_image');
  const profileSrc = storedImage || user?.profile_picture;

  const handleLogout = () => {
    logoutUser(navigation);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 🔵 Gradient Header */}
        <Svg
          width="100%"
          height={styles.headerBg.height} // ensure this matches your header height
          style={styles.headerBg}
        >
          <Defs>
            <LinearGradient id="headerGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#592AC7" />
              <Stop offset="100%" stopColor="#CCB6FF" />
            </LinearGradient>
          </Defs>

          <Rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#headerGrad)"
          />
        </Svg>

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
        {/* <Image
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
        /> */}

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
              <IconLucideUser
                size={34}
                color={COLORS.primary}
                strokeWidth={2.5}
              />
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
              <Text style={styles.infoLabel}>{lead_label}:</Text>
              <Text style={styles.infoValue}>{lead_name || '—'}</Text>
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
