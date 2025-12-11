import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../utils/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: 40,
  },

  /* Header */
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerBg: {
    height: 160,
    justifyContent: 'flex-end',
    paddingBottom: 25,
    paddingHorizontal: 20,
  },
  editTopWrapper: {
    marginTop: -60,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  changePhotoBtn: {
    marginTop: 12,
  },
  changePhotoText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '600',
  },

  /* Form */
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    marginBottom: 20,
    fontSize: 20,
    fontFamily: FONTS.gilroy.medium,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONTS.gilroy.medium,
    marginBottom: 6,
    color: '#1A1A1A',
  },
  input: {
    backgroundColor: '#FFF',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    fontSize: 16,
    marginBottom: 10,
  },
  passwordInput1: {
    // backgroundColor: '#FFF',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 10,
    // borderWidth: 1,
    borderColor: '#E5E5E5',
    fontSize: 16,
    marginBottom: 10,
  },
  passwordInput: {
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderColor: '#E5E5E5',
    borderWidth: 1,
    marginBottom: 10,
    color: COLORS.textPrimary,
    fontFamily: 'gilroy-regular',
    // height: 44,
  },

  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 8,
    fontSize: 13,
  },

  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
  },
  dropdownHeader: {
    marginTop: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
});
