import * as RNFS from '@dr.pogodin/react-native-fs';
import { Pause } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Sound, { createSound } from 'react-native-nitro-sound';
import { getItem, removeItem, setItem } from '../../../store/storage';
import { Play } from '../../../utils/customIcons';
import styles from '../HomeStyles';
import AudioPlayerModal from './AudioPlayerModal';

const tracks = [
  {
    id: 'wellness',
    file: 'audio/MindfullnessExcercise.mp3',
    title: 'Mindfull Meditation',
    author: 'Dr. Adhitya Varma',
    thumbnail: require('../../../assets/images/Mindfull_Meditation.png'),
  },
  {
    id: 'selfRealisation',
    file: 'audio/PQReps.mp3',
    title: 'PQ Reps',
    author: 'Dr. Shankar',
    thumbnail: require('../../../assets/images/PQ_Reps.png'),
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
  const [trackDurations, setTrackDurations] = useState<Record<string, string>>(
    {},
  );
  const [paused, setPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playTime, setPlayTime] = useState('00:00');
  const [duration, setDuration] = useState('00:00');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);

  const openModal = track => {
    setSelectedTrack(track);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);
  const handleToggleMute = async () => {
    if (isMuted) {
      await Sound.setVolume(1);
    } else {
      await Sound.setVolume(0);
    }
    setIsMuted(prev => !prev);
  };
  useEffect(() => {
    return () => {
      Sound.removePlayBackListener();
      Sound.removePlaybackEndListener();
    };
  }, []);

  useEffect(() => {
    (async () => {
      for (const track of tracks) {
        const durMs = await preloadDuration(track);

        setTrackDurations(prev => ({
          ...prev,
          [track.id]: formatMMSS(durMs),
        }));
      }

      await Sound.setVolume(1);
    })();
  }, []);

  useEffect(() => {
    const last = getItem('lastPlayedTrack');
    if (!last) return;

    const saved = getItem(`audioProgress_${last}`);
    if (!saved) return;

    const { position, duration } = JSON.parse(saved);

    setCurrentTrack(last);
    setPlayTime(formatMMSS(position));
    setDuration(formatMMSS(duration));
    setPaused(true);
    setIsPlaying(false);
  }, []);

  const startTrack = async (track: any) => {
    Sound.removePlayBackListener();
    Sound.removePlaybackEndListener();

    const localPath = await loadLocalAudioFile(track.file);

    await Sound.stopPlayer();

    const saved = getItem(`audioProgress_${track.id}`);
    const savedPos = saved ? JSON.parse(saved).position : 0;

    await Sound.startPlayer(localPath);

    // Ensure correct volume when starting
    await Sound.setVolume(isMuted ? 0 : 1);

    if (savedPos > 0) {
      await Sound.seekToPlayer(savedPos);
    }

    Sound.addPlayBackListener(e => {
      try {
        const pos = Math.floor(e.currentPosition);
        const dur = Math.floor(e.duration);

        setPlayTime(formatMMSS(pos));
        setDuration(formatMMSS(dur));

        setItem(
          `audioProgress_${track.id}`,
          JSON.stringify({ position: pos, duration: dur }),
        );

        setItem('lastPlayedTrack', track.id);
      } catch {}
    });

    Sound.addPlaybackEndListener(() => {
      setIsPlaying(false);
      setPlayTime('00:00');
    });

    setCurrentTrack(track.id);
    setIsPlaying(true);
    setPaused(false);
  };

  const handlePlayPause = async (track: any) => {
    const saved = getItem(`audioProgress_${track.id}`);
    const isSameTrack = currentTrack === track.id;

    if (!saved || !isSameTrack) {
      await startTrack(track);
      setPaused(false);
      return;
    }

    const { position } = JSON.parse(saved);

    if (!isPlaying && paused) {
      Sound.removePlayBackListener();
      Sound.removePlaybackEndListener();

      const localPath = await loadLocalAudioFile(track.file);

      await Sound.startPlayer(localPath);
      await Sound.seekToPlayer(position);

      Sound.addPlayBackListener(e => {
        const pos = Math.floor(e.currentPosition);
        const dur = Math.floor(e.duration);

        setPlayTime(formatMMSS(pos));
        setDuration(formatMMSS(dur));

        setItem(
          `audioProgress_${track.id}`,
          JSON.stringify({ position: pos, duration: dur }),
        );

        setItem('lastPlayedTrack', track.id);
      });

      await Sound.resumePlayer();

      setIsPlaying(true);
      setPaused(false);
      return;
    }

    if (isPlaying) {
      await Sound.pausePlayer();
      setPaused(true);
      setIsPlaying(false);
      return;
    }
  };

  const handleReset = async () => {
    await Sound.stopPlayer();
    setIsPlaying(false);
    setPaused(false);
    setCurrentTrack(null);
    setPlayTime('00:00');
    setDuration('00:00');
    if (currentTrack) {
      removeItem(`audioProgress_${currentTrack}`);
    }

    Sound.removePlayBackListener();
    Sound.removePlaybackEndListener();
  };

  const preloadDuration = async (track: any) => {
    const localPath = await loadLocalAudioFile(track.file);

    const temp = createSound();
    await temp.setVolume(0);
    await temp.startPlayer(localPath);

    return new Promise<number>(resolve => {
      const listener = (e: any) => {
        const dur = Math.floor(e.duration);

        temp.removePlayBackListener();
        temp.stopPlayer();

        resolve(dur);
      };

      temp.addPlayBackListener(listener);
    });
  };

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Would you like to hear calming audio?</Text>

      {tracks.map(track => {
        const isActive = currentTrack === track.id;

        return (
          <View key={track.id}>
            {/* Row content */}
            <View style={styles.row}>
              <Image source={track.thumbnail} style={styles.thumbnail} />

              <TouchableOpacity
                style={styles.middle}
                onPress={() => openModal(track)}
              >
                <Text style={styles.title}>{track.title}</Text>
                <Text style={styles.author}>{track.author}</Text>

                <Text style={styles.time}>
                  {isActive
                    ? `${playTime} / ${duration}`
                    : (() => {
                        const saved = getItem(`audioProgress_${track.id}`);
                        if (!saved)
                          return `00:00 / ${trackDurations[track.id] ?? '00:00'}`;

                        const { position, duration } = JSON.parse(saved);
                        return `${formatMMSS(position)} / ${
                          duration
                            ? formatMMSS(duration)
                            : (trackDurations[track.id] ?? '00:00')
                        }`;
                      })()}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handlePlayPause(track)}>
                {isActive && isPlaying ? (
                  <Pause size={26} strokeWidth={2} />
                ) : (
                  <Play height={18} width={16} />
                )}
              </TouchableOpacity>
            </View>

            {track.id !== tracks[tracks.length - 1].id && (
              <View style={styles.separator} />
            )}
          </View>
        );
      })}
      <AudioPlayerModal
        visible={modalVisible}
        track={selectedTrack}
        onClose={closeModal}
        isPlaying={isPlaying}
        playTime={playTime}
        duration={duration}
        onPlayPause={() => handlePlayPause(selectedTrack)}
        onReset={handleReset}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />
    </View>
  );
};

export default CalmingAudio;
