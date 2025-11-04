export const COLORS = {
  primary: '#4F46E5',
  secondary: '#6366F1',
  background: '#F9FAFB',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  white: '#FFFFFF',
  gray: '#9CA3AF',
  lightGray: '#F3F4F6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  border: '#E5E7EB',
};

export const SIZES = {
  // Global sizes
  base: 8,
  radius: 12,
  padding: 16,

  // Font sizes
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,

  // Button and input sizes
  buttonHeight: 48,
  inputHeight: 44,
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
};

export const TEXT_STYLES = {
  small: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
  },
  regular: {
    fontSize: SIZES.md,
    color: COLORS.textPrimary,
    fontFamily: FONTS.regular,
  },
  large: {
    fontSize: SIZES.lg,
    color: COLORS.textPrimary,
    fontFamily: FONTS.medium,
  },
  title: {
    fontSize: SIZES.xl,
    color: COLORS.textPrimary,
    fontFamily: FONTS.bold,
  },
  heading: {
    fontSize: SIZES.xxxl,
    color: COLORS.textPrimary,
    fontFamily: FONTS.bold,
  },
};
