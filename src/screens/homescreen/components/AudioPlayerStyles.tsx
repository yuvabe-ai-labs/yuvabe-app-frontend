import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    height: '70%',
    marginTop: 'auto',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#592AC7',
    paddingHorizontal: 36,
    paddingTop: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  arrowWrapper: {
    width: 40,
    justifyContent: 'center',
  },

  arrow: {
    fontSize: 26,
  },

  trackContainer: {
    height: 4,
    backgroundColor: '#E8DAF7',
    borderRadius: 2,
    marginVertical: 10,
    overflow: 'hidden',
  },

  trackProgress: {
    height: 4,
    backgroundColor: '#592AC7',
    borderRadius: 2,
  },

  headerText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },

  headerSpacer: {
    width: 40,
  },

  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginTop: 30,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
  },

  author: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 10,
  },

  progressWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 0,
  },

  timestamp: {
    fontSize: 12,
    color: '#BBB1FA',
  },

  trackLine: {
    height: 3,
    backgroundColor: '#E8DAF7',
    borderRadius: 2,
    marginVertical: 10,
  },

  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
  },

  icon: {
    fontSize: 26,
    color: '#444',
  },

  playButton: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: '#592AC7',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
