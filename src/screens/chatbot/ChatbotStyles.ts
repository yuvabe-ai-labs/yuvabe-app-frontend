import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../utils/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  bubble: {
    padding: SIZES.base * 1.25,
    marginVertical: 8,
    borderRadius: 16,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    backgroundColor: 'transparent',
    borderWidth: 1.4,
  },

  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#6C2CF8',
    borderColor: '#6C2CF8',
  },
  thinkingBubble: {
    alignSelf: 'flex-start',
    borderRadius: 16,
    padding: 12,
    maxWidth: '60%',
    borderWidth: 1,
    borderColor: '#D0C2FF',
  },
  thinkingText: {
    color: '#8A6BE7',
    fontSize: 14,
    fontFamily: FONTS.gilroy.medium,
  },

  botBubble: {
    alignSelf: 'flex-start',
    borderColor: '#CCB6FF',
  },
  botText: {
    color: '#592AC7',
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
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },

  modalContentSmall: {
    width: '75%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },

  modalInfo: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginBottom: 20,
  },
});
