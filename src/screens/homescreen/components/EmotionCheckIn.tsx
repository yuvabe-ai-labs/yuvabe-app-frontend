import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface Props {
  visible: boolean;
  message: string;
  onClose: () => void;
  onSelect: (emoji: string | null) => void;
}

const EMOJIS = ['😄', '😀', '🙂', '😐', '😢', '😡', '🤯'];
const EMOJI_LABELS: Record<string, string> = {
  '😄': 'Joyful',
  '😀': 'Happy',
  '🙂': 'Calm',
  '😐': 'Neutral',
  '😢': 'Anxious',
  '😡': 'Sad',
  '🤯': 'Frustrated',
};

const EmotionCheckIn: React.FC<Props> = ({
  visible,
  message,
  onClose,
  onSelect,
}) => {
  if (!visible) return null;

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback>
          <View style={styles.container}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>✖</Text>
            </TouchableOpacity>
            <Text style={styles.message}>{message}</Text>

            <View style={styles.emojiRow}>
              {EMOJIS.map((emoji, index) => (
                <View key={index} style={styles.emojiWrapper}>
                  <TouchableOpacity
                    onPress={() => onSelect(emoji)}
                    style={styles.emojiButton}
                  >
                    <Text style={styles.emojiText}>{emoji}</Text>
                  </TouchableOpacity>
                  <Text style={styles.emojiLabel}>{EMOJI_LABELS[emoji]}</Text>
                </View>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default EmotionCheckIn;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emojiWrapper: {
    alignItems: 'center',
    margin: 5,
  },
  emojiLabel: {
    fontSize: 12,
    color: '#555',
    marginTop: 3,
  },

  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 14,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  closeText: {
    fontSize: 20,
    color: '#000',
  },
  message: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  emojiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emojiButton: {
    margin: 5,
  },
  emojiText: {
    fontSize: 25,
  },
  nullButton: {
    marginTop: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nullIcon: {
    fontSize: 26,
  },
});
