import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../utils/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  bubble: {
    padding: SIZES.base * 1.25,
    marginVertical: SIZES.base * 0.6,
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
  botText: {
    color: 'black',
    fontSize: SIZES.md,
    fontFamily: FONTS.gilroy.regular,
  },
  text: {
    color: COLORS.white,
    fontSize: SIZES.md,
    fontFamily: FONTS.gilroy.regular,
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
  sendText: {
    color: COLORS.white,
    fontSize: SIZES.md,
    fontFamily: FONTS.gilroy.medium,
  },

  typingBubble: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.lightGray,
    padding: SIZES.base * 1.25,
    marginVertical: SIZES.base * 0.6,
    borderRadius: SIZES.radius,
    maxWidth: '50%',
  },

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
  downloadProgressText: {
    fontSize: 16,
    marginBottom: 10,
  },
  downloadBtn: {
    padding: 10,
  },
});
