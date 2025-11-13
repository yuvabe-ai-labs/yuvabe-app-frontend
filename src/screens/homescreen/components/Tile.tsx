// import React, { useState } from 'react';
// import {
//   Button,
//   Image,
//   Modal,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { Gesture, GestureDetector } from 'react-native-gesture-handler';
// import * as ImagePicker from 'react-native-image-picker';
// import Animated, {
//   runOnJS,
//   useAnimatedStyle,
//   useSharedValue,
//   withSpring,
// } from 'react-native-reanimated';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import styles, { GAP, TILE_WIDTH } from './VisionBoardStyles';

// interface TileProps {
//   id: string;
//   height: number;
//   index: number;
//   editMode: boolean;
//   onDelete: (id: string) => void;
//   onDragEnd: (fromIndex: number, toIndex: number) => void;
//   tiles: any[];
//   setScrollingEnabled?: (enabled: boolean) => void;
//   imageUrl?: string | null;
//   label?: string;
//   onUpdate: (
//     id: string,
//     data: { imageUrl?: string | null; label?: string },
//   ) => void;
// }

// const COLUMN_COUNT = 2;

// const Tile: React.FC<TileProps> = ({
//   id,
//   height,
//   index,
//   editMode,
//   onDelete,
//   onDragEnd,
//   tiles,
//   setScrollingEnabled,
//   imageUrl,
//   label,
//   onUpdate,
// }) => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [tempImageUrl, setTempImageUrl] = useState(imageUrl || '');
//   const [tempLabel, setTempLabel] = useState(label || '');

//   const x = useSharedValue(0);
//   const y = useSharedValue(0);

//   const panGesture = Gesture.Pan()
//     .onBegin(() => {
//       setScrollingEnabled && runOnJS(setScrollingEnabled)(false);
//     })
//     .onUpdate(event => {
//       x.value = event.translationX;
//       y.value = event.translationY;
//     })
//     .onEnd(() => {
//       const row = Math.round(y.value / (height + GAP));
//       const col = Math.round(x.value / (TILE_WIDTH + GAP));
//       let toIndex = index + row * COLUMN_COUNT + col;
//       if (toIndex < 0) toIndex = 0;
//       if (toIndex >= tiles.length) toIndex = tiles.length - 1;
//       runOnJS(onDragEnd)(index, toIndex);

//       x.value = withSpring(0);
//       y.value = withSpring(0);
//       setScrollingEnabled && runOnJS(setScrollingEnabled)(true);
//     });

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ translateX: x.value }, { translateY: y.value }],
//   }));

//   const pickImage = () => {
//     ImagePicker.launchImageLibrary({ mediaType: 'photo' }, response => {
//       if (!response.didCancel && response.assets?.[0]?.uri) {
//         setTempImageUrl(response.assets[0].uri);
//       }
//     });
//   };

//   const handleSave = () => {
//     onUpdate(id, { imageUrl: tempImageUrl, label: tempLabel });
//     setModalVisible(false);
//   };

//   return (
//     <>
//       <GestureDetector gesture={panGesture}>
//         <Animated.View style={[styles.tile, { height }, animatedStyle]}>
//           <TouchableOpacity
//             style={{
//               flex: 1,
//               justifyContent: 'center',
//               alignItems: 'center',
//               width: '100%',
//             }}
//             onPress={() => setModalVisible(true)}
//             disabled={editMode}
//           >
//             {imageUrl ? (
//               <Image
//                 source={{ uri: imageUrl }}
//                 style={{ width: '100%', height: '100%' }}
//                 resizeMode="cover"
//               />
//             ) : (
//               <Text style={{ color: '#444' }}>{label || `Tile ${id}`}</Text>
//             )}
//           </TouchableOpacity>

//           {editMode && (
//             <TouchableOpacity
//               style={styles.deleteButton}
//               onPress={() => onDelete(id)}
//             >
//               <Icon name="delete" size={18} color="#fff" />
//             </TouchableOpacity>
//           )}
//         </Animated.View>
//       </GestureDetector>

//       <Modal
//         visible={modalVisible}
//         animationType="slide"
//         transparent
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View
//           style={{
//             flex: 1,
//             justifyContent: 'flex-end',
//             backgroundColor: 'rgba(0,0,0,0.5)',
//           }}
//         >
//           <View
//             style={{
//               backgroundColor: '#fff',
//               borderTopLeftRadius: 16,
//               borderTopRightRadius: 16,
//               padding: 20,
//             }}
//           >
//             <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }}>
//               Edit Tile
//             </Text>

//             <Button title="Upload Image" onPress={pickImage} />
//             <TextInput
//               placeholder="or enter Image URL"
//               value={tempImageUrl}
//               placeholderTextColor="#888"
//               onChangeText={setTempImageUrl}
//               style={{
//                 borderWidth: 1,
//                 textDecorationColor: 'grey',
//                 textShadowColor: 'grey',
//                 borderColor: '#ccc',
//                 borderRadius: 6,
//                 marginTop: 10,
//                 padding: 8,
//                 color: '#000',
//               }}
//             />

//             <TextInput
//               placeholder="Tile Label"
//               placeholderTextColor="#888"
//               value={tempLabel}
//               onChangeText={setTempLabel}
//               style={{
//                 borderWidth: 1,
//                 borderColor: '#ccc',
//                 borderRadius: 6,
//                 marginTop: 10,
//                 padding: 8,
//                 color: '#000',
//               }}
//             />

//             <View
//               style={{
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 marginTop: 15,
//               }}
//             >
//               <Button
//                 title="Cancel"
//                 color="red"
//                 onPress={() => setModalVisible(false)}
//               />
//               <Button title="Save" onPress={handleSave} />
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </>
//   );
// };

// export default Tile;
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as ImagePicker from 'react-native-image-picker';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TileEditModal from './TileEditModal';
import styles from './VisionBoardStyles';

interface TileProps {
  id: string;
  height: number;
  editMode: boolean;
  onDelete: (id: string) => void;
  onSwapContent: (fromId: string, toId: string) => void;
  tiles: any[];
  setScrollingEnabled?: (enabled: boolean) => void;
  imageUrl?: string | null;
  onUpdate: (
    id: string,
    data: { imageUrl?: string | null; label?: string },
  ) => void;
  updateTilePosition?: (
    id: string,
    layout: { x: number; y: number; w: number; h: number },
  ) => void; // ✅ added
  tilePositions?: React.RefObject<
    Record<string, { x: number; y: number; w: number; h: number }>
  >;
  scrollY: number;
  onDragStart?: (id: string) => void;
  onDragOver?: (id: string) => void;
  onDragEnd?: () => void;
}

const Tile: React.FC<TileProps> = ({
  id,
  height,
  editMode,
  onDelete,
  onSwapContent,
  tiles,
  setScrollingEnabled,
  imageUrl,
  onUpdate,
  tilePositions,
  updateTilePosition,
  scrollY,
  onDragStart,
  onDragOver,
  onDragEnd,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState(imageUrl || '');

  const tileRef = useRef<View>(null);
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  // --- Measure tile and store in parent map ---
  const measureTile = useCallback(() => {
    requestAnimationFrame(() => {
      if (!tileRef.current) return;
      tileRef.current.measure((x, y, w, h, pageX, pageY) => {
        if (!pageX && !pageY) return;
        updateTilePosition?.(id, { x: pageX, y: pageY, w, h });
        tilePositions?.current &&
          (tilePositions.current[id] = { x: pageX, y: pageY, w, h });
        console.log(
          `📏 (fixed) Measured Tile ${id} => x:${pageX}, y:${pageY}, w:${w}, h:${h}`,
        );
      });
    });
  }, [id, tilePositions, updateTilePosition]);

  // Measure after layout and whenever tiles change
  useEffect(() => {
    const t = setTimeout(() => {
      measureTile();
    }, 500);
    return () => clearTimeout(t);
  }, [measureTile, tiles.length, scrollY, imageUrl]);

  useEffect(() => {
    const measureAllTiles = () => {
      Object.keys(tilePositions?.current || {}).forEach(key => {
        const ref = tilePositions?.current[key];
        if (ref) console.log('📋 Tile position in VisionBoard', key, ref);
      });
    };

    const t = setTimeout(measureAllTiles, 500);
    return () => clearTimeout(t);
  }, [tiles, scrollY]);
  // --- Gesture setup ---
  const panGesture = Gesture.Pan()
    .onBegin(() => {
      console.log('🟡 [Tile]', id, '=> onBegin (drag start)');
      runOnJS(measureTile)(); // measure self

      // NEW: measure all tiles once more before drag
      if (tilePositions?.current) {
        Object.entries(tilePositions?.current).forEach(([tid, pos]) => {
          console.log('📦 Pre-drag position check:', tid, pos);
        });
      }

      if (onDragStart) runOnJS(onDragStart)(id);
      if (setScrollingEnabled) runOnJS(setScrollingEnabled)(false);
    })

    .onUpdate(event => {
      x.value = event.translationX; // Update tile's X position as it's dragged
      y.value = event.translationY; // Update tile's Y position as it's dragged
      console.log('🟢 [Tile]', id, '=> onUpdate, dragging...');
      if (onDragOver) runOnJS(onDragOver)(id); // Trigger onDragOver when the tile is dragged
    })
    .onEnd(event => {
      console.log('🔵 [Tile]', id, '=> onEnd (drag released)');
      runOnJS(measureTile)(); // already in onBegin
      // also call measureTile() once more at onEnd
      runOnJS(measureTile)();
      const dropX = event.absoluteX;
      const dropY = event.absoluteY;
      const positions = tilePositions?.current || {};

      console.log('🧪 drop absolute:', dropX, dropY);
      console.log('🧪 translation:', event.translationX, event.translationY);
      console.log('🧪 scrollY:', scrollY);
      console.log('📊 All positions:', JSON.stringify(positions, null, 2));

      let targetId: string | null = null;
      const margin = 20; // ✅ tolerance margin

      for (const [tid, pos] of Object.entries(positions)) {
        if (!pos) continue;
        if (
          dropX >= pos.x - margin &&
          dropX <= pos.x + pos.w + margin &&
          dropY >= pos.y - margin &&
          dropY <= pos.y + pos.h + margin
        ) {
          targetId = tid;
          break;
        }
      }

      if (targetId && targetId !== id) {
        console.log(`🎯 Found drop target: ${targetId}`);
        runOnJS(onSwapContent)(id, targetId);
      } else {
        console.log('⚪ No valid target found for swap');
      }

      x.value = withSpring(0);
      y.value = withSpring(0);
      if (setScrollingEnabled) runOnJS(setScrollingEnabled)(true);
      if (onDragEnd) runOnJS(onDragEnd)();
    })

    .onFinalize(() => {
      // Finalize tile position and reset scrolling
      console.log('⚫ [Tile]', id, '=> onFinalize (gesture cleanup)');
      x.value = withSpring(0);
      y.value = withSpring(0);
      if (setScrollingEnabled) runOnJS(setScrollingEnabled)(true);

      if (onDragEnd) runOnJS(onDragEnd)(); // Ensure onDragEnd is called
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }));

  // --- Image Picker ---
  const pickImage = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, response => {
      if (!response.didCancel && response.assets?.[0]?.uri) {
        setTempImageUrl(response.assets[0].uri);
      }
    });
  };

  const handleSave = () => {
    onUpdate(id, { imageUrl: tempImageUrl });
    setModalVisible(false);
  };

  return (
    <>
      <View
        ref={tileRef}
        onLayout={() => {
          setTimeout(measureTile, 100); // Measure position on layout
        }}
      >
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
                <Text style={{ color: '#aaa' }}>Add Image</Text>
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
      </View>

      {/* Modal for tile image editing */}
      <TileEditModal
        visible={modalVisible}
        imageUrl={imageUrl}
        onSave={newImageUrl => onUpdate(id, { imageUrl: newImageUrl })}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};

export default Tile;
