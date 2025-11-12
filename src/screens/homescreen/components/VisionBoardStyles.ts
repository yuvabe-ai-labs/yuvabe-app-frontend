import { Dimensions, StyleSheet } from 'react-native';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const GAP = 8;
export const COLUMN_COUNT = 2;
export const BOARD_PADDING = GAP;
export const TILE_WIDTH =
  (SCREEN_WIDTH - GAP * (COLUMN_COUNT + 1)) / COLUMN_COUNT;

const styles = StyleSheet.create({
  boardContainer: {
    width: '100%',
    padding: BOARD_PADDING,
    backgroundColor: '#f2f2f2',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: GAP,
  },
  pencilButton: {
    padding: 6,
  },
  columnsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
  },
  tile: {
    width: TILE_WIDTH - 30,
    marginBottom: GAP,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 4,
    borderRadius: 12,
  },
});

export default styles;
