import { StyleSheet } from 'react-native';
import { COLORS, SIZES, TEXT_STYLES } from '../../utils/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SIZES.padding + 4,
    backgroundColor: COLORS.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base * 2,
    marginTop: SIZES.base * 2,
    marginLeft: SIZES.base,
    marginRight: SIZES.base,
  },

  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: SIZES.base,
  },

  welcomeText: {
    ...TEXT_STYLES.large,
    marginTop: 15,
  },

  thoughtContainer: {
    backgroundColor: '#FFFBF0',
    padding: 15,
    borderRadius: SIZES.radius,
    borderColor: '#FFCA2D',
    borderWidth: 1,
    marginTop: 15,
    marginBottom: SIZES.base * 2,
    alignItems: 'center',
  },

  thoughtTitle: {
    ...TEXT_STYLES.title,
    fontSize: 18,
    marginBottom: 10,
  },

  thoughtText: {
    ...TEXT_STYLES.regular,
    fontSize: 16,
    fontWeight:'600',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 10,
  },

  notificationCard: {
    backgroundColor: COLORS.warning + '33',
    borderRadius: SIZES.radius,
    padding: SIZES.base * 2,
    marginBottom: SIZES.base * 2,
    shadowColor: COLORS.textPrimary,
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  notificationTitle: {
    ...TEXT_STYLES.large,
  },

  closeButton: {
    fontSize: SIZES.lg,
    color: COLORS.textPrimary,
  },

  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SIZES.base * 1.5,
  },

  emojiButton: {
    padding: SIZES.base / 2,
  },

  emoji: {
    fontSize: 28,
  },

  moodHistoryContainer: {
    marginTop: 0,
  },

  moodHistoryTitle: {
    ...TEXT_STYLES.title,
  },
  section: {
    paddingRight: 16,
  },

  heading: {
    ...TEXT_STYLES.regular,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },

  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
  },

  thumbnail: {
    width: 63,
    height: 63,
    borderRadius: 12,
    marginRight: 20,
  },

  middle: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2F2F2F',
  },

  author: {
    fontSize: 14,
    color: '#858585',
  },

  time: {
    fontSize: 12,
    color: '#6C6C6C',
    marginTop: 5,
  },
  separator: {
    height: 1,
    backgroundColor: '#e6e6e6',
    marginLeft: 0,
    marginRight: 0,
  },

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
  dimOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.3)',
    opacity: 0.3,
    zIndex: 20,
  },
});

export default styles;
