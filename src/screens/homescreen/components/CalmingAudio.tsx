import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSound } from 'react-native-nitro-sound';
import styles from '../HomeStyles';

const tracks = [
  {
    id: 'wellness',
    url: 'http://192.168.0.108:8080/static/audio/PQReps.mp3',
    title: 'Wellness Healing Audio',
  },
  {
    id: 'selfRealisation',
    url: 'http://192.168.0.108:8080/static/audio/MindfullnessExcercise.mp3',
    title: 'Self Realisation Audio',
  },
];

const CalmingAudio = () => {
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);

  const {
    sound,
    state,
    startPlayer,
    pausePlayer,
    resumePlayer,
    stopPlayer,
    seekToPlayer,
    mmssss,
  } = useSound({
    subscriptionDuration: 0.1,
  });

  const playTrack = async (track: any) => {
    if (currentTrack !== track.id) {
      await stopPlayer();
      setCurrentTrack(track.id);
      await startPlayer(track.url);
    } else {
      await stopPlayer();
      await startPlayer(track.url);
    }
  };

  const resetTrack = async () => {
    await stopPlayer();
    setCurrentTrack(null);
  };

  return (
    <View style={styles.audioContainer}>
      <Text style={styles.audioTitle}>Would you like to hear calming audio?</Text>

      {tracks.map(track => (
        <View key={track.id} style={styles.audioItem}>
          <Text style={styles.audioItemTitle}>{track.title}</Text>

          <Text style={{ marginBottom: 10, color: '#444' }}>
            {mmssss(Math.floor(state.currentPosition))} /{' '}
            {mmssss(Math.floor(state.duration))}
          </Text>

          <View style={styles.audioControls}>
            <TouchableOpacity
              onPress={() => playTrack(track)}
              style={styles.audioButton}
            >
              <Text style={styles.audioButtonText}>▶️ Play</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={pausePlayer} style={styles.audioButton}>
              <Text style={styles.audioButtonText}>⏸ Pause</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={resumePlayer} style={styles.audioButton}>
              <Text style={styles.audioButtonText}>⏯ Resume</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={resetTrack}>
              <Text style={styles.audioButtonText}>⏹ Reset</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => seekToPlayer(10000)}
            style={{ marginTop: 8 }}
          >
            <Text style={[styles.audioButtonText, { fontSize: 14 }]}>
              ⏩ Seek to 10s
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default CalmingAudio;
