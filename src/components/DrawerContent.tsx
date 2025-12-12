import { LogOut, User } from 'lucide-react-native';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getItem } from '../store/storage';
import { useUserStore } from '../store/useUserStore';
import {
  Asset,
  ChatBot,
  Journaling,
  LeaveHistory,
  PaySlip,
  RequestLeave,
  WaterTracker,
  LogOut
} from '../utils/customIcons';
import { logoutUser } from '../utils/LogoutHelper';
import { COLORS } from '../utils/theme';

const DrawerContent = ({ navigation, closeDrawer }: any) => {
  const profileImage = getItem('profile_image');
  const userData = useUserStore(state => state.user);

  const role = userData?.role ?? 'user';
  const isMentor = role === 'mentor' || role === 'sub mentor';
  console.log('Drawer role:', role);

  const isLogoutLoading = useUserStore(state => state.isLogoutLoading);

  useEffect(() => {}, [isMentor, role]);

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={() => {
            closeDrawer();
            navigation.navigate('Profile');
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 30,
          }}
        >
          <View
            style={{
              width: 55,
              height: 55,
              borderRadius: 30,
              backgroundColor: '#e6e6e6',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
              overflow: 'hidden',
            }}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={{ width: 55, height: 55, borderRadius: 30 }}
              />
            ) : (
              <User size={28} color="#555" strokeWidth={2} />
            )}
          </View>

          <View>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              {userData?.name || 'User'}
            </Text>
            <Text style={{ fontSize: 14,fontWeight:'600', color: '#3F83F8' }}>View Profile</Text>
          </View>
        </TouchableOpacity>

        <DrawerItem
          label="Assets"
          icon={<Asset height={20} width={24} color="#444" strokeWidth={1.8} />}
          onPress={() => {
            closeDrawer();
            navigation.navigate('AssetsScreen');
          }}
        />

        <DrawerItem
          label="Journaling"
          icon={<Journaling height={20} width={24} color="#444" strokeWidth={1.8} />}
          onPress={() => {
            closeDrawer();
            navigation.navigate('Journaling');
          }}
        />

        <DrawerItem
          label="Water Track"
          icon={<WaterTracker height={20} width={24} color="#444" strokeWidth={1.8} />}
          onPress={() => {
            closeDrawer();
            navigation.navigate('WaterTracker');
          }}
        />

        <DrawerItem
          label="Payslip"
          icon={<PaySlip height={20} width={24} color="#444" strokeWidth={1.8} />}
          onPress={() => {
            closeDrawer();
            navigation.navigate('PaySlip');
          }}
        />

        {isMentor ? (
          <>
            <DrawerItem
              label="Pending Leaves"
              icon={<PendingIcon color="#444" strokeWidth={1.8} />}
              onPress={() => {
                closeDrawer();
                navigation.navigate('PendingLeaves');
              }}
            />

            <DrawerItem
              label="Team Leave History"
              icon={<TeamLeaveHistoryIcon color="#444" strokeWidth={1.8} />}
              onPress={() => {
                closeDrawer();
                navigation.navigate('TeamLeaveHistory');
              }}
            />
          </>
        ) : (
          <>
            <DrawerItem
              label="Request Leave"
              icon={<RequestLeave height={20} width={24} color="#444" strokeWidth={1.8} />}
              onPress={() => {
                closeDrawer();
                navigation.navigate('RequestLeave');
              }}
            />

            <DrawerItem
              label="Leave History"
              icon={<LeaveHistory height={20} width={24} color="#444" strokeWidth={1.8} />}
              onPress={() => {
                closeDrawer();
                navigation.navigate('MyLeaveHistory');
              }}
            />
          </>
        )}
        <DrawerItem
          label="Chatbot"
          icon={
            <ChatBot height={20} width={24} color="#444" strokeWidth={1.8} />
          }
          onPress={() => {
            closeDrawer();
            navigation.navigate('Chat');
          }}
        />
      </View>

      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 12,
          borderTopWidth: 1,
          borderColor: '#eee',
        }}
        onPress={() => logoutUser(navigation)}
      >
        <LogOut size={20} color="#d9534f" strokeWidth={2} />
        <Text
          style={{
            fontSize: 18,
            marginLeft: 12,
            color: '#d9534f',
            fontWeight: '600',
          }}
        >
          Logout
        </Text>
      </TouchableOpacity>
      {isLogoutLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.35)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
          }}
        >
          <View
            style={{
              padding: 25,
              backgroundColor: '#fff',
              borderRadius: 10,
              elevation: 10,
              width: 130,
              alignItems: 'center',
            }}
          >
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text
              style={{
                marginTop: 10,
                color: COLORS.textPrimary,
                fontSize: 16,
                textAlign: 'center',
              }}
            >
              Logging out...
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

type DrawerItemProps = {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
};

const DrawerItem: React.FC<DrawerItemProps> = ({ label, icon, onPress }) => (
  <TouchableOpacity
    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}
    onPress={onPress}
  >
    {icon}
    <Text style={{ fontSize: 18, marginLeft: 12 }}>{label}</Text>
  </TouchableOpacity>
);

export default DrawerContent;
