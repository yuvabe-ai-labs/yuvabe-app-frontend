// src/screens/profilescreen/ProfileStyles.ts
import { StyleSheet } from 'react-native';
import { COLORS } from '../../utils/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center', // centers content vertically
    alignItems: 'center', // centers content horizontally
  },
  content: {
    alignItems: 'center', // makes text + button centered
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary || '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20, // space before logout button
  },
  logoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  logoutText: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
