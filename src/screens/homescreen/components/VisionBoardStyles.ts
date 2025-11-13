import { Dimensions, StyleSheet } from 'react-native';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const GAP = 4;
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
    justifyContent: 'flex-start',
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
// import { Dimensions, StyleSheet } from 'react-native';
// import { COLORS, SIZES } from '../../../utils/theme';

// export const SCREEN_WIDTH = Dimensions.get('window').width;
// export const COLUMN_COUNT = 2;
// export const GAP = SIZES.base;
// export const BOARD_PADDING = SIZES.padding;

// // ✅ Correct tile width calculation (prevents overlap)
// export const TILE_WIDTH =
//   (SCREEN_WIDTH - BOARD_PADDING * 2 - GAP * (COLUMN_COUNT - 1)) / COLUMN_COUNT;

// const styles = StyleSheet.create({
//   boardContainer: {
//     width: '100%',
//     paddingHorizontal: BOARD_PADDING,
//     paddingTop: BOARD_PADDING,
//     backgroundColor: COLORS.lightGray,
//     borderRadius: SIZES.radius,
//     marginBottom: SIZES.base * 2,
//   },

//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: GAP * 1.5,
//   },

//   pencilButton: {
//     padding: SIZES.base,
//   },

//   columnsWrapper: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },

//   column: {
//     flex: 1,
//     marginHorizontal: GAP / 2,
//   },

//   // ✅ Fixed overlap + removed rounded corners
//   tile: {
//     width: TILE_WIDTH,
//     marginBottom: GAP,
//     backgroundColor: COLORS.white,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: SIZES.base,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 0, // no rounded corners
//     shadowColor: COLORS.textPrimary,
//     shadowOpacity: 0.05,
//     shadowRadius: 1,
//     elevation: 0.5,
//   },

//   deleteButton: {
//     position: 'absolute',
//     top: 4,
//     right: 4,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     padding: 4,
//     borderRadius: 12,
//   },
// });

// export default styles;
