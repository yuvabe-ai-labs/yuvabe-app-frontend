import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { fetchUserDetails } from '../../api/auth-api/authApi';
import { getItem, setItem } from '../../store/storage';
import styles from './HomeStyles';
import CalmingAudio from './components/CalmingAudio';
import VisionBoard from './components/VisionBoard';

const HomeScreen = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [quote, setQuote] = useState<string>('');
  const [author, setAuthor] = useState<string>('');

  // user details from login
  const [user, setUser] = useState<any>(null);
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
  //
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
          source={{ uri: profileImage || 'https://i.pravatar.cc/150?img=3' }}
          style={styles.profileImage}
        />
        <Text style={styles.welcomeText}>
          Welcome, {user?.user.name || 'Loading...'}
        </Text>
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
      <View style={{ width: '100%' }}>
        <CalmingAudio />
      </View>

      <View style={{ width: '100%' }}>
        <VisionBoard setScrollingEnabled={setScrollEnabled} />
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
