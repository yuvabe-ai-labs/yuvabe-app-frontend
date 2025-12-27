import {
  parseStepData,
  startStepCounterUpdate,
  stopStepCounterUpdate,
} from '@dongminyu/react-native-step-counter';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { useNavigation } from '@react-navigation/native';
import {
  ChevronLeft,
  Flame,
  Footprints,
  MapPin,
  Target,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  AppState,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BackgroundService from 'react-native-background-actions';
import { PieChart } from 'react-native-gifted-charts';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

// API & Store
import { getStepsHistory } from '../../../api/steps-api/stepApi';
import {
  loadLastHardwareValue,
  loadTodaySteps,
  saveLastHardwareValue,
  saveTodaySteps,
} from '../../../store/storage';
import { getStepPermission } from '../../../utils/permission';
import { forceSyncSteps, syncStepsIfNeeded } from './stepSync';
import WeeklyStepsChart from './WeeklyStepChart';

// ---------------- BACKGROUND TASK ----------------

const sleep = (time: number) =>
  new Promise<void>(resolve => setTimeout(resolve, time));

const veryIntensiveTask = async (taskDataArguments: any) => {
  const { delay } = taskDataArguments;
  let previousHardwareValue = loadLastHardwareValue();
  let isBaselineEstablished = previousHardwareValue > 0;

  console.log('BG Service: Starting Loop.');

  while (BackgroundService.isRunning()) {
    try {
      stopStepCounterUpdate();
    } catch {}

    const startPoint = new Date();
    startPoint.setFullYear(2000, 0, 1);

    await new Promise<void>(resolve => {
      let received = false;

      startStepCounterUpdate(startPoint, raw => {
        if (received) return;
        received = true;

        const data = parseStepData(raw);
        const currentHardwareValue = data.steps;

        if (!isBaselineEstablished) {
          saveLastHardwareValue(currentHardwareValue);
          previousHardwareValue = currentHardwareValue;
          isBaselineEstablished = true;
        } else {
          let diff = currentHardwareValue - previousHardwareValue;
          if (currentHardwareValue < previousHardwareValue) {
            diff = currentHardwareValue;
          }

          if (diff > 0) {
            const newTotal = loadTodaySteps() + diff;
            saveTodaySteps(newTotal);
            saveLastHardwareValue(currentHardwareValue);
            previousHardwareValue = currentHardwareValue;
            console.log(`[STEP DETECTED] +${diff}. New Total: ${newTotal}`);
          }
        }
        resolve();
      });

      setTimeout(resolve, 1000);
    });

    await sleep(delay);
  }

  stopStepCounterUpdate();
};

const options = {
  taskName: 'Step_Counter_Task',
  taskTitle: 'Pedometer Active',
  taskDesc: 'Tracking your daily steps...',
  taskIcon: {
    name: 'ic_stat_yuvabe',
    type: 'drawable',
  },
  color: '#ffffff',
  linkingURI: 'package://com.yuvabe',
  parameters: {
    delay: 2000,
  },
  type: 'dataSync',
};

// ---------------- UI COMPONENT ----------------

export default function StepScreen() {
  const navigation = useNavigation();
  const [steps, setSteps] = useState(0);
  const dailyGoal = 10000;

  const calories = Math.floor(steps * 0.04);
  const distance = (steps * 0.0008).toFixed(2);

  // Initial load
  useEffect(() => {
    const init = async () => {
      await getStepPermission();

      try {
        const res = await getStepsHistory();
        const latest = res.data?.[0];

        if (latest?.steps_count != null) {
          saveTodaySteps(latest.steps_count);
          setSteps(latest.steps_count);
        } else {
          setSteps(loadTodaySteps());
        }
      } catch {
        setSteps(loadTodaySteps());
      }

      await notifee.createChannel({
        id: 'rn-background-actions',
        name: 'Background Service',
        badge: false,
        importance: AndroidImportance.LOW,
      });

      if (!BackgroundService.isRunning()) {
        await BackgroundService.start(veryIntensiveTask, options);
      }
    };

    init();

    const interval = setInterval(() => {
      const currentSteps = loadTodaySteps();
      setSteps(currentSteps);
      syncStepsIfNeeded();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Sync on background
  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state === 'background' || state === 'inactive') {
        forceSyncSteps();
      }
    });
    return () => sub.remove();
  }, []);

  const pieData = [
    { value: steps, color: '#10B981', focused: true },
    { value: Math.max(dailyGoal - steps, 0), color: '#E2E8F0' },
  ];

  return (
    <LinearGradient colors={['#ffffff', '#f1f5f9']} style={styles.container}>
      <SafeAreaView className="flex-1">
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={28} color="#000" />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <Text style={styles.headerText}>Activity Tracker</Text>
          </View>
        </View>

        {/* SCROLLABLE CONTENT */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <View style={{ paddingHorizontal: 20 }}>
            {/* PIE CHART */}
            <View className="items-center justify-center mb-10 mt-4">
              <View style={{ transform: [{ rotate: '180deg' }] }}>
                <PieChart
                  data={pieData}
                  donut
                  showGradient={false}
                  radius={120}
                  innerRadius={95}
                  innerCircleColor="#ffffff"
                  centerLabelComponent={() => (
                    <View
                      style={{
                        transform: [{ rotate: '180deg' }],
                        alignItems: 'center',
                      }}
                    >
                      <Footprints color="#10B981" size={32} />
                      <Text className="text-slate-900 text-4xl font-bold">
                        {steps.toLocaleString()}
                      </Text>
                      <Text className="text-slate-500 text-sm">
                        of {dailyGoal.toLocaleString()}
                      </Text>
                    </View>
                  )}
                />
              </View>
            </View>

            {/* METRICS */}
            <View className="flex-row justify-between flex-wrap gap-4">
              <Metric
                icon={<Flame color="#F97316" size={24} />}
                label="Kcal Burned"
                value={calories}
              />
              <Metric
                icon={<MapPin color="#3B82F6" size={24} />}
                label="Kilometers"
                value={distance}
              />

              <View className="bg-white w-full p-4 rounded-2xl border border-slate-200 shadow-sm flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="bg-emerald-100 p-3 rounded-full mr-4">
                    <Target color="#10B981" size={24} />
                  </View>
                  <View>
                    <Text className="text-slate-900 text-lg font-bold">
                      {steps >= dailyGoal ? 'Goal Reached!' : 'Keep Going!'}
                    </Text>
                    <Text className="text-slate-500 text-xs">
                      {steps >= dailyGoal
                        ? "Great job, you've hit your target."
                        : `${(dailyGoal - steps).toLocaleString()} steps remaining`}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* WEEKLY CHART (LAST) */}
            <View style={{ marginTop: 24 }}>
              <WeeklyStepsChart />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ---------------- SMALL COMPONENT ----------------

const Metric = ({ icon, value, label }: any) => (
  <View className="bg-white w-[47%] p-4 rounded-2xl border border-slate-200 shadow-sm items-center">
    <View className="p-3 rounded-full mb-2">{icon}</View>
    <Text className="text-slate-900 text-xl font-bold">{value}</Text>
    <Text className="text-slate-500 text-xs uppercase tracking-wider">
      {label}
    </Text>
  </View>
);

// ---------------- STYLES ----------------

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
    marginLeft: -28,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
});
