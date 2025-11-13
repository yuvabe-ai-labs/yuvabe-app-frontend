// import React, { useState } from 'react';
// import { Text, TouchableOpacity, View } from 'react-native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import Tile from './Tile';
// import styles, { COLUMN_COUNT, GAP } from './VisionBoardStyles';

// interface VisionItem {
//   id: string;
//   height: number;
//   imageUrl?: string | null;
//   label?: string;
// }

// interface VisionBoardProps {
//   setScrollingEnabled: (enabled: boolean) => void;
// }

// const initialTiles: VisionItem[] = [
//   { id: '1', height: 120 },
//   { id: '2', height: 180 },
//   { id: '3', height: 140 },
//   { id: '4', height: 200 },
//   { id: '5', height: 160 },
//   { id: '6', height: 130 },
// ];

// const VisionBoard: React.FC<VisionBoardProps> = ({ setScrollingEnabled }) => {
//   const [tiles, setTiles] = useState(initialTiles);
//   const [editMode, setEditMode] = useState(false);

//   const toggleEdit = () => setEditMode(prev => !prev);

//   const handleDelete = (id: string) => {
//     setTiles(prev => prev.filter(t => t.id !== id));
//   };

//   const handleDragEnd = (fromIndex: number, toIndex: number) => {
//     if (fromIndex === toIndex) return;
//     const updated = [...tiles];
//     const [moved] = updated.splice(fromIndex, 1);
//     updated.splice(toIndex, 0, moved);
//     setTiles(updated);
//   };

//   const handleUpdateTile = (id: string, data: Partial<VisionItem>) => {
//     setTiles(prev => prev.map(t => (t.id === id ? { ...t, ...data } : t)));
//   };

//   const handleAddTile = () => {
//     if (tiles.length >= 6) return;
//     const newTile: VisionItem = {
//       id: String(Date.now()),
//       height: 140,
//       imageUrl: null,
//       label: '',
//     };
//     setTiles(prev => [...prev, newTile]);
//   };

//   const columns: VisionItem[][] = Array.from(
//     { length: COLUMN_COUNT },
//     () => [],
//   );
//   const columnHeights = Array(COLUMN_COUNT).fill(0);

//   tiles.forEach(tile => {
//     const shortest = columnHeights.indexOf(Math.min(...columnHeights));
//     columns[shortest].push(tile);
//     columnHeights[shortest] += tile.height + GAP;
//   });

//   return (
//     <View style={styles.boardContainer}>
//       <View style={styles.header}>
//         <Text>Vision Board</Text>
//         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//           {editMode && tiles.length < 6 && (
//             <TouchableOpacity
//               style={[styles.pencilButton, { marginRight: 10 }]}
//               onPress={handleAddTile}
//             >
//               <Icon name="add" size={24} />
//             </TouchableOpacity>
//           )}
//           <TouchableOpacity style={styles.pencilButton} onPress={toggleEdit}>
//             <Icon name="edit" size={20} />
//           </TouchableOpacity>
//         </View>
//       </View>

//       <GestureHandlerRootView style={styles.columnsWrapper}>
//         {columns.map((col, colIndex) => (
//           <View key={colIndex} style={styles.column}>
//             {col.map(tile => (
//               <Tile
//                 key={tile.id}
//                 id={tile.id}
//                 height={tile.height}
//                 index={tiles.findIndex(t => t.id === tile.id)}
//                 editMode={editMode}
//                 onDelete={handleDelete}
//                 onDragEnd={handleDragEnd}
//                 tiles={tiles}
//                 setScrollingEnabled={setScrollingEnabled}
//                 imageUrl={tile.imageUrl}
//                 label={tile.label}
//                 onUpdate={handleUpdateTile}
//               />
//             ))}
//           </View>
//         ))}
//       </GestureHandlerRootView>
//     </View>
//   );
// };

// export default VisionBoard;
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { captureRef } from 'react-native-view-shot';
import { getVisionBoard, setVisionBoard } from '../../../store/storage';
import Tile from './Tile';
import styles, { COLUMN_COUNT, GAP } from './VisionBoardStyles';
export const TILE_HEIGHTS = [180, 140, 220, 160, 200, 150];
interface VisionItem {
  id: string;
  height: number;
  imageUrl?: string | null;
}

interface VisionBoardProps {
  setScrollingEnabled: (enabled: boolean) => void;
}

const VisionBoard: React.FC<VisionBoardProps> = ({ setScrollingEnabled }) => {
  const tilePositions = useRef<
    Record<string, { x: number; y: number; w: number; h: number }>
  >({});
  const [draggingTileId, setDraggingTileId] = useState<string | null>(null);
  const [hoveredTileId, setHoveredTileId] = useState<string | null>(null);
  const handleDragStart = (id: string) => {
    console.log('🟡 Drag started on tile:', id);
    setDraggingTileId(id);
  };

  const handleDragOver = (id: string) => {
    if (draggingTileId && draggingTileId !== id) {
      console.log(`🟢 Dragging over tile: ${id}, from tile: ${draggingTileId}`);
      setHoveredTileId(id);
    }
  };

  const handleDragEnd = () => {
    console.log('🔵 Drag ended');
    console.log('Dragging tile ID:', draggingTileId);
    console.log('Hovered tile ID:', hoveredTileId);
    if (draggingTileId && hoveredTileId) {
      const fromTile = tiles.find(t => t.id === draggingTileId);
      const toTile = tiles.find(t => t.id === hoveredTileId);

      if (fromTile && toTile) {
        console.log(
          '🟣 Swapping images between',
          draggingTileId,
          'and',
          hoveredTileId,
        );
        setTiles(prev =>
          prev.map(t => {
            if (t.id === draggingTileId) {
              return { ...t, imageUrl: toTile.imageUrl };
            }
            if (t.id === hoveredTileId) {
              return { ...t, imageUrl: fromTile.imageUrl };
            }
            return t;
          }),
        );
      } else {
        console.log('⚠️ One of the tiles was not found for swapping');
      }
    } else {
      console.log('⚠️ Dragging or hovered tile missing — no swap');
    }

    // Reset dragging and hovered states
    setDraggingTileId(null);
    setHoveredTileId(null);
  };

  const [tiles, setTiles] = useState<VisionItem[]>(() => {
    const saved = getVisionBoard();

    console.log('Loaded from storage:', saved);
    if (Array.isArray(saved)) {
      return saved.map(t => ({
        id: t.id,
        height: t.height,
        imageUrl: t.imageUrl ?? null,
      }));
    }

    return TILE_HEIGHTS.map((h, i) => ({
      id: `${i + 1}`,
      height: h,
      imageUrl: null,
    }));
  });
  useEffect(() => {
    setVisionBoard(tiles);
  }, [tiles]);

  const [editMode, setEditMode] = useState(false);

  const updateTilePosition = useCallback(
    (id: string, layout: { x: number; y: number; w: number; h: number }) => {
      tilePositions.current[id] = layout;
    },
    [],
  );
  console.log('📊 All positions:', tilePositions.current);

  const [scrollY, setScrollY] = useState(0);
  const toggleEdit = () => setEditMode(prev => !prev);

  const boardRef = useRef<View>(null);

  const handleSwapContent = (fromId: string, toId: string) => {
    setTiles(prev => {
      const fromTile = prev.find(t => t.id === fromId);
      const toTile = prev.find(t => t.id === toId);
      if (!fromTile || !toTile) return prev;

      const updated = prev.map(t => {
        if (t.id === fromId) return { ...t, imageUrl: toTile.imageUrl };
        if (t.id === toId) return { ...t, imageUrl: fromTile.imageUrl };
        return t;
      });

      setVisionBoard(updated);
      return updated;
    });
  };

  const handleDelete = (id: string) => {
    setTiles(prev => {
      const updated = prev.filter(t => t.id !== id);
      setVisionBoard(updated);
      return updated;
    });
  };

  const handleAddTile = () => {
    if (tiles.length >= TILE_HEIGHTS.length) return;

    const usedHeights = tiles.map(t => t.height);
    const availableHeight = TILE_HEIGHTS.find(h => !usedHeights.includes(h));
    if (!availableHeight) return;

    const newTile: VisionItem = {
      id: String(Date.now()),
      height: availableHeight,
      imageUrl: null,
    };

    const updated = [...tiles, newTile].sort(
      (a, b) => TILE_HEIGHTS.indexOf(a.height) - TILE_HEIGHTS.indexOf(b.height),
    );

    setTiles(updated);
    setVisionBoard(updated);
  };

  const handleUpdateTile = (id: string, data: Partial<VisionItem>) => {
    setTiles(prev => {
      const updated = prev.map(t => (t.id === id ? { ...t, ...data } : t));
      setVisionBoard(updated);
      return updated;
    });
  };

  const columns: VisionItem[][] = Array.from(
    { length: COLUMN_COUNT },
    () => [],
  );
  const columnHeights = Array(COLUMN_COUNT).fill(0);

  tiles.forEach(tile => {
    const shortest = columnHeights.indexOf(Math.min(...columnHeights));
    columns[shortest].push(tile);
    columnHeights[shortest] += tile.height + GAP;
  });

  async function hasAndroidPermission() {
    const androidVersion = Number(Platform.Version);
    const getCheckPermissionPromise = () => {
      if (androidVersion >= 33) {
        return Promise.all([
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          ),
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          ),
        ]).then(
          ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
            hasReadMediaImagesPermission && hasReadMediaVideoPermission,
        );
      } else {
        return PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
      }
    };

    const hasPermission = await getCheckPermissionPromise();
    if (hasPermission) return true;

    const getRequestPermissionPromise = () => {
      if (androidVersion >= 33) {
        return PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        ]).then(
          statuses =>
            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
              PermissionsAndroid.RESULTS.GRANTED,
        );
      } else {
        return PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ).then(status => status === PermissionsAndroid.RESULTS.GRANTED);
      }
    };

    return await getRequestPermissionPromise();
  }
  const handleDownload = async () => {
    if (!boardRef.current) return;

    try {
      if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
        Alert.alert('Permission denied', 'Cannot save without media access');
        return;
      }

      await new Promise<void>(resolve => setTimeout(() => resolve(), 300));

      const uri = await captureRef(boardRef.current, {
        format: 'jpg',
        quality: 0.8,
      });

      await CameraRoll.saveAsset(uri, {
        type: 'photo',
        album: 'VisionBoard',
      });

      Alert.alert('Success', 'Vision board saved to gallery!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save vision board');
    }
  };

  return (
    <View ref={boardRef} style={styles.boardContainer}>
      <View style={styles.header}>
        <Text style={{ fontWeight: '600', fontSize: 16 }}>Vision Board</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {editMode && tiles.length < TILE_HEIGHTS.length && (
            <TouchableOpacity
              style={[styles.pencilButton, { marginRight: 10 }]}
              onPress={handleAddTile}
            >
              <Icon name="add" size={24} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.pencilButton} onPress={toggleEdit}>
            <Icon name={editMode ? 'lock-open' : 'edit'} size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.pencilButton, { marginLeft: 10 }]}>
            <Icon name="download" size={20} onPress={handleDownload} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        onScroll={e => setScrollY(e.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
      >
        <View style={{ backgroundColor: '#fff' }}>
          <GestureHandlerRootView style={styles.columnsWrapper}>
            {columns.map((col, colIndex) => (
              <View key={colIndex} style={styles.column}>
                {col.map(tile => (
                  <Tile
                    key={tile.id}
                    id={tile.id}
                    height={tile.height}
                    editMode={editMode}
                    onDelete={handleDelete}
                    onSwapContent={handleSwapContent}
                    tiles={tiles}
                    setScrollingEnabled={setScrollingEnabled}
                    imageUrl={tile.imageUrl}
                    onUpdate={handleUpdateTile}
                    updateTilePosition={updateTilePosition} // ✅ pass this
                    tilePositions={tilePositions}
                    scrollY={scrollY}
                    onDragStart={() => handleDragStart(tile.id)} // Start drag
                    onDragOver={() => handleDragOver(tile.id)}
                    onDragEnd={handleDragEnd}
                  />
                ))}
              </View>
            ))}
          </GestureHandlerRootView>
        </View>
      </ScrollView>
    </View>
  );
};

export default VisionBoard;
