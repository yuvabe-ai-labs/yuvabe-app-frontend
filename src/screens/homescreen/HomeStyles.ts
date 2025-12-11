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
    marginTop: 30,
  },

  thoughtContainer: {
    backgroundColor: '#FFFBF0',
    padding: 15,
    borderRadius: SIZES.radius,
    borderColor: '#FFCA2D',
    borderWidth: 1,
    marginTop: 15,
    marginBottom: SIZES.base * 2.5,
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
    fontStyle: 'normal',
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
  // audioContainer: {
  //   backgroundColor: COLORS.lightGray,
  //   padding: SIZES.base * 2,
  //   borderRadius: SIZES.radius,
  //   marginBottom: SIZES.base * 2.5,
  // },

  // audioTitle: {
  //   ...TEXT_STYLES.title,
  //   fontSize: SIZES.lg,
  //   marginBottom: 8,
  // },

  // audioItem: {
  //   backgroundColor: COLORS.background,
  //   padding: SIZES.base * 1.5,
  //   borderRadius: SIZES.radius,
  //   marginTop: SIZES.base,
  //   shadowColor: COLORS.textPrimary,
  //   shadowOpacity: 0.05,
  //   shadowRadius: 2,
  //   elevation: 2,
  // },

  // audioItemTitle: {
  //   ...TEXT_STYLES.large,
  //   fontSize: SIZES.md,
  //   marginBottom: 10,
  // },

  // audioControls: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginTop: 6,
  // },

  // audioButton: {
  //   marginRight: 20,
  // },

  // audioButtonText: {
  //   ...TEXT_STYLES.regular,
  //   fontSize: 16,
  // },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 14,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
  },

  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 10,
    marginRight: 14,
  },

  middle: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },

  author: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },

  time: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
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
