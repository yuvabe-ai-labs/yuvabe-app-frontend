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

const HomeScreen = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [quote, setQuote] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  useEffect(() => {
    const fetchQuote = async () => {
      const today = new Date().toISOString().split('T')[0];

      try {
        const storedQuoteData = getItem('daily_quote');
        if (storedQuoteData) {
          const parsed = JSON.parse(storedQuoteData);

          if (parsed.date === today && parsed.success === true) {
            console.log('Using stored quote for today');
            setQuote(parsed.quote);
            setAuthor(parsed.author);
            return;
          }
        }

        console.log('Fetching new quote from API...');
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
        console.log('Stored new quote for today:', quoteData);

        setQuote(quoteData.quote);
        setAuthor(quoteData.author);
      } catch (error) {
        console.error('Error fetching or storing quote:', error);

        setQuote('“The only way to do great work is to love what you do.”');
        setAuthor('Steve Jobs');

        const today = new Date().toISOString().split('T')[0];
        const fallbackData = {
          quote: '“The only way to do great work is to love what you do.”',
          author: 'Steve Jobs',
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

      {/* <View style={styles.moodHistoryContainer}> */}
        {/* <Text style={styles.moodHistoryTitle}>Mood History / Mood Trend</Text> */}
        {/* <MoodMirrorChart /> */}
      {/* </View> */}
    </ScrollView>
  );
};

export default HomeScreen;
