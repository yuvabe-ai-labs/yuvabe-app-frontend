import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { launchImageLibrary } from 'react-native-image-picker';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface Tile {
  id: string;
  uri?: string;
  quote?: string;
  x: number;
  y: number;
}

export default function VisionBoardDraggable() {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [tempQuote, setTempQuote] = useState('');
  const [tempImage, setTempImage] = useState<string | undefined>(undefined);

  const addTile = () => {
    setModalVisible(true);
  };

  const saveTile = () => {
    const newTile: Tile = {
      id: Math.random().toString(),
      uri: tempImage,
      quote: tempQuote,
      x: 50 + Math.random() * 150,
      y: 100 + Math.random() * 300,
    };
    setTiles(prev => [...prev, newTile]);
    setModalVisible(false);
    setTempQuote('');
    setTempImage(undefined);
  };

  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (!result.didCancel && result.assets && result.assets[0].uri) {
      setTempImage(result.assets[0].uri);
    }
  };

  const deleteTile = (id: string) => {
    setTiles(prev => prev.filter(t => t.id !== id));
  };
  const BOARD_HEIGHT = SCREEN_HEIGHT * 0.6;
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={{ height: BOARD_HEIGHT, backgroundColor: '#fafafa' }}>
        {tiles.map(tile => (
          <DraggableTile key={tile.id} tile={tile} onDelete={deleteTile} />
        ))}

        <TouchableOpacity style={styles.addButton} onPress={addTile}>
          <Icon name="add" size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add Vision Item</Text>

            <TouchableOpacity onPress={pickImage} style={styles.imagePickerBtn}>
              <Text>{tempImage ? 'Change Image' : 'Select Image'}</Text>
            </TouchableOpacity>

            <TextInput
              placeholder="Enter a quote or title"
              value={tempQuote}
              onChangeText={setTempQuote}
              style={styles.input}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={saveTile}>
                <Text style={styles.saveText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
}

function DraggableTile({
  tile,
  onDelete,
}: {
  tile: Tile;
  onDelete: (id: string) => void;
}) {
  const translateX = useSharedValue(tile.x);
  const translateY = useSharedValue(tile.y);

  const pan = Gesture.Pan()
    .onChange(event => {
      translateX.value += event.changeX;
      translateY.value += event.changeY;
    })
    .onFinalize(() => {});

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.tile, style]}>
        {tile.uri ? (
          <Image source={{ uri: tile.uri }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text>+</Text>
          </View>
        )}
        {tile.quote && (
          <View style={styles.quoteBox}>
            <Text style={styles.quoteText}>{tile.quote}</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => runOnJS(onDelete)(tile.id)}
        >
          <Icon name="delete" size={18} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  board: {
    flex: 1,
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    margin: 10,
    overflow: 'hidden',
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#007AFF',
    borderRadius: 50,
    padding: 14,
    elevation: 3,
  },
  tile: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#d3d3d3',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteBox: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 6,
    paddingHorizontal: 4,
  },
  quoteText: {
    fontSize: 10,
    color: '#333',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  deleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginVertical: 8,
  },
  imagePickerBtn: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  saveText: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
});
