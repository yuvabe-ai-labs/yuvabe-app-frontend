import { StyleSheet } from 'react-native';
import { COLORS, SIZES, TEXT_STYLES } from '../../utils/theme';

export const leaveStyles = StyleSheet.create({
  container: {
    padding: SIZES.padding,
    backgroundColor: COLORS.background,
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  pickerBox: {
    height: 54,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    paddingHorizontal: 14,
    backgroundColor: COLORS.white,
    justifyContent: 'center', 
  },

  label: {
    ...TEXT_STYLES.regular,
    color: COLORS.textSecondary,
    marginTop: 20,
    marginBottom: 6,
  },

  input: {
    height: SIZES.inputHeight + 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    paddingHorizontal: 14,
    backgroundColor: COLORS.white,
    fontFamily: TEXT_STYLES.regular.fontFamily,
    fontSize: SIZES.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },

  bodyInput: {
    height: 150,
    textAlignVertical: 'top',
    paddingVertical: 10,
  },

  dropdown: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 4,
    overflow: 'hidden',
    elevation: 3,
  },

  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },

  btn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: SIZES.radius,
    marginTop: 28,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },

  btnText: {
    color: COLORS.white,
    fontFamily: TEXT_STYLES.large.fontFamily,
    fontSize: SIZES.lg,
  },
});
