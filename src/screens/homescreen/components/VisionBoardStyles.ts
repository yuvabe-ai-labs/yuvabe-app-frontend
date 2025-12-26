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
    backgroundColor: '#FBF7FF',
    borderWidth: 1,
    borderColor: '#592AC7',
    borderRadius: 12,
    marginTop: 20,
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
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    marginRight: 10,
    alignItems: 'center',
  },
  cancelText: {
    ...TEXT_STYLES.title,
    fontSize: 16,
    color: '#444',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#592AC7',
    alignItems: 'center',
    marginLeft: 10,
  },
  saveText: {
    ...TEXT_STYLES.title,
    color: 'white',
    fontSize: 16,
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
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    minWidth: '90%',
    maxWidth: '90%',
  },
  modalCard: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  modalTitle: {
    ...TEXT_STYLES.title,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#222',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  orText: {
    ...TEXT_STYLES.title,
    marginHorizontal: 10,
    color: '#999999',
    fontSize: 14,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#C5C5C5',
  },
  uploadButton: {
    backgroundColor: '#592AC7',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  uploadButtonText: {
    ...TEXT_STYLES.title,
    color: '#FFF',
    fontSize: 16,
  },
  modalButton: {
    marginTop: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#000',
    marginBottom: 14,
  },
  searchButton: {
    backgroundColor: '#592AC7',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 4,
  },
  searchButtonText: {
    ...TEXT_STYLES.title,
    color: '#FFF',
    fontSize: 16,
  },
  modalTextInput: {
    ...TEXT_STYLES.title,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginTop: 10,
    padding: 10,
    color: '#000',
  },
  removeImageButton: {
    marginTop: 4,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#FCE8E8',
    alignItems: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  removeImageText: {
    ...TEXT_STYLES.title,
    color: '#C04848',
    fontSize: 14,
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
});

export default styles;
