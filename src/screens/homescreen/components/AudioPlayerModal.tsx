import {
  ChevronDown,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeOff,
} from 'lucide-react-native';
import React from 'react';
import {
  Animated,
  Easing,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './AudioPlayerStyles';

interface Props {
  visible: boolean;
  track: any | null;
  onClose: () => void;
  isPlaying: boolean;
  playTime: string;
  duration: string;
  onPlayPause: () => void;
  onReset: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}
const parseTime = (t: string) => {
  if (!t.includes(':')) return 0;
  const [m, s] = t.split(':').map(Number);
  return m * 60 + s;
};

const AudioPlayerModal: React.FC<Props> = ({
  visible,
  track,
  onClose,
  isPlaying,
  playTime,
  duration,
  onPlayPause,
  onReset,
  isMuted,
  onToggleMute,
}) => {
  const translateY = React.useRef(new Animated.Value(400)).current;
  const [isMounted, setIsMounted] = React.useState(visible);
  const overlayOpacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      setIsMounted(true);

      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();

      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();

      Animated.timing(translateY, {
        toValue: 400,
        duration: 400,
        easing: Easing.in(Easing.exp),
        useNativeDriver: true,
      }).start(() => setIsMounted(false));
    }
  }, [visible, translateY, overlayOpacity]);

  if (!isMounted || !track) return null;

  return (
    <Modal
      visible={isMounted}
      animationType="none"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalRoot}>
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>

        <Animated.View
          style={[styles.container, { transform: [{ translateY }] }]}
        >
          <TouchableOpacity style={styles.header} onPress={onClose}>
            <ChevronDown width={24} height={24} />
            <Text style={styles.headerText}>{track.title}</Text>
            <View style={styles.headerSpacer} />
          </TouchableOpacity>

          <Image source={track.thumbnail} style={styles.image} />

          <Text style={styles.title}>{track.title}</Text>
          <Text style={styles.author}>{track.author}</Text>

          <View style={styles.trackContainer}>
            <View
              style={[
                styles.trackProgress,
                {
                  width: `${(parseTime(playTime) / parseTime(duration)) * 100}%`,
                },
              ]}
            />
          </View>

          <View style={styles.progressWrapper}>
            <Text style={styles.timestamp}>{playTime}</Text>
            <Text style={styles.timestamp}>{duration}</Text>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity onPress={onToggleMute}>
              {isMuted ? (
                <VolumeOff width={24} height={24} />
              ) : (
                <Volume2 width={24} height={24} />
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={onPlayPause}>
              {isPlaying ? (
                <View style={styles.playButton}>
                  <Pause color="white" size={32} />
                </View>
              ) : (
                <View style={styles.playButton}>
                  <Play height={32} width={32} color="white" />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={onReset}>
              <RotateCcw width={24} height={24} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default AudioPlayerModal;
