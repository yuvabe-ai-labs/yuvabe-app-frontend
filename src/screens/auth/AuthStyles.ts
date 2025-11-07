// src/screens/SignIn/styles.js
import { StyleSheet } from 'react-native';
import { COLORS, SIZES, TEXT_STYLES, FONTS } from '../../utils/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    padding: SIZES.padding * 1.5,
  },

  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: SIZES.padding * 1.5,
  },

  title: {
    ...TEXT_STYLES.title,
    fontFamily: FONTS.clashDisplay.bold,
    textAlign: 'center',
    marginBottom: SIZES.base,
  },

  subtitle: {
    ...TEXT_STYLES.regular,
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginBottom: SIZES.padding,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: SIZES.base * 1.8,
    marginVertical: SIZES.base,
    color: COLORS.textPrimary,
    fontSize: SIZES.md,
    fontFamily: FONTS.gilroy.regular, // 👈 consistent font
  },

  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base * 2,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginTop: SIZES.base * 1.5,
  },

  buttonText: {
    ...TEXT_STYLES.large,
    color: COLORS.white,
    fontFamily: FONTS.clashDisplay.bold, // 👈 use Gilroy bold
  },

  footerText: {
    ...TEXT_STYLES.small,
    textAlign: 'center',
    marginTop: SIZES.padding,
  },

  errorText: {
    color: COLORS.error,
    fontSize: 14,
    marginBottom: 4,
    fontFamily: FONTS.gilroy.regular,
  },

  link: {
    color: COLORS.primary,
    fontFamily: FONTS.gilroy.bold,
  },
});
