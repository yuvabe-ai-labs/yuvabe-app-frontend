import { StyleSheet } from 'react-native';

export const newLeaveStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },

  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },

  // ======== COUNT CARDS ========
  countContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },

  countCard: {
    flex: 1,
    backgroundColor: '#FFF8E6', // overwritten below for casual
    borderWidth: 1,
    borderColor: '#F6DFA8',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginRight: 10,
  },

  countCardCasual: {
    flex: 1,
    backgroundColor: '#F4EDFF',
    borderWidth: 1,
    borderColor: '#C9B8F5',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginLeft: 10,
  },

  countLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },

  countValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 2,
  },

  countSub: {
    fontSize: 12,
    color: '#777',
  },

  // ======== LABEL ========
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
  },

  // ======== DROPDOWN ========
  dropdownBox: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 20,
    backgroundColor: '#FFF',
  },
  dropdownText: {
    fontSize: 15,
    color: '#000',
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    backgroundColor: '#FFF',
    marginBottom: 20,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },

  // ======== DATE BOXES ========
  dateRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  dateBox: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#FFF',
  },

  // ======== REASON BOX ========
  reasonBox: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    minHeight: 120,
    padding: 14,
    textAlignVertical: 'top',
    backgroundColor: '#FFF',
  },

  // ======== BUTTON ========
  btn: {
    backgroundColor: '#C7A5FF',
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
