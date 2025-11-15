import React, { useState } from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { scheduleOnRN } from 'react-native-worklets';
import TileModal from './TileModal';
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
  onUpdate: (
    id: string,
    data: { imageUrl?: string | null; label?: string },
  ) => void;
  onLayoutTile?: (
    id: string,
    layout: { x: number; y: number; width: number; height: number },
  ) => void;
  tileLayouts?: React.RefObject<{
    [id: string]: { x: number; y: number; width: number; height: number };
  }>;
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
  onUpdate,
  onLayoutTile,
  tileLayouts,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const swapImages = (fromIndex: number, toIndex: number) => {
    const fromTile = tiles[fromIndex];
    const toTile = tiles[toIndex];
    const fromImage = fromTile.imageUrl;
    const toImage = toTile.imageUrl;

    onUpdate(fromTile.id, { imageUrl: toImage });
    onUpdate(toTile.id, { imageUrl: fromImage });
  };

  const imageX = useSharedValue(0);
  const imageY = useSharedValue(0);
  const zIndex = useSharedValue(0);
  const scale = useSharedValue(1);

  // image swap
  const imagePanGesture = Gesture.Pan()
    .onBegin(() => {
      zIndex.value = 100;
      scale.value = 1.05;
      setScrollingEnabled && scheduleOnRN(setScrollingEnabled, false);
    })
    .onUpdate(event => {
      imageX.value = event.translationX;
      imageY.value = event.translationY;
    })
    .onEnd(() => {
      zIndex.value = 0;
      scale.value = 1;
      const row = Math.round(imageY.value / (height + GAP));
      const col = Math.round(imageX.value / (TILE_WIDTH + GAP));
      let targetIndex = index + row * COLUMN_COUNT + col;

      if (targetIndex < 0) targetIndex = 0;
      if (targetIndex >= tiles.length) targetIndex = tiles.length - 1;

      if (targetIndex !== index) {
        scheduleOnRN(swapImages, index, targetIndex);
      }

      imageX.value = withSpring(0);
      imageY.value = withSpring(0);
      setScrollingEnabled && scheduleOnRN(setScrollingEnabled, true);
    });
  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: imageX.value }, { translateY: imageY.value }],
    zIndex: zIndex.value,
  }));

  // tile swap
  const tileX = useSharedValue(0);
  const tileY = useSharedValue(0);

  const tilePanGesture = Gesture.Pan()
    .onBegin(() => {
      zIndex.value = 100;
      scale.value = 1.05;
      setScrollingEnabled && scheduleOnRN(setScrollingEnabled, false);
    })
    .onUpdate(event => {
      tileX.value = event.translationX;
      tileY.value = event.translationY;
    })
    .onEnd(() => {
      zIndex.value = 0;
      scale.value = 1;
      if (!onLayoutTile || tiles.length < 2) {
        tileX.value = withSpring(0);
        tileY.value = withSpring(0);
        setScrollingEnabled && scheduleOnRN(setScrollingEnabled, true);
        return;
      }

      let closestIndex = index;
      let minDistance = Infinity;

      const dragCenterX = tileX.value + TILE_WIDTH / 2;
      const dragCenterY = tileY.value + height / 2;

      tiles.forEach((t, i) => {
        if (t.id === id) return;

        const layout = tileLayouts?.current[t.id];
        if (!layout) return;

        const centerX = layout.x + layout.width / 2;
        const centerY = layout.y + layout.height / 2;

        const distance = Math.hypot(
          dragCenterX - centerX,
          dragCenterY - centerY,
        );
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      });

      if (closestIndex !== index) {
        scheduleOnRN(onDragEnd, index, closestIndex);
      }

      tileX.value = withSpring(0);
      tileY.value = withSpring(0);
      setScrollingEnabled && scheduleOnRN(setScrollingEnabled, true);
    });
  const tileAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tileX.value }, { translateY: tileY.value }],
    zIndex: zIndex.value,
  }));

  return (
    <>
      <GestureDetector gesture={editMode ? tilePanGesture : imagePanGesture}>
        <Animated.View
          style={[
            styles.tile,
            { height },
            editMode ? tileAnimatedStyle : imageAnimatedStyle,
          ]}
          onLayout={event => {
            const { x, y, width, height } = event.nativeEvent.layout;
            onLayoutTile && onLayoutTile(id, { x, y, width, height });
          }}
        >
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
              <Text style={{ color: '#444' }}></Text>
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
      <TileModal
        visible={modalVisible}
        imageUrl={imageUrl}
        tileId={id}
        onClose={() => setModalVisible(false)}
        onSave={url => onUpdate(id, { imageUrl: url })}
      />
    </>
  );
};

export default Tile;
