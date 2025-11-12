import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  thoughtContainer: {
    backgroundColor: '#f3f4f6',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  thoughtTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#555',
    marginBottom: 5,
  },
  thoughtText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  notificationCard: {
    backgroundColor: '#fff3cd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    fontSize: 18,
    color: '#333',
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  emojiButton: {
    padding: 5,
  },
  emoji: {
    fontSize: 28,
  },
  moodHistoryContainer: {
    marginTop: 0,
  },
  moodHistoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#444',
  },
});

export default styles;
