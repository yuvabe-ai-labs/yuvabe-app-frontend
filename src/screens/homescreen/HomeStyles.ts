import { StyleSheet } from 'react-native';
import { COLORS, SIZES, TEXT_STYLES } from '../../utils/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.padding,
    backgroundColor: COLORS.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base * 2,
  },

  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: SIZES.base,
  },

  welcomeText: {
    ...TEXT_STYLES.large,
  },

  thoughtContainer: {
    backgroundColor: COLORS.lightGray,
    padding: SIZES.base * 2,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base * 2.5,
  },

  thoughtTitle: {
    ...TEXT_STYLES.title,
    fontSize: SIZES.lg,
    marginBottom: 4,
  },

  thoughtText: {
    ...TEXT_STYLES.regular,
    fontStyle: 'italic',
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
});

export default styles;
