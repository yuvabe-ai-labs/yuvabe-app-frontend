import messaging from '@react-native-firebase/messaging';
import {
  Bell,
  Box,
  Clock,
  FilePlus,
  History,
  Menu,
  User,
  Users,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Image,
  PermissionsAndroid,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchUserDetails, submitEmotion } from '../../api/auth-api/authApi';
import { registerDevice } from '../../api/profile-api/profileApi';
import AppDrawer from '../../components/AppDrawer';
import { getItem, removeItem, setItem } from '../../store/storage';
import { COLORS } from '../../utils/theme';
import styles from './HomeStyles';
import CalmingAudio from './components/CalmingAudio';
import EmotionCheckIn from './components/EmotionCheckIn';
import FloatingActionButton from './components/FloatingActionButton';
import VisionBoard from './components/VisionBoard';

export async function requestNotificationPermission() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    console.log('Android Permission:', granted);
  }

  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  console.log('Firebase permission:', enabled);

  return enabled;
}

const HomeScreen = ({ navigation }: any) => {
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [homeAlertMessage, setHomeAlertMessage] = useState('');

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [quote, setQuote] = useState<string>('');
  const [author, setAuthor] = useState<string>('');

  const [user, setUser] = useState<any>(null);

  const EMOJI_MAP: { [key: string]: number } = {
    '😀': 1,
    '🙂': 2,
    '😐': 3,
    '😕': 4,
    '😢': 5,
    '😡': 6,
    '🤯': 7,
  };

  const role = user?.user?.role ?? 'user';
  const isMentor = role === 'mentor';

  //
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchUserDetails();
        removeItem('profile_image');
        setProfileImage(null);

        console.log('PROFILE IMAGE = ', profileImage);

        setUser(userData);
      } catch (error) {
        console.error('Error loading user details:', error);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    registerDevice();
  }, []);

  useEffect(() => {
    const fetchQuote = async () => {
      const today = new Date().toISOString().split('T')[0];

      try {
        const storedQuoteData = getItem('daily_quote');
        if (storedQuoteData) {
          const parsed = JSON.parse(storedQuoteData);

          if (parsed.date === today && parsed.success === true) {
            setQuote(parsed.quote);
            setAuthor(parsed.author);
            return;
          }
        }

        const response = await fetch('https://quotes.domiadi.com/api');
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        const quoteData = {
          quote: data.quote,
          author: data.from,
          date: today,
          success: true,
        };

        setItem('daily_quote', JSON.stringify(quoteData));

        setQuote(quoteData.quote);
        setAuthor(quoteData.author);
      } catch (error) {
        console.error('Error fetching or storing quote:', error);

        setQuote('The only way to do great work is to love what you do.');
        setAuthor('Steve Jobs');

        const fallbackData = {
          quote: quote,
          author: author,
          date: today,
          success: false,
        };
        setItem('daily_quote', JSON.stringify(fallbackData));
      }
    };

    fetchQuote();
  }, []);

  useEffect(() => {
    const savedImage = getItem('profile_image');
    if (savedImage) {
      setProfileImage(savedImage);
    } else {
      setProfileImage(null);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if ((globalThis as any).homeAlert?.visible) {
        setHomeAlertMessage((globalThis as any).homeAlert.message);
        setShowNotificationModal(true);

        (globalThis as any).homeAlert.visible = false;
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  const drawerUI = (closeDrawer: any) => (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      {/* PROFILE HEADER */}
      <TouchableOpacity
        onPress={() => {
          closeDrawer();
          navigation.navigate('Profile');
        }}
        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}
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
            {user?.user?.name || 'User'}
          </Text>
          <Text style={{ fontSize: 14, color: '#666' }}>View Profile</Text>
        </View>
      </TouchableOpacity>

      {/* Assets */}
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}
        onPress={() => {
          closeDrawer();
          navigation.navigate('AssetsScreen');
        }}
      >
        <Box size={20} color="#444" strokeWidth={1.8} />
        <Text style={{ fontSize: 18, marginLeft: 12 }}>Assets</Text>
      </TouchableOpacity>

      {/* MENTOR ITEMS */}
      {isMentor ? (
        <>
          {/* Pending Leaves */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,
            }}
            onPress={() => {
              closeDrawer();
              navigation.navigate('PendingLeaves');
            }}
          >
            <Clock size={20} color="#444" strokeWidth={1.8} />
            <Text style={{ fontSize: 18, marginLeft: 12 }}>Pending Leaves</Text>
          </TouchableOpacity>

          {/* Team Leave History */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,
            }}
            onPress={() => {
              closeDrawer();
              navigation.navigate('TeamLeaveHistory');
            }}
          >
            <Users size={20} color="#444" strokeWidth={1.8} />
            <Text style={{ fontSize: 18, marginLeft: 12 }}>
              Team Leave History
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Request Leave */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,
            }}
            onPress={() => {
              closeDrawer();
              navigation.navigate('RequestLeave');
            }}
          >
            <FilePlus size={20} color="#444" strokeWidth={1.8} />
            <Text style={{ fontSize: 18, marginLeft: 12 }}>Request Leave</Text>
          </TouchableOpacity>

          {/* Leave History */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,
            }}
            onPress={() => {
              closeDrawer();
              navigation.navigate('MyLeaveHistory');
            }}
          >
            <History size={20} color="#444" strokeWidth={1.8} />
            <Text style={{ fontSize: 18, marginLeft: 12 }}>Leave History</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );

  return (
    <AppDrawer drawerContent={drawerUI}>
      {(openDrawer: any) => (
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
          <View style={{ flex: 1 }}>
            <Animated.ScrollView
              style={styles.container}
              contentContainerStyle={{ paddingBottom: 80 }}
              showsVerticalScrollIndicator={false}
              scrollEnabled={scrollEnabled}
            >
              {/* HEADER */}
              <View style={styles.header}>
                {/* Hamburger Icon */}
                <TouchableOpacity onPress={openDrawer}>
                  <Menu size={28} color="#000" strokeWidth={1.7} />
                </TouchableOpacity>

                {/* Welcome Text */}
                <Text style={styles.welcomeText}>
                  Welcome, {user?.user.name || 'Loading...'}
                </Text>

                {/* Notification Bell */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 'auto',
                  }}
                >
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Notifications')}
                  >
                    <Bell size={28} color={COLORS.secondary} strokeWidth={2} />
                  </TouchableOpacity>

                  <Image
                    source={require('../../assets/logo/yuvabe-logo.png')}
                    style={{
                      width: 40,
                      height: 40,
                      resizeMode: 'contain',
                      marginLeft: 10,
                    }}
                  />
                </View>
              </View>

              {/* Thought */}
              <View style={styles.thoughtContainer}>
                <Text style={styles.thoughtTitle}>Thought of the Day</Text>
                <Text style={styles.thoughtText}>"{quote}"</Text>
                <Text
                  style={[
                    styles.thoughtText,
                    { fontStyle: 'italic', fontSize: 14 },
                  ]}
                >
                  — {author}
                </Text>
              </View>

              <CalmingAudio />
              <VisionBoard setScrollingEnabled={setScrollEnabled} />
            </Animated.ScrollView>
          </View>

          {showNotificationModal && (
            <EmotionCheckIn
              visible={showNotificationModal}
              message={homeAlertMessage}
              onClose={() => setShowNotificationModal(false)}
              onSelect={async emoji => {
                setShowNotificationModal(false);
                const emojiNumber = emoji ? EMOJI_MAP[emoji] : null;
                try {
                  const timeOfDay = homeAlertMessage.includes('morning')
                    ? 'morning'
                    : 'evening';
                  await submitEmotion(user?.user.id, emojiNumber, timeOfDay);
                } catch (err) {
                  console.error('Emotion submit failed', err);
                }
              }}
            />
          )}

          <FloatingActionButton onPress={() => navigation.navigate('Chat')} />
        </SafeAreaView>
      )}
    </AppDrawer>
  );
};

export default HomeScreen;
