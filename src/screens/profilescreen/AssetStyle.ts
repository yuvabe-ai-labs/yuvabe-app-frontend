import { StyleSheet } from 'react-native';
import { COLORS } from '../../utils/theme';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 30,
  },

  assetCard: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 18,

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,

    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFCA2D',
  },
  assetSvgWrapper: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },

  assetIcon: {
    fontSize: 48, // BIG ICON
    marginRight: 18,
  },

  assetName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },

  assetType: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },

  statusBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    fontWeight: '500',
    color: '#777',
  },
});
