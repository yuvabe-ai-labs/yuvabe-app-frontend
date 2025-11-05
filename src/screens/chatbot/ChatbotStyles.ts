import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../utils/theme';

export const styles = StyleSheet.create({
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
});
