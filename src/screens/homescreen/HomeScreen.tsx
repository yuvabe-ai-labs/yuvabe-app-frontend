import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import styles from './HomeStyles';

const HomeScreen = () => {
  const [showNotification, setShowNotification] = useState(false);

  const checkNotificationTime = () => {
    const now = new Date();
    const hours = now.getHours();

    if ((hours >= 9 && hours < 10) || (hours >= 23 && hours < 24)) {
      setShowNotification(true);
    } else {
      setShowNotification(false);
    }
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=3' }}
          style={styles.profileImage}
        />
        <Text style={styles.welcomeText}>Welcome, User 1</Text>
      </View>

      <View style={styles.thoughtContainer}>
        <Text style={styles.thoughtTitle}>Thought of the Day</Text>
        <Text style={styles.thoughtText}>
          “The only way to do great work is to love what you do.” – Steve Jobs
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
            {['😄', '🙂', '😐', '🙁', '😞', '🙁', '😞'].map((emoji, index) => (
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

      <View style={styles.moodHistoryContainer}>
        <Text style={styles.moodHistoryTitle}>Mood History / Mood Trend</Text>
      </View>
    </View>
  );
};

export default HomeScreen;
