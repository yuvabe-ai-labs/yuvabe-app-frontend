import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { Download, Lock, Pencil, Plus, Shuffle } from 'lucide-react-native';
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
  const [tiles, setTiles] = useState<VisionItem[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const ref = useRef<ViewShot | null>(null);
  const tileLayouts = useRef<
    Record<string, { x: number; y: number; width: number; height: number }>
  >({});
  const { showAlert, hideAlert } = useAlertStore.getState();

  useEffect(() => {
    if (!userEmail) return;

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

  useEffect(() => {
    if (userEmail) setVisionBoard(userEmail, tiles);
  }, [tiles, userEmail]);

  const handleAddTile = () => {
    if (tiles.length >= TILE_HEIGHTS.length) return;

    const usedHeights = tiles.map(t => t.height);
    const height = TILE_HEIGHTS.find(h => !usedHeights.includes(h));
    if (!height) return;

    setTiles(prev => [
      ...prev,
      { id: String(Date.now()), height, imageUrl: null },
    ]);
  };

  const handleDeleteTile = (id: string) => {
    setTiles(prev => prev.filter(t => t.id !== id));
  };

  const handleUpdateTile = (id: string, data: Partial<VisionItem>) => {
    setTiles(prev => prev.map(t => (t.id === id ? { ...t, ...data } : t)));
  };

  const swapImages = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    setTiles(prev => {
      const updated = [...prev];
      const a = updated[fromIndex].imageUrl;
      const b = updated[toIndex].imageUrl;
      updated[fromIndex].imageUrl = b;
      updated[toIndex].imageUrl = a;
      return updated;
    });
  };

  const shuffleImages = () => {
    const shuffleArray = <T,>(arr: T[]) => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };

    const shuffled = shuffleArray(tiles.map(t => t.imageUrl ?? null));

    setTiles(prev =>
      prev.map((t, i) => ({
        ...t,
        imageUrl: shuffled[i],
      })),
    );
  };

  const handleDownload = async () => {
    if (!ref.current) return;

    const uri = await ref.current.capture();
    await CameraRoll.saveAsset(uri, { type: 'photo' });

    showAlert({
      title: 'Vision Board',
      message: 'Saved to gallery. Share?',
      confirmText: 'Share',
      cancelText: 'Cancel',
      onConfirm: () => {
        hideAlert();
        Share.open({ url: uri }).catch(() => {});
      },
      onCancel: hideAlert,
    });
  };

  const columns: VisionItem[][] = Array.from(
    { length: COLUMN_COUNT },
    () => [],
  );
  const heights = Array(COLUMN_COUNT).fill(0);

  tiles.forEach(tile => {
    const col = heights.indexOf(Math.min(...heights));
    columns[col].push(tile);
    heights[col] += tile.height + GAP;
  });

  return (
    <View style={styles.boardContainer}>
      <ViewShot ref={ref} options={{ format: 'png', quality: 0.9 }}>
        <View style={styles.header}>
          <Text style={styles.thoughtTitle}>Vision Board</Text>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {isUnlocked && tiles.length < TILE_HEIGHTS.length && (
              <TouchableOpacity
                onPress={handleAddTile}
                style={styles.pencilButton}
              >
                <Plus size={22} />
              </TouchableOpacity>
            )}

            {isUnlocked && (
              <TouchableOpacity
                onPress={shuffleImages}
                style={[styles.pencilButton, { marginLeft: 10 }]}
              >
                <Shuffle size={22} />
              </TouchableOpacity>
            )}

            {!isUnlocked && (
              <TouchableOpacity
                onPress={handleDownload}
                style={[styles.pencilButton, { marginLeft: 10 }]}
              >
                <Download size={22} />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => setIsUnlocked(v => !v)}
              style={[styles.pencilButton, { marginLeft: 10 }]}
            >
              {isUnlocked ? <Lock size={20} /> : <Pencil size={20} />}
            </TouchableOpacity>
          </View>
        </View>

        <GestureHandlerRootView style={styles.columnsWrapper}>
          {columns.map((col, colIndex) => (
            <View key={colIndex} style={styles.column}>
              {col.map(tile => {
                const index = tiles.findIndex(t => t.id === tile.id);

                return (
                  <Tile
                    key={tile.id}
                    id={tile.id}
                    height={tile.height}
                    index={index}
                    isUnlocked={isUnlocked}
                    tiles={tiles}
                    imageUrl={tile.imageUrl}
                    onSwap={swapImages}
                    onDelete={handleDeleteTile}
                    onUpdate={handleUpdateTile}
                    tileLayouts={tileLayouts}
                    onLayoutTile={(id, layout) => {
                      tileLayouts.current[id] = layout;
                    }}
                    setScrollingEnabled={setScrollingEnabled}
                  />
                );
              })}
            </View>
          ))}
        </GestureHandlerRootView>
      </ViewShot>
    </View>
  );
};

export default VisionBoard;
