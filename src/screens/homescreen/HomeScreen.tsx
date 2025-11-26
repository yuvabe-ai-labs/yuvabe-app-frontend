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
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
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

  //
  const drawerWidth = 300; // half screen or any width you want
  const drawerX = useSharedValue(-drawerWidth); // hidden initially

  const openDrawer = () => {
    drawerX.value = withTiming(0, { duration: 300 });
  };

  const closeDrawer = () => {
    drawerX.value = withTiming(-drawerWidth, { duration: 300 });
  };

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: drawerX.value }],
  }));

  //
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
              <TouchableOpacity onPress={openDrawer}>
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
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 50,
          }}
          pointerEvents="box-none"
        >
          {drawerX.value === 0 && (
            <TouchableOpacity
              onPress={closeDrawer}
              activeOpacity={1}
              style={{
                position: 'absolute',
                top: 0,
                left: drawerWidth, // <<< IMPORTANT FIX
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.3)',
              }}
            />
          )}

          <Animated.View
            pointerEvents="box-none"
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: drawerWidth,
                backgroundColor: 'white',
                elevation: 15,
                shadowColor: '#000',
                shadowOpacity: 0.2,
                shadowRadius: 10,
                paddingTop: 0,
              },
              drawerStyle,
            ]}
          >
            <SafeAreaView style={{ flex: 1, padding: 20 }}>
              {/* Profile section in the drawer */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 30,
                }}
              >
                <Image
                  source={{
                    uri: profileImage || 'https://i.pravatar.cc/150?img=3',
                  }}
                  style={{
                    width: 55,
                    height: 55,
                    borderRadius: 30,
                    marginRight: 12,
                  }}
                />

                <View>
                  <Text
                    style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}
                  >
                    {user?.user.name || 'User'}
                  </Text>
                  <Text style={{ fontSize: 14, color: '#666' }}>
                    View Profile
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={{ marginBottom: 20 }}
                onPress={() => {
                  closeDrawer();
                  navigation.navigate('Profile');
                }}
              >
                <Text style={{ fontSize: 18 }}>Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  closeDrawer();
                  navigation.navigate('RequestLeave');
                }}
              >
                <Text style={{ fontSize: 18 }}>Request Leave</Text>
              </TouchableOpacity>
            </SafeAreaView>
          </Animated.View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default HomeScreen;
