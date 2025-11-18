import { StyleSheet } from 'react-native';
import { COLORS } from '../../utils/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F5F9',
  },

  /* Gradient Header */
  headerBg: {
    height: 160,
    justifyContent: 'flex-end',
    paddingBottom: 25,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
  },

  /* Profile Card */
  profileCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: -50,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: COLORS.primary || '#007AFF',
    marginBottom: 10,
  },

  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  email: {
    fontSize: 15,
    color: '#6C757D',
    marginTop: 4,
  },

  /* Sections */
  sectionWrapper: {
    backgroundColor: '#FFFFFF',
    marginTop: 40,
    borderRadius: 12,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  sectionLabel: {
    flex: 1,
    marginLeft: 14,
    fontSize: 17,
    color: '#1A1A1A',
    fontWeight: '500',
  },

  /* Logout */
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 40,
    paddingVertical: 15,
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
