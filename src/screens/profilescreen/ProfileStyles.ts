import { StyleSheet } from 'react-native';
import { COLORS } from '../../utils/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: 100,
  },

  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: COLORS.primary || '#007AFF',
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  email: {
    fontSize: 15,
    marginTop: 4,
    color: '#6C757D',
  },

  /* -------- Sections -------- */
  sectionWrapper: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E5E5',
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  sectionLabel: {
    flex: 1,
    marginLeft: 14,
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },

  /* -------- Logout -------- */
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 25,
    marginTop: 40,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#FFE8E8',
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '600',
  },
});
