import { ChevronLeft, Droplets, TrendingUp } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { storage } from '../../../store/storage';
import { showToast } from '../../../utils/ToastHelper';

// ⬅️ BACKEND API FILE
import {
  fetchWaterLogs,
  logWater,
  updateWaterLog,
} from '../../../api/wellbeing/wellBeingApi';
import { TEXT_STYLES } from '../../../utils/theme';
import { styles } from './WaterTrackingStyles';

const DAILY_GOAL = 3000;
const presetAmounts = [250, 500, 1000];
const WATER_TODAY = 'water_today';
const WATER_LAST_UPDATE = 'water_last_update';

const WaterTrackerScreen = ({ navigation }: any) => {
  const [todayTotal, setTodayTotal] = useState(0);
  const [lastLogId, setLastLogId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [showSave, setShowSave] = useState(false);

  const fillAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  // 🔵 Load water from backend first, fallback to storage
  useEffect(() => {
    const loadData = async () => {
      try {
        const logs = await fetchWaterLogs();

        const today = new Date().toDateString();
        const todaysLogs = logs.filter(log => {
          const d = new Date(log.logged_at);
          return d.toDateString() === today;
        });

        if (todaysLogs.length > 0) {
          const latest = todaysLogs[todaysLogs.length - 1];
          setTodayTotal(latest.amount_ml);
          setLastLogId(latest.id);
          storage.set(WATER_TODAY, latest.amount_ml);
        } else {
          const saved = storage.getNumber(WATER_TODAY) ?? 0;
          setTodayTotal(saved);
        }
      } catch (err) {
        console.log('API failed, using local:', err);
        const saved = storage.getNumber(WATER_TODAY) ?? 0;
        setTodayTotal(saved);
      }
    };

    loadData();
  }, []);

  // 🔵 Animate water level when todayTotal changes
  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: todayTotal / DAILY_GOAL,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [todayTotal]);

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
    setTodayTotal(newTotal);
    storage.set(WATER_TODAY, newTotal);
    setShowSave(true);
    setModalVisible(false);
  };

  const removeWater = () => {
    pulseAnimation();
    const newTotal = Math.max(todayTotal - 250, 0);
    setTodayTotal(newTotal);
    storage.set(WATER_TODAY, newTotal);
    setShowSave(true);
  };

  // 🔵 Save to database (POST first time → PUT next time)
  const handleSaveToDB = async () => {
    setIsSaving(true);
    try {
      let saved;

      if (lastLogId) {
        saved = await updateWaterLog(lastLogId, todayTotal);
      } else {
        saved = await logWater(todayTotal);
        setLastLogId(saved.id);
      }

      storage.set(WATER_LAST_UPDATE, Date.now());
      storage.set(WATER_TODAY, todayTotal);

      setShowSave(false);
      showToast('Success', 'Water intake saved!');
    } catch (err) {
      console.log('Failed to save:', err);
      showToast('Error', 'Failed to update DB');
    } finally {
      setIsSaving(false);
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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={28} color="#000" />
          </TouchableOpacity>

          <Text style={[TEXT_STYLES.title, { marginLeft: 10 }]}>
            Water Intake
          </Text>
        </View>

        <Image
          source={require('../../../assets/logo/yuvabe-logo.png')}
          style={{
            width: 40,
            height: 40,
            resizeMode: 'contain',
          }}
        />
      </View>

      {/* Percentage Boxes */}
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

      {/* Glass UI */}
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

      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
          />
        </View>
      </View>

      {/* Plus / Minus buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.removeButton]}
          onPress={removeWater}
        >
          <Text style={styles.buttonText}>−</Text>
          <Text style={styles.buttonLabel}>Remove</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.addButton]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>+</Text>
          <Text style={styles.buttonLabel}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* SAVE BUTTON */}
      {showSave && (
        <Animated.View style={styles.saveButtonContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveToDB}
            disabled={isSaving}
          >
            <TrendingUp size={20} color="white" />
            <Text style={styles.saveText}>
              {isSaving ? 'Saving...' : 'Save Progress'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Amount</Text>
            <Text style={styles.modalSubtitle}>
              How much water did you drink?
            </Text>

            <View style={styles.optionsContainer}>
              {presetAmounts.map(ml => (
                <TouchableOpacity
                  key={ml}
                  style={styles.mlButton}
                  onPress={() => addWater(ml)}
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
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default WaterTrackerScreen;
