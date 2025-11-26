import messaging from '@react-native-firebase/messaging';
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
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { scheduleOnRN } from 'react-native-worklets';
import { fetchUserDetails, submitEmotion } from '../../api/auth-api/authApi';
import { registerDevice } from '../../api/profile-api/profileApi';
import { getItem, setItem } from '../../store/storage';
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

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchUserDetails();
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

        const response = await fetch('https://quotes.domiadi.com/api'); // or try this https://motivational-spark-api.vercel.app/api/quotes/random
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
      const defaultImage = 'https://i.pravatar.cc/150?img=3';
      setProfileImage(defaultImage);
      setItem('profile_image', defaultImage);
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

  const panGesture = Gesture.Pan()
    .activeOffsetX(25)
    .failOffsetY([-5, 5])
    .onBegin(() => console.log('Begin Swipe'))
    .onUpdate(e => console.log('Move', e.translationX))
    .onEnd(e => {
      'worklet';
      console.log('End', e.translationX);
      if (e.translationX > 120) {
        scheduleOnRN(() => navigation.navigate('RequestLeave'));
      }
    });

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
        <View style={{ flex: 1 }}>
          <Animated.ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
            scrollEnabled={scrollEnabled}
          >
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Image
                  source={{
                    uri: profileImage || 'https://i.pravatar.cc/150?img=3',
                  }}
                  style={styles.profileImage}
                />
              </TouchableOpacity>

              <Text style={styles.welcomeText}>
                Welcome, {user?.user.name || 'Loading...'}
              </Text>

              <TouchableOpacity
                onPress={() => navigation.navigate('Notifications')}
              >
                <Ionicons name="notifications-outline" size={28} />
              </TouchableOpacity>
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

          <GestureDetector gesture={panGesture}>
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: 80,
                backgroundColor: 'transparent',
              }}
              hitSlop={{ left: 20, right: 20 }}
            />
          </GestureDetector>
        </View>

        {/* Modals */}
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
    </>
  );
};

export default HomeScreen;
