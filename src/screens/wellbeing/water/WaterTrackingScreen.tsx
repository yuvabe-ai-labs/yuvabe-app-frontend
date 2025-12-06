'use client';

import {
  ChevronLeft,
  ChevronRight,
  Droplets,
  TrendingUp,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { storage } from '../../../store/storage';
import { showToast } from '../../../utils/ToastHelper';
import { useWeeklyWaterChart } from './useWeeklyWaterChart';

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
  const [mode, setMode] = useState<'add' | 'remove'>('add');

  const fillAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  let saveTimeout: any = null;

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

  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: todayTotal / DAILY_GOAL,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [fillAnim, todayTotal]);

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

  const autoSaveToDB = (value: number) => {
    clearTimeout(saveTimeout);

    saveTimeout = setTimeout(async () => {
      try {
        if (lastLogId) {
          const saved = await updateWaterLog(lastLogId, value);
          console.log(saved);
        } else {
          const saved = await logWater(value);
          setLastLogId(saved.id);
        }

        storage.set(WATER_TODAY, value);
        storage.set(WATER_LAST_UPDATE, Date.now());
        console.log('Auto synced to DB');
      } catch (err) {
        console.log('Auto-sync failed:', err);
        showToast('Error', 'Failed to update. Will retry.', 'error');
      }
    }, 800);
  };

  const addWater = (ml: number) => {
    pulseAnimation();
    const newTotal = Math.min(todayTotal + ml, DAILY_GOAL);
    setTodayTotal(newTotal);
    storage.set(WATER_TODAY, newTotal);
    setModalVisible(false);
    autoSaveToDB(newTotal);
  };

  const removeWater = (ml = 250) => {
    pulseAnimation();
    const newTotal = Math.max(todayTotal - ml, 0);
    setTodayTotal(newTotal);
    storage.set(WATER_TODAY, newTotal);
    setModalVisible(false);
    autoSaveToDB(newTotal);
  };

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
      showToast('Success', 'Water intake saved!', 'success');
    } catch (err) {
      console.log('Failed to save:', err);
      showToast('Error', 'Failed to update DB', 'error');
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
  const { weekOffset, setWeekOffset, chartData, isLoading, error } =
    useWeeklyWaterChart();

  const screenWidth = Dimensions.get('window').width;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeft size={28} color="#000" />
            </TouchableOpacity>

            <Text style={[TEXT_STYLES.title, { marginLeft: 10 }]}>
              Water Intake
            </Text>
          </View>
        </View>

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

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
            />
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.removeButton]}
            onPress={() => {
              setMode('remove');
              setModalVisible(true);
            }}
          >
            <Text style={styles.buttonText}>−</Text>
            <Text style={styles.buttonLabel}>Remove</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.addButton]}
            onPress={() => {
              setMode('add');
              setModalVisible(true);
            }}
          >
            <Text style={styles.buttonText}>+</Text>
            <Text style={styles.buttonLabel}>Add</Text>
          </TouchableOpacity>
        </View>

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

        <View style={{ marginTop: 30 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => setWeekOffset(prev => prev - 1)}
              disabled={isLoading}
            >
              <ChevronLeft size={28} color={isLoading ? '#ccc' : '#000'} />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: '700' }}>
              Weekly Intake
            </Text>
            <TouchableOpacity
              disabled={weekOffset === 0 || isLoading}
              onPress={() => setWeekOffset(prev => prev + 1)}
            >
              <ChevronRight
                size={28}
                color={weekOffset === 0 || isLoading ? '#999' : '#000'}
              />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View
              style={{
                height: 280,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 14, color: '#999' }}>
                Loading chart...
              </Text>
            </View>
          ) : error ? (
            <View
              style={{
                height: 280,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 14, color: '#ef4444' }}>{error}</Text>
            </View>
          ) : chartData ? (
            // START CHART UI WRAPPER
            <View
              style={{
                marginHorizontal: 15,
                overflow: 'hidden',
                borderRadius: 12, // **UI FIX: Rounded corners**
                backgroundColor: '#f8fafc', // **UI FIX: Light gray background**
                // **UI FIX: Shadow for depth**
                ...Platform.select({
                  ios: {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                  },
                  android: {
                    elevation: 4,
                  },
                }),
              }}
            >
              <View style={{ marginVertical: 10 }}>
                <BarChart
                  data={chartData}
                  // **LAYOUT FIX 1: Set chart width slightly wider than the screen**
                  width={screenWidth - 28}
                  height={280}
                  yAxisLabel=""
                  yAxisSuffix="ml"
                  yAxisInterval={500}
                  fromZero={true}
                  segments={5}
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#f8fafc',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                    labelColor: (opacity = 1) =>
                      `rgba(100, 116, 139, ${opacity})`,
                    style: {
                      marginVertical: 0,
                      borderRadius: 0,
                      // **LAYOUT FIX 2: Aggressive padding (110) to push content left**
                      paddingRight: 10,
                      paddingLeft: 20,
                    },
                    propsForDots: {
                      r: '4',
                      strokeWidth: '2',
                      stroke: '#3b82f6',
                    },
                    propsForLabels: {
                      fontSize: 12,
                      fontWeight: '600',
                    },
                    propsForBackgroundLines: {
                      strokeDasharray: '5,5',
                      stroke: '#e2e8f0',
                    },
                  }}
                  withVerticalLabels={true}
                  withHorizontalLabels={true}
                  withInnerLines={false}
                  showValuesOnTopOfBars={true}
                  flatColor={true}
                />
              </View>
            </View>
          ) : (
            // END CHART UI WRAPPER
            <View
              style={{
                height: 280,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 14, color: '#999' }}>
                No data for this week
              </Text>
            </View>
          )}
        </View>

        <Modal visible={modalVisible} transparent animationType="fade">
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalBackground}
            onPress={() => setModalVisible(false)} // CLOSE ON TAP OUTSIDE
          >
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
                      onPress={() => {
                        if (mode === 'add') addWater(ml);
                        else removeWater(ml);
                      }}
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
          </TouchableOpacity>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WaterTrackerScreen;
