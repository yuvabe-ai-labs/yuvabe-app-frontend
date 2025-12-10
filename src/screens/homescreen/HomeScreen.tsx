'use client';

import messaging from '@react-native-firebase/messaging';
import { Bell, Menu } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import { submitEmotion } from '../../api/auth-api/authApi';
import {
  fetchProfileDetails,
  registerDevice,
} from '../../api/profile-api/profileApi';
import AppDrawer from '../../components/AppDrawer';
import DrawerContent from '../../components/DrawerContent';
import { getItem, setItem } from '../../store/storage';
import { useUserStore } from '../../store/useUserStore';
import { COLORS } from '../../utils/theme';
import styles from './HomeStyles';
import BreathingModal from './components/BreathingModal';
import CalmingAudio from './components/CalmingAudio';
import EmotionCheckIn from './components/EmotionCheckIn';
import GroundingExerciseModal from './components/GroundingExerciseModal';
import VisionBoard from './components/VisionBoard';

export async function requestNotificationPermission() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }

  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  return enabled;
}

const HomeScreen = ({ navigation }: any) => {
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showGroundingModal, setShowGroundingModal] = useState(false);
  const [showBreathingModal, setShowBreathingModal] = useState(false);
  const [homeAlertMessage, setHomeAlertMessage] = useState('');
  const [, setProfileImage] = useState<string | null>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [quote, setQuote] = useState<string>('');
  const [author, setAuthor] = useState<string>('');

  const user = useUserStore(state => state.user);
  const isLogoutLoading = useUserStore(state => state.isLogoutLoading);
  const { setProfileDetails } = useUserStore();
  const userMail = getItem('logged_in_email');

  const EMOJI_TO_EMOTION: Record<string, string> = {
    '😄': 'joyful',
    '😀': 'happy',
    '🙂': 'calm',
    '😐': 'neutral',
    '😢': 'anxious',
    '😡': 'sad',
    '🤯': 'frustrated',
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    const savedImage = getItem('profile_image');
    if (savedImage) {
      setProfileImage(savedImage);
    }
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

        const response = await fetch(
          'https://motivational-spark-api.vercel.app/api/quotes/random', // if not try https://quotes.domiadi.com/api
        );
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        const quoteData = {
          quote: data.quote,
          author: data.author,
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
  }, [author, quote]);

  useEffect(() => {
    const loadProfileDetails = async () => {
      try {
        const res = await fetchProfileDetails();
        if (res.code === 200) {
          setProfileDetails(res.data);
        }
      } catch (err) {
        console.log('Profile fetch failed in HomeScreen:', err);
      }
    };

    loadProfileDetails();
  }, [setProfileDetails]);

  useEffect(() => {
    const timer = setTimeout(() => {
      registerDevice().catch(err =>
        console.log('Device registration failed:', err),
      );
    }, 1000);

    return () => clearTimeout(timer);
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

  return (
    <AppDrawer
      drawerContent={(closeDrawer: any) => (
        <DrawerContent navigation={navigation} closeDrawer={closeDrawer} />
      )}
    >
      {(openDrawer: any, isDrawerOpen: boolean) => (
        <SafeAreaView style={{ flex: 1 }}>
          {isDrawerOpen && (
            <View style={styles.dimOverlay} pointerEvents="none" />
          )}
          <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
          <View style={{ flex: 1 }}>
            <Animated.ScrollView
              style={styles.container}
              contentContainerStyle={{ paddingBottom: 80 }}
              showsVerticalScrollIndicator={false}
              scrollEnabled={scrollEnabled}
            >
              <View
                style={[styles.header, { justifyContent: 'space-between' }]}
              >
                <TouchableOpacity onPress={openDrawer}>
                  <Menu size={28} color="#000" strokeWidth={1.7} />
                </TouchableOpacity>

                <Image
                  source={require('../../assets/logo/yuvabe-logo.png')}
                  style={{ width: 45, height: 45, resizeMode: 'contain' }}
                />

                <TouchableOpacity
                  onPress={() => navigation.navigate('Notifications')}
                >
                  <Bell size={28} color={COLORS.secondary} strokeWidth={2} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.welcomeText]}>
                Welcome, {user?.name || 'Loading...'}
              </Text>

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
              {(userMail || user?.email) && (
                <VisionBoard
                  userEmail={userMail ?? user?.email}
                  setScrollingEnabled={setScrollEnabled}
                />
              )}
            </Animated.ScrollView>
          </View>

          {showNotificationModal && (
            <EmotionCheckIn
              visible={showNotificationModal}
              message={homeAlertMessage}
              onClose={() => setShowNotificationModal(false)}
              onSelect={async emoji => {
                setShowNotificationModal(false);
                const emotion = emoji ? EMOJI_TO_EMOTION[emoji] : null;

                try {
                  if (!user?.id) {
                    console.error('User ID not available');
                    return;
                  }

                  const timeOfDay = homeAlertMessage.includes('morning')
                    ? 'morning'
                    : 'evening';
                  await submitEmotion(user.id, emotion, timeOfDay);
                } catch (err) {
                  console.error('Emotion submit failed', err);
                }

                setShowGroundingModal(true);
              }}
            />
          )}
          <GroundingExerciseModal
            visible={showGroundingModal}
            onDone={() => {
              setShowGroundingModal(false);
              setShowBreathingModal(true);
            }}
            onClose={() => setShowGroundingModal(false)}
          />
          <BreathingModal
            visible={showBreathingModal}
            onClose={() => setShowBreathingModal(false)}
            onFinish={() => setShowBreathingModal(false)}
          />

          {isLogoutLoading && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.3)',
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
                  elevation: 4,
                }}
              >
                <Text style={{ fontSize: 16, marginBottom: 15 }}>
                  Logging out...
                </Text>
                <ActivityIndicator size="large" color={COLORS.primary} />
              </View>
            </View>
          )}
        </SafeAreaView>
      )}
    </AppDrawer>
  );
};

export default HomeScreen;
