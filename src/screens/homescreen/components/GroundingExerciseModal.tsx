import { Candy, Ear, Eye, Hand, Wind } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  visible: boolean;
  onDone: () => void;
  onClose: () => void;
}

const options = [
  { key: 'see', label: 'See', icon: Eye },
  { key: 'hear', label: 'Hear', icon: Ear },
  { key: 'touch', label: 'Touch', icon: Hand },
  { key: 'smell', label: 'Smell', icon: Wind },
  { key: 'taste', label: 'Taste', icon: Candy },
];

const GroundingExerciseModal: React.FC<Props> = ({
  visible,
  onDone,
  onClose,
}) => {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✖</Text>
          </TouchableOpacity>

          <Text style={styles.title}>5-4-3-2-1 Grounding Exercise</Text>
          <Text style={styles.subtitle}>Choose a sense to focus on</Text>

          <View style={styles.row}>
            {options.map(opt => {
              const IconComponent = opt.icon;
              const active = selected.includes(opt.key);

              return (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => {
                    setSelected(prev => {
                      if (prev.includes(opt.key)) {
                        return prev.filter(k => k !== opt.key);
                      } else {
                        return [...prev, opt.key];
                      }
                    });
                  }}
                  style={[styles.option, active && styles.optionActive]}
                >
                  <IconComponent
                    size={30}
                    strokeWidth={2}
                    color={active ? '#007AFF' : '#555'}
                  />
                  <Text style={[styles.label, active && styles.labelActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {selected.length === options.length && (
            <TouchableOpacity style={styles.doneButton} onPress={onDone}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default GroundingExerciseModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: '#fff',
    padding: 25,
    width: '85%',
    borderRadius: 14,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  option: {
    width: 80,
    height: 80,
    backgroundColor: '#eee',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    opacity: 0.5,
  },
  optionActive: {
    opacity: 1,
    backgroundColor: '#dceeff',
  },
  label: {
    fontSize: 12,
    marginTop: 6,
    color: '#555',
  },
  labelActive: {
    fontWeight: '600',
    color: '#007AFF',
  },
  doneButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  doneText: {
    color: '#fff',
    fontWeight: '700',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeText: {
    fontSize: 20,
  },
});
