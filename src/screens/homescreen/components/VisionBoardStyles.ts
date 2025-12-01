import { Dimensions, StyleSheet } from 'react-native';
import { SIZES, TEXT_STYLES } from '../../../utils/theme';

export const GAP = 2;
export const SCREEN_WIDTH = Dimensions.get('window').width;
export const COLUMN_COUNT = 2;

export const BOARD_PADDING_HORIZONTAL = 16;
export const BOARD_PADDING_VERTICAL = 14;

export const TILE_WIDTH =
  (SCREEN_WIDTH - BOARD_PADDING_HORIZONTAL * 2 - GAP * (COLUMN_COUNT - 1)) /
    COLUMN_COUNT -
  16;

const styles = StyleSheet.create({
  boardContainer: {
    width: '100%',
    paddingHorizontal: BOARD_PADDING_HORIZONTAL,
    paddingVertical: BOARD_PADDING_VERTICAL,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  thoughtTitle: {
    ...TEXT_STYLES.title,
    fontSize: SIZES.lg,
    marginBottom: 4,
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
  },

  column: {
    width: TILE_WIDTH,
    marginRight: GAP,
  },

  lastColumn: {
    marginRight: 0,
  },

  tile: {
    width: TILE_WIDTH,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    minWidth: '90%',
    maxWidth: '90%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  modalButton: {
    marginTop: 10,
  },
  modalTextInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginTop: 10,
    padding: 10,
    color: '#000',
  },
  removeImageButton: {
    marginTop: 10,
    backgroundColor: '#fbeaea',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  removeImageText: {
    color: '#b94a48',
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
});

export default styles;
