import { ChevronLeft, Droplets, TrendingUp } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { storage } from '../../../store/storage';
import { showToast } from '../../../utils/ToastHelper';

const DAILY_GOAL = 3000;
const presetAmounts = [250, 500, 1000];
const WATER_TODAY = 'water_today';
const WATER_LAST_UPDATE = 'water_last_update';
const { height: screenHeight } = Dimensions.get('window');

const WaterTrackerScreen = ({ navigation }: any) => {
  const [todayTotal, setTodayTotal] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const fillAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const savedValue = storage.getNumber(WATER_TODAY) ?? 0;
    setTodayTotal(savedValue);
  }, []);

  useEffect(() => {
    animateGlass();
  }, [todayTotal]);

  const animateGlass = () => {
    Animated.timing(fillAnim, {
      toValue: todayTotal / DAILY_GOAL,
      duration: 800,
      useNativeDriver: false,
    }).start();
  };

  const pulseAnimation = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const addWater = (ml: number) => {
    pulseAnimation();
    const newTotal = Math.min(todayTotal + ml, DAILY_GOAL);
    storage.set(WATER_TODAY, newTotal);
    setTodayTotal(newTotal);
    setShowSave(true);
    setModalVisible(false);
    if (newTotal === DAILY_GOAL) {
      showToast('Success', '🎉 Daily goal reached!');
    }
  };

  const removeWater = () => {
    pulseAnimation();
    const newTotal = Math.max(todayTotal - 250, 0);
    storage.set(WATER_TODAY, newTotal);
    setTodayTotal(newTotal);
    setShowSave(true);
  };

  const handleSaveToDB = async () => {
    try {
      storage.set(WATER_LAST_UPDATE, Date.now());
      setShowSave(false);
      showToast('Success', 'Water intake saved!');
    } catch (e) {
      console.log(e);
      showToast('Error', 'Failed to update DB');
    }
  };

  const waterHeight = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const progressPercent = Math.round((todayTotal / DAILY_GOAL) * 100);
  const remaining = Math.max(DAILY_GOAL - todayTotal, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={28} color="#0066cc" />
        </TouchableOpacity>
        <Text style={styles.title}>Water Intake</Text>
        <View style={styles.headerIcon}>
          <Droplets size={28} color="#3b82f6" />
        </View>
      </View>

      {/* Progress Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Today's Intake</Text>
          <Text style={styles.statValue}>{todayTotal}</Text>
          <Text style={styles.statUnit}>ml</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Remaining</Text>
          <Text style={styles.statValue}>{remaining}</Text>
          <Text style={styles.statUnit}>ml</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Progress</Text>
          <Text style={styles.statValue}>{progressPercent}%</Text>
          <Text style={styles.statUnit}>done</Text>
        </View>
      </View>

      {/* Glass Container */}
      <Animated.View
        style={[styles.glassWrapper, { transform: [{ scale: scaleAnim }] }]}
      >
        <View style={styles.glassOuter}>
          <View style={styles.glassInner}>
            <Animated.View
              style={[
                styles.waterFill,
                { height: waterHeight },
                todayTotal >= DAILY_GOAL && styles.waterFillComplete,
              ]}
            />
            <View style={styles.centerTextWrapper}>
              <Text style={styles.centerText}>{todayTotal} ml</Text>
              <Text style={styles.centerSubtext}>of {DAILY_GOAL} ml</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
          />
        </View>
      </View>

      {/* Add / Remove buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.removeButton]}
          onPress={removeWater}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>−</Text>
          <Text style={styles.buttonLabel}>Remove</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.addButton]}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>+</Text>
          <Text style={styles.buttonLabel}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* SAVE BUTTON */}
      {showSave && (
        <Animated.View style={[styles.saveButtonContainer]}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveToDB}
            activeOpacity={0.85}
          >
            <TrendingUp size={20} color="white" />
            <Text style={styles.saveText}>Save Progress</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* ML Options Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Amount</Text>
            <Text style={styles.modalSubtitle}>
              How much water did you drink?
            </Text>

            <View style={styles.optionsContainer}>
              {presetAmounts.map((ml, index) => (
                <TouchableOpacity
                  key={ml}
                  style={styles.mlButton}
                  onPress={() => addWater(ml)}
                  activeOpacity={0.7}
                >
                  <View style={styles.mlIconContainer}>
                    <Droplets size={24} color="#3b82f6" />
                  </View>
                  <View style={styles.mlTextContainer}>
                    <Text style={styles.mlText}>{ml}</Text>
                    <Text style={styles.mlLabel}>milliliters</Text>
                  </View>
                  <Text style={styles.mlArrow}>›</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
              activeOpacity={0.8}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
    marginBottom: 24,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: '#1a202c',
  },
  headerIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0066cc',
  },
  statUnit: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  glassWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  glassOuter: {
    width: 140,
    height: 280,
    borderWidth: 3,
    borderColor: '#3b82f6',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    padding: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    overflow: 'hidden',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  glassInner: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    overflow: 'hidden',
  },
  waterFill: {
    width: '100%',
    backgroundColor: 'rgba(59, 130, 246, 0.7)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  waterFillComplete: {
    backgroundColor: 'rgba(34, 197, 94, 0.7)',
  },
  centerTextWrapper: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    top: '50%',
  },
  centerText: {
    fontSize: 22,
    color: '#1a202c',
    fontWeight: '700',
  },
  centerSubtext: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  progressBarContainer: {
    marginBottom: 24,
    paddingHorizontal: 0,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  addButton: {
    backgroundColor: '#3b82f6',
  },
  removeButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    fontSize: 32,
    color: 'white',
    fontWeight: '300',
    lineHeight: 36,
  },
  buttonLabel: {
    fontSize: 12,
    color: 'white',
    marginTop: 4,
    fontWeight: '500',
  },
  saveButtonContainer: {
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  saveText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalBox: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    gap: 20,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  optionsContainer: {
    gap: 12,
  },
  mlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  mlIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  mlTextContainer: {
    flex: 1,
  },
  mlText: {
    color: '#1a202c',
    fontSize: 16,
    fontWeight: '600',
  },
  mlLabel: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
  },
  mlArrow: {
    fontSize: 24,
    color: '#cbd5e1',
    marginLeft: 8,
  },
  closeButton: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  closeText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
  },
});

export default WaterTrackerScreen;
