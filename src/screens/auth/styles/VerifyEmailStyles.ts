// src/screens/VerifyEmail/VerifyEmailStyles.ts

import { StyleSheet } from 'react-native';
import { COLORS, SIZES, TEXT_STYLES } from '../../../utils/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding * 1.5,
    borderRadius: SIZES.radius * 1.2,
    alignItems: 'center',
    width: '85%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },

  icon: {
    marginBottom: SIZES.base * 2,
  },

  title: {
    ...TEXT_STYLES.title,
    fontSize: SIZES.xl,
    marginBottom: SIZES.base,
  },

  description: {
    ...TEXT_STYLES.regular,
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginVertical: SIZES.base * 1.5,
  },

  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base * 1.5,
    paddingHorizontal: SIZES.padding * 2,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    width: '100%',
    marginTop: SIZES.base,
  },

  buttonText: {
    ...TEXT_STYLES.large,
    color: COLORS.white,
  },
  logoutButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    zIndex: 10,
  },
  logoutText: {
    color: '#007BFF', // or your theme primary color
    fontSize: 16,
    fontWeight: '500',
  },

  timerText: {
    color: COLORS.primary,
    fontSize: SIZES.lg,
    marginTop: SIZES.base * 1.5,
    fontFamily: TEXT_STYLES.large.fontFamily,
  },
});

export default styles;
