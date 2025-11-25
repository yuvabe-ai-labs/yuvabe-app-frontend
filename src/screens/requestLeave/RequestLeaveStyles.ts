import { StyleSheet } from 'react-native';

export const newLeaveStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },

  // Heading
  heading: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },

  // Count Row
  countContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  countCard: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },

  countLabel: {
    fontSize: 14,
    color: '#777',
  },

  countValue: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 5,
  },

  // Label
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
  },

  // Dropdown
  dropdownBox: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },

  dropdownText: {
    fontSize: 16,
  },

  dropdownMenu: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginTop: 5,
    backgroundColor: '#fff',
  },

  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  // Date Row
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  dateBox: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },

  // Reason box
  reasonBox: {
    height: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    textAlignVertical: 'top',
    marginTop: 5,
  },

  // Button
  btn: {
    marginTop: 25,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },

  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
