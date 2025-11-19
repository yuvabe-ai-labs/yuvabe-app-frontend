import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../utils/theme';

export const styles = StyleSheet.create({
  // Existing styles
  bubble: {
    padding: SIZES.base * 1.25, // ~10px
    marginVertical: SIZES.base * 0.6, // ~5px
    borderRadius: SIZES.radius,
    maxWidth: '80%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.lightGray,
  },
  text: {
    color: COLORS.white,
    fontSize: SIZES.md,
    fontFamily: FONTS.gilroy.regular,
  },
  key: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  touch: {
    color: 'white',
    fontWeight: 'bold',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.base,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.base * 1.25,
    paddingVertical: SIZES.base,
    marginRight: SIZES.base,
    fontSize: SIZES.md,
    fontFamily: FONTS.gilroy.regular,
    color: COLORS.textPrimary,
  },
  sendBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base * 1.25,
    borderRadius: SIZES.radius,
  },

  // New styles (from your updated code)
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  downloadText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  downloadDescription: {
    marginTop: 10,
    fontSize: 16,
  },
  downloadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  downloadBtn: {
    padding: 10,
  },
  downloadProgressText: {
    fontSize: 16,
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#ddd',
    width: '100%',
    borderRadius: 3,
  },
  progressFill: {
    height: 6,
    backgroundColor: 'blue',
    borderRadius: 3,
  },
  activityIndicator: {
    marginTop: 20,
  },
});
