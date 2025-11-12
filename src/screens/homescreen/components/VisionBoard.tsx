import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Tile from './Tile';
import styles, { COLUMN_COUNT, GAP } from './VisionBoardStyles';

interface VisionItem {
  id: string;
  height: number;
  imageUrl?: string | null;
  label?: string;
}

interface VisionBoardProps {
  setScrollingEnabled: (enabled: boolean) => void;
}

const initialTiles: VisionItem[] = [
  { id: '1', height: 120 },
  { id: '2', height: 180 },
  { id: '3', height: 140 },
  { id: '4', height: 200 },
  { id: '5', height: 160 },
  { id: '6', height: 130 },
];

const VisionBoard: React.FC<VisionBoardProps> = ({ setScrollingEnabled }) => {
  const [tiles, setTiles] = useState(initialTiles);
  const [editMode, setEditMode] = useState(false);

  const toggleEdit = () => setEditMode(prev => !prev);

  const handleDelete = (id: string) => {
    setTiles(prev => prev.filter(t => t.id !== id));
  };

  const handleDragEnd = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const updated = [...tiles];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setTiles(updated);
  };

  const handleUpdateTile = (id: string, data: Partial<VisionItem>) => {
    setTiles(prev => prev.map(t => (t.id === id ? { ...t, ...data } : t)));
  };

  const handleAddTile = () => {
    if (tiles.length >= 6) return;
    const newTile: VisionItem = {
      id: String(Date.now()),
      height: 140,
      imageUrl: null,
      label: '',
    };
    setTiles(prev => [...prev, newTile]);
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
      <View style={styles.header}>
        <Text>Vision Board</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {editMode && tiles.length < 6 && (
            <TouchableOpacity
              style={[styles.pencilButton, { marginRight: 10 }]}
              onPress={handleAddTile}
            >
              <Icon name="add" size={24} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.pencilButton} onPress={toggleEdit}>
            <Icon name="edit" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <GestureHandlerRootView style={styles.columnsWrapper}>
        {columns.map((col, colIndex) => (
          <View key={colIndex} style={styles.column}>
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
                label={tile.label}
                onUpdate={handleUpdateTile}
              />
            ))}
          </View>
        ))}
      </GestureHandlerRootView>
    </View>
  );
};

export default VisionBoard;
