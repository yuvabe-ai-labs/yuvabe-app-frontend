import * as RNFS from '@dr.pogodin/react-native-fs';
import { Pause, Play, Square } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Sound from 'react-native-nitro-sound';
import styles from '../HomeStyles';

const tracks = [
  {
    id: 'wellness',
    file: 'audio/MindfullnessExcercise.mp3',
    title: 'Mindfull Meditation',
  },
  {
    id: 'selfRealisation',
    file: 'audio/PQReps.mp3',
    title: 'PQ Reps',
  },
];

const formatMMSS = (ms: number) => {
  if (ms <= 0) return '00:00';

  const sec = Math.floor(ms / 1000);
  const mins = Math.floor(sec / 60);
  const seconds = sec % 60;

  return `${mins.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
};

const loadLocalAudioFile = async (assetPath: string): Promise<string> => {
  const fileName = assetPath.split('/').pop()!;
  const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

  const exists = await RNFS.exists(destPath);
  if (!exists) {
    await RNFS.copyFileAssets(assetPath, destPath);
  }

  return 'file://' + destPath;
};

const CalmingAudio = () => {
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [playTime, setPlayTime] = useState('00:00');
  const [duration, setDuration] = useState('00:00');

  useEffect(() => {
    return () => {
      Sound.removePlayBackListener();
      Sound.removePlaybackEndListener();
    };
  }, []);

  const startTrack = async (track: any) => {
    const localPath = await loadLocalAudioFile(track.file);

    await Sound.stopPlayer();

    await Sound.startPlayer(localPath);

    Sound.addPlayBackListener(e => {
      try {
        const pos = Math.floor(e.currentPosition);
        const dur = Math.floor(e.duration);

        setPlayTime(formatMMSS(pos));
        setDuration(formatMMSS(dur));
      } catch (err) {
        console.log('Timestamp error:', err);
      }
    });

    Sound.addPlaybackEndListener(() => {
      setIsPlaying(false);
      setPlayTime('00:00');
    });

    setCurrentTrack(track.id);
    setIsPlaying(true);
  };

  const handlePlayPause = async (track: any) => {
    if (!isPlaying) {
      await startTrack(track);
    } else {
      await Sound.pausePlayer();
      setIsPlaying(false);
    }
  };

  const handleReset = async () => {
    await Sound.stopPlayer();
    setIsPlaying(false);
    setCurrentTrack(null);
    setPlayTime('00:00');
    setDuration('00:00');

    Sound.removePlayBackListener();
    Sound.removePlaybackEndListener();
  };

  return (
    <View style={styles.audioContainer}>
      <Text style={styles.audioTitle}>
        Would you like to hear calming audio?
      </Text>

      {tracks.map(track => {
        const isActive = currentTrack === track.id;

        return (
          <View key={track.id} style={styles.audioItem}>
            <Text style={styles.audioItemTitle}>{track.title}</Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 8,
              }}
            >
              <TouchableOpacity
                onPress={() => handlePlayPause(track)}
                style={{ marginRight: 16 }}
              >
                {isActive && isPlaying ? (
                  <Pause size={24} color="black" strokeWidth={2} />
                ) : (
                  <Play size={24} color="black" strokeWidth={2} />
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={handleReset}>
                <Square size={24} color="black" strokeWidth={2} />
              </TouchableOpacity>

              {isActive ? (
                <Text
                  style={{ marginLeft: 'auto', fontSize: 14, color: '#444' }}
                >
                  {playTime} / {duration}
                </Text>
              ) : (
                <Text
                  style={{ marginLeft: 'auto', fontSize: 14, color: '#444' }}
                >
                  00:00 / 00:00
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default CalmingAudio;
