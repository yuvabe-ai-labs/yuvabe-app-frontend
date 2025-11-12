import React, { useState } from 'react';
import {
  Button,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as ImagePicker from 'react-native-image-picker';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles, { GAP, TILE_WIDTH } from './VisionBoardStyles';

interface TileProps {
  id: string;
  height: number;
  index: number;
  editMode: boolean;
  onDelete: (id: string) => void;
  onDragEnd: (fromIndex: number, toIndex: number) => void;
  tiles: any[];
  setScrollingEnabled?: (enabled: boolean) => void;
  imageUrl?: string | null;
  label?: string;
  onUpdate: (
    id: string,
    data: { imageUrl?: string | null; label?: string },
  ) => void;
}

const COLUMN_COUNT = 2;

const Tile: React.FC<TileProps> = ({
  id,
  height,
  index,
  editMode,
  onDelete,
  onDragEnd,
  tiles,
  setScrollingEnabled,
  imageUrl,
  label,
  onUpdate,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState(imageUrl || '');
  const [tempLabel, setTempLabel] = useState(label || '');

  const x = useSharedValue(0);
  const y = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      setScrollingEnabled && runOnJS(setScrollingEnabled)(false);
    })
    .onUpdate(event => {
      x.value = event.translationX;
      y.value = event.translationY;
    })
    .onEnd(() => {
      const row = Math.round(y.value / (height + GAP));
      const col = Math.round(x.value / (TILE_WIDTH + GAP));
      let toIndex = index + row * COLUMN_COUNT + col;
      if (toIndex < 0) toIndex = 0;
      if (toIndex >= tiles.length) toIndex = tiles.length - 1;
      runOnJS(onDragEnd)(index, toIndex);

      x.value = withSpring(0);
      y.value = withSpring(0);
      setScrollingEnabled && runOnJS(setScrollingEnabled)(true);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }));

  const pickImage = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, response => {
      if (!response.didCancel && response.assets?.[0]?.uri) {
        setTempImageUrl(response.assets[0].uri);
      }
    });
  };

  const handleSave = () => {
    onUpdate(id, { imageUrl: tempImageUrl, label: tempLabel });
    setModalVisible(false);
  };

  return (
    <>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.tile, { height }, animatedStyle]}>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
            onPress={() => setModalVisible(true)}
            disabled={editMode}
          >
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            ) : (
              <Text style={{ color: '#444' }}>{label || `Tile ${id}`}</Text>
            )}
          </TouchableOpacity>

          {editMode && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDelete(id)}
            >
              <Icon name="delete" size={18} color="#fff" />
            </TouchableOpacity>
          )}
        </Animated.View>
      </GestureDetector>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              padding: 20,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }}>
              Edit Tile
            </Text>

            <Button title="Upload Image" onPress={pickImage} />
            <TextInput
              placeholder="or enter Image URL"
              value={tempImageUrl}
              placeholderTextColor="#888"
              onChangeText={setTempImageUrl}
              style={{
                borderWidth: 1,
                textDecorationColor: 'grey',
                textShadowColor: 'grey',
                borderColor: '#ccc',
                borderRadius: 6,
                marginTop: 10,
                padding: 8,
                color: '#000',
              }}
            />

            <TextInput
              placeholder="Tile Label"
              placeholderTextColor="#888"
              value={tempLabel}
              onChangeText={setTempLabel}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 6,
                marginTop: 10,
                padding: 8,
                color: '#000',
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 15,
              }}
            >
              <Button
                title="Cancel"
                color="red"
                onPress={() => setModalVisible(false)}
              />
              <Button title="Save" onPress={handleSave} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Tile;
