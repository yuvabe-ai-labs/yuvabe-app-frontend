import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { Download, LockOpen, Pencil, Plus } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Share from 'react-native-share';
import ViewShot from 'react-native-view-shot';
import { getVisionBoard, setVisionBoard } from '../../../store/storage';
import { useAlertStore } from '../../../store/useAlertStore';
import Tile from './Tile';
import styles, { COLUMN_COUNT, GAP } from './VisionBoardStyles';

interface VisionItem {
  id: string;
  height: number;
  imageUrl?: string | null;
}

const TILE_HEIGHTS = [180, 140, 220, 160, 200, 150];

const VisionBoard: React.FC<{
  userEmail: string;
  setScrollingEnabled: (enabled: boolean) => void;
}> = ({ userEmail, setScrollingEnabled }) => {
  const tileLayouts = useRef<{
    [id: string]: { x: number; y: number; width: number; height: number };
  }>({});

  useEffect(() => {
    if (!userEmail) {
      return (
        <View style={styles.boardContainer}>
          <Text style={styles.thoughtTitle}>Vision Board</Text>
          <Text style={{ marginTop: 10 }}>Loading...</Text>
        </View>
      );
    }

    const saved = getVisionBoard(userEmail);

    if (saved) {
      setTiles(saved);
    } else {
      setTiles(
        TILE_HEIGHTS.map((h, i) => ({
          id: String(i + 1),
          height: h,
          imageUrl: null,
        })),
      );
    }
  }, [userEmail]);

  const [tiles, setTiles] = useState<VisionItem[]>([]);
  const [editMode, setEditMode] = useState(false);
  const { showAlert, hideAlert } = useAlertStore.getState();

  useEffect(() => {
    const saved = getVisionBoard(userEmail);
    if (saved) {
      setTiles(saved);
    }
  }, [userEmail]);

  useEffect(() => {
    setVisionBoard(userEmail, tiles);
  }, [tiles, userEmail]);

  const toggleEdit = () => setEditMode(prev => !prev);

  const handleAddTile = () => {
    const usedHeights = tiles.map(t => t.height);
    const missingHeight = TILE_HEIGHTS.find(h => !usedHeights.includes(h));
    if (!missingHeight) return;
    const newTile: VisionItem = {
      id: String(Date.now()),
      height: missingHeight,
      imageUrl: null,
    };
    setTiles(prev => [...prev, newTile]);
  };

  const ref = useRef<ViewShot | null>(null);

  const handleDownload = () => {
    if (ref.current) {
      ref.current.capture().then(async uri => {
        await CameraRoll.saveAsset(uri, { type: 'photo' });

        showAlert({
          title: 'Vision Board',
          message:
            'Your vision board screenshot has been saved to your gallery.\nWould you like to share it?',
          confirmText: 'Share',
          cancelText: 'Cancel',

          onConfirm: () => {
            hideAlert();
            const data = {
              url: uri,
              title: 'Share VisionBoard',
              message: 'Checkout my Vision Board',
            };
            Share.open(data).catch(() => {});
          },

          onCancel: () => hideAlert(),
        });
      });
    } else {
      console.log('Ref reference is Empty!');
    }
  };

  const handleDelete = (id: string) => {
    setTiles(prev => prev.filter(t => t.id !== id));
  };

  const handleUpdateTile = (id: string, data: Partial<VisionItem>) => {
    setTiles(prev => prev.map(t => (t.id === id ? { ...t, ...data } : t)));
  };

  const handleDragEnd = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const updated = [...tiles];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setTiles(updated);
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

  return (
    <View style={styles.boardContainer}>
      <ViewShot ref={ref} options={{ format: 'png', quality: 0.8 }}>
        <View style={styles.header}>
          <Text style={styles.thoughtTitle}>Vision Board</Text>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {editMode && tiles.length < TILE_HEIGHTS.length && (
              <TouchableOpacity
                style={[styles.pencilButton, { marginRight: 10 }]}
                onPress={handleAddTile}
              >
                <Plus size={24} strokeWidth={2} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.pencilButton, { marginRight: 10 }]}
              onPress={handleDownload}
            >
              <Download size={24} strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.pencilButton} onPress={toggleEdit}>
              {editMode ? (
                <LockOpen size={20} strokeWidth={2} />
              ) : (
                <Pencil size={20} strokeWidth={2} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <GestureHandlerRootView style={styles.columnsWrapper}>
          {columns.map((col, colIndex) => (
            <View
              key={colIndex}
              style={[
                styles.column,
                colIndex === columns.length - 1 && styles.lastColumn,
              ]}
            >
              {col.map(tile => (
                <Tile
                  key={tile.id}
                  id={tile.id}
                  height={tile.height}
                  index={tiles.findIndex(t => t.id === tile.id)}
                  editMode={editMode}
                  onDelete={handleDelete}
                  onDragEnd={handleDragEnd}
                  tiles={tiles}
                  setScrollingEnabled={setScrollingEnabled}
                  imageUrl={tile.imageUrl}
                  onUpdate={handleUpdateTile}
                  onLayoutTile={(id, layout) =>
                    (tileLayouts.current[id] = layout)
                  }
                  tileLayouts={tileLayouts}
                />
              ))}
            </View>
          ))}
        </GestureHandlerRootView>
      </ViewShot>
    </View>
  );
};

export default VisionBoard;
