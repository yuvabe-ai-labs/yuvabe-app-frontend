import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSound } from 'react-native-nitro-sound';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../HomeStyles';

const tracks = [
  {
    id: 'wellness',
    url: 'http://192.168.68.184:8080/static/audio/PQReps.mp3',
    title: 'PQ Reps',
  },
  {
    id: 'selfRealisation',
    url: 'http://192.168.68.184:8080/static/audio/MindfullnessExcercise.mp3',
    title: 'Mindfull Meditation',
  },
];

const CalmingAudio = () => {
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const { state, startPlayer, pausePlayer, resumePlayer, stopPlayer } =
    useSound({
      subscriptionDuration: 0.2,
    });

  const formatToMMSS = (ms: number) => {
    if (!ms || ms < 0) return '00:00';
    const sec = Math.floor(ms / 1000);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = async (track: any) => {
    if (!isPlaying) {
      if (currentTrack !== track.id) {
        await stopPlayer();
        setCurrentTrack(track.id);
        await startPlayer(track.url);
      } else {
        await resumePlayer();
      }
      setIsPlaying(true);
    } else {
      await pausePlayer();
      setIsPlaying(false);
    }
  };

  const handleReset = async () => {
    await stopPlayer();
    setIsPlaying(false);
    setCurrentTrack(null);
  };

  return (
    <View style={styles.audioContainer}>
      <Text style={styles.audioTitle}>Would you like to hear calming audio?</Text>

      {tracks.map(track => {
        const isActive = currentTrack === track.id;

        const currentTime = isActive
          ? formatToMMSS(state.currentPosition)
          : '00:00';

        const durationTime = formatToMMSS(state.duration);

        return (
          <View key={track.id} style={styles.audioItem}>
            <Text style={styles.audioItemTitle}>{track.title}</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <TouchableOpacity
                onPress={() => handlePlayPause(track)}
                style={{ marginRight: 16 }}
              >
                {isActive && isPlaying ? (
                  <Ionicons name="pause" size={24} color="black" />
                ) : (
                  <Ionicons name="play" size={24} color="black" />
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={handleReset}>
                <Ionicons name="stop" size={24} color="black" />
              </TouchableOpacity>

              <Text
                style={{
                  marginLeft: 'auto',
                  fontSize: 14,
                  color: '#444',
                }}
              >
                {currentTime} / {durationTime}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default CalmingAudio;
