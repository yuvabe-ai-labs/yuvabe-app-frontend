import React from 'react';
import { Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from '../WaterTrackingStyles';

type TileConfig = {
  label: string;
  value: number | string;
  unit: string;
  colors?: string[];
};

type StatTilesRowProps = {
  tiles: TileConfig[];
};

/* ---------- SINGLE TILE ---------- */
const StatTile: React.FC<TileConfig> = ({
  label,
  value,
  unit,
  colors = ['#592AC7', '#CCB6FF'],
}) => {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: -1, y: -1 }}
      end={{ x: 1, y: 1 }}
      style={styles.statGradientBorder}
    >
      <View style={styles.statInnerBox}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statUnit}>{unit}</Text>
      </View>
    </LinearGradient>
  );
};


/* ---------- ROW (exported) ---------- */
export const StatTilesRow: React.FC<StatTilesRowProps> = ({ tiles }) => {
  return (
    <View style={styles.statsContainer}>
      {tiles.map(tile => (
        <StatTile key={tile.label} {...tile} />
      ))}
    </View>
  );
};
