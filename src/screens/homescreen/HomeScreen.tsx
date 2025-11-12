import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getItem, setItem, storage } from '../../store/storage';
import styles from './HomeStyles';
import VisionBoard from './components/VisionBoard';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const HomeScreen = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [quote, setQuote] = useState<string>('');
  const [author, setAuthor] = useState<string>('');

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch(
          'https://api.api-ninjas.com/v2/quoteoftheday',
          {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': 'jsKcV9bT/AviMFilwrVMRA==xDRMRVCM3HswFL46',
            },
          },
        );
        const data = await response.json();
        setQuote(data[0].quote);
        setAuthor(data[0].author);
      } catch (error) {
        console.error('Error fetching quote:', error);
        setQuote('“The only way to do great work is to love what you do.”');
        setAuthor('Steve Jobs');
      }
    };

    fetchQuote();
  }, []);

  useEffect(() => {
    const savedImage = getItem('profile_image');
    if (savedImage) {
      setProfileImage(savedImage);
    } else {
      const defaultImage = 'https://i.pravatar.cc/150?img=2';
      setProfileImage(defaultImage);
      setItem('profile_image', defaultImage);
    }
    console.log('Stored keys:', storage.getAllKeys());
    console.log('Profile image:', storage.getString('profile_image'));
  }, []);

  const checkNotificationTime = () => {
    const now = new Date();
    const hours = now.getHours();
    setShowNotification(
      (hours >= 9 && hours < 10) || (hours >= 22 && hours < 23),
    );
  };

  useEffect(() => {
    checkNotificationTime();
    const interval = setInterval(checkNotificationTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleMoodSelect = (mood: string) => {
    console.log('Selected mood:', mood);
    setShowNotification(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 80,
      }}
      showsVerticalScrollIndicator={false}
      scrollEnabled={scrollEnabled}
    >
      <View style={styles.header}>
        <Image
          source={{ uri: profileImage || 'https://i.pravatar.cc/150?img=1' }}
          style={styles.profileImage}
        />
        <Text style={styles.welcomeText}>Welcome, Venkat</Text>
      </View>

      <View style={styles.thoughtContainer}>
        <Text style={styles.thoughtTitle}>Thought of the Day</Text>
        <Text style={styles.thoughtText}>"{quote}"</Text>
        <Text
          style={[styles.thoughtText, { fontStyle: 'italic', fontSize: 14 }]}
        >
          — {author}
        </Text>
      </View>
      {showNotification && (
        <View style={styles.notificationCard}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationTitle}>
              How are you feeling today?
            </Text>
            <TouchableOpacity onPress={() => setShowNotification(false)}>
              <Text style={styles.closeButton}>✖</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.emojiContainer}>
            {['😄', '🙂', '😐', '🙁', '😞'].map((emoji, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleMoodSelect(emoji)}
                style={styles.emojiButton}
              >
                <Text style={styles.emoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={{ width: '100%' }}>
        <VisionBoard setScrollingEnabled={setScrollEnabled} />
      </View>

      <View style={styles.moodHistoryContainer}>
        <Text style={styles.moodHistoryTitle}>Mood History / Mood Trend</Text>
        {/* <MoodMirrorChart /> */}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
