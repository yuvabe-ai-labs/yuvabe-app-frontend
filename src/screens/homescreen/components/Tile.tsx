import { Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import ImagePreviewModal from './ImagePreviewModal';
import TileModal from './TileModal';
import styles from './VisionBoardStyles';

interface TileProps {
  id: string;
  height: number;
  index: number;
  isUnlocked: boolean;
  tiles: { id: string; imageUrl?: string | null }[];
  imageUrl?: string | null;
  onSwap: (fromIndex: number, toIndex: number) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: { imageUrl?: string | null }) => void;
  tileLayouts?: React.RefObject<Record<string, any>>;
  onLayoutTile?: (id: string, layout: any) => void;
  setScrollingEnabled?: (enabled: boolean) => void;
}

const Tile: React.FC<TileProps> = ({
  id,
  height,
  index,
  isUnlocked,
  tiles,
  imageUrl,
  onSwap,
  onDelete,
  onUpdate,
  tileLayouts,
  onLayoutTile,
  setScrollingEnabled,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  const isDragging = useSharedValue(false);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const handleSwap = (dx: number, dy: number) => {
    const layouts = tileLayouts?.current;
    if (!layouts || !layouts[id]) return;

    const self = layouts[id];

    const draggedCenterX = self.x + dx + self.width / 2;
    const draggedCenterY = self.y + dy + self.height / 2;

    let closestIndex = index;
    let minDistance = Infinity;

    tiles.forEach((t, i) => {
      if (i === index) return;
      const l = layouts[t.id];
      if (!l) return;

      const cx = l.x + l.width / 2;
      const cy = l.y + l.height / 2;

      const dist = Math.hypot(draggedCenterX - cx, draggedCenterY - cy);

      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = i;
      }
    });

    if (closestIndex !== index) {
      onSwap(index, closestIndex);
    }
  };

  const tapGesture = Gesture.Tap().onEnd(() => {
    console.log('inside pan ended');
    if (!isUnlocked && imageUrl) {
      scheduleOnRN(setPreviewVisible, true);
    } else {
      scheduleOnRN(setModalVisible, true);
    }
  });

  const panGesture = Gesture.Pan()
    .enabled(isUnlocked)
    .activateAfterLongPress(300)
    .onBegin(() => {
      isDragging.value = true;
      translateX.value = withSpring(translateX.value, { damping: 12 });
      translateY.value = withSpring(translateY.value, { damping: 12 });
      setScrollingEnabled && scheduleOnRN(setScrollingEnabled, false);
    })
    .onUpdate(e => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd(() => {
      const dx = translateX.value;
      const dy = translateY.value;

      scheduleOnRN(handleSwap, dx, dy);

      translateX.value = withSpring(0);
      translateY.value = withSpring(0);

      isDragging.value = false;
      setScrollingEnabled && scheduleOnRN(setScrollingEnabled, true);
    })

    .onFinalize(() => {
      isDragging.value = false;
      setScrollingEnabled && scheduleOnRN(setScrollingEnabled, true);
    });

  const gesture = isUnlocked ? panGesture : tapGesture;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: withSpring(isDragging.value ? 1.06 : 1) },
    ],
    zIndex: isDragging.value ? 1000 : 1,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: isDragging.value ? 10 : 2 },
    shadowOpacity: isDragging.value ? 0.25 : 0.1,
    shadowRadius: isDragging.value ? 20 : 6,

    elevation: isDragging.value ? 20 : 2,
  }));

  return (
    <>
      <GestureDetector gesture={gesture}>
        <Animated.View
          onLayout={e => {
            e.target.measureInWindow((x, y, width, height) => {
              onLayoutTile?.(id, { x, y, width, height });
              console.log('tile layout', id, { x, y, width, height });
            });
          }}
          style={[styles.tile, { height }, animatedStyle]}
        >
          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          )}

          {isUnlocked && (
            <View style={styles.deleteButton}>
              <Trash2
                size={18}
                color="#fff"
                strokeWidth={2}
                onPress={() => onDelete(id)}
              />
            </View>
          )}
        </Animated.View>
      </GestureDetector>

      <ImagePreviewModal
        visible={previewVisible}
        imageUrl={imageUrl}
        onClose={() => setPreviewVisible(false)}
      />

      <TileModal
        visible={modalVisible}
        tileId={id}
        imageUrl={imageUrl}
        onClose={() => setModalVisible(false)}
        onSave={url => onUpdate(id, { imageUrl: url })}
      />
    </>
  );
};

export default Tile;
