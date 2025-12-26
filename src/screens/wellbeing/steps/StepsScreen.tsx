import {
  parseStepData,
  startStepCounterUpdate,
  stopStepCounterUpdate,
} from '@dongminyu/react-native-step-counter';
import notifee, { AndroidImportance } from '@notifee/react-native'; // Import Notifee
import { useNavigation } from '@react-navigation/native';
import {
  ChevronLeft,
  Flame,
  Footprints,
  MapPin,
  Target,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BackgroundService from 'react-native-background-actions';
import { PieChart } from 'react-native-gifted-charts';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

// Store imports
import {
  loadLastHardwareValue,
  loadTodaySteps,
  saveLastHardwareValue,
  saveTodaySteps,
} from '../../../store/storage';
import { getStepPermission } from '../../../utils/permission';

// --- BACKGROUND TASK LOGIC ---
const sleep = (time: number) =>
  new Promise<void>(resolve => setTimeout(() => resolve(), time));

const veryIntensiveTask = async (taskDataArguments: any) => {
  const { delay } = taskDataArguments;
  let previousHardwareValue = loadLastHardwareValue();
  let isBaselineEstablished = previousHardwareValue > 0;

  console.log(`BG Service: Starting Loop.`);

  while (BackgroundService.isRunning()) {
    try {
      stopStepCounterUpdate();
    } catch (e) {
      console.log(e);
    }

    const startPoint = new Date();
    startPoint.setFullYear(2000, 0, 1);

    await new Promise<void>(resolve => {
      let readingReceived = false;
      startStepCounterUpdate(startPoint, raw => {
        if (readingReceived) return;
        readingReceived = true;

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
            const currentTotal = loadTodaySteps();
            const newTotal = currentTotal + diff;
            saveTodaySteps(newTotal);
            saveLastHardwareValue(currentHardwareValue);
            previousHardwareValue = currentHardwareValue;

            // NOTE: We do NOT update the notification here.
            // This prevents the "1" badge from reappearing constantly.
            console.log(`[STEP DETECTED] +${diff}. New Total: ${newTotal}`);
          }
        }
        resolve();
      });

      setTimeout(() => {
        if (!readingReceived) resolve();
      }, 1000);
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

// --- UI COMPONENT ---

export default function StepScreen() {
  const navigation = useNavigation();
  const [steps, setSteps] = useState(0);
  const dailyGoal = 10000;

  // Derived metrics
  const calories = Math.floor(steps * 0.04);
  const distance = (steps * 0.0008).toFixed(2);

  useEffect(() => {
    const init = async () => {
      await getStepPermission();
      setSteps(loadTodaySteps());

      // --- FIX: Force create a "Silent" Channel first ---
      // This tells Android: "Create the channel 'rn-background-actions' with NO BADGES"
      // The background service will then use this existing channel instead of making a noisy one.
      await notifee.createChannel({
        id: 'rn-background-actions',
        name: 'Background Service',
        badge: false, // <--- THIS REMOVES THE "1" BADGE
        importance: AndroidImportance.LOW, // Prevents sound/peeking
      });

      if (!BackgroundService.isRunning()) {
        await BackgroundService.start(veryIntensiveTask, options);
      }
    };
    init();

    const interval = setInterval(() => {
      setSteps(loadTodaySteps());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const pieData = [
    { value: steps, color: '#10B981', focused: true },
    { value: Math.max(dailyGoal - steps, 0), color: '#E2E8F0' },
  ];

  return (
    <LinearGradient colors={['#ffffff', '#f1f5f9']} style={styles.container}>
      <SafeAreaView className="flex-1">
        {/* HEADER */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 14,
            paddingHorizontal: 20,
            marginBottom: 10,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={28} color="#000" />
          </TouchableOpacity>

          <View style={{ flex: 1, alignItems: 'center', marginLeft: -28 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#000' }}>
              Activity Tracker
            </Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {/* CHART */}
          <View className="items-center justify-center mb-10 mt-4">
            <View style={{ transform: [{ rotate: '180deg' }] }}>
              <PieChart
                data={pieData}
                donut
                showGradient
                sectionAutoFocus
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
                    <Footprints
                      color="#10B981"
                      size={32}
                      style={{ marginBottom: 4 }}
                    />
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
            <View className="bg-white w-[47%] p-4 rounded-2xl border border-slate-200 shadow-sm items-center">
              <View className="bg-orange-100 p-3 rounded-full mb-2">
                <Flame color="#F97316" size={24} />
              </View>
              <Text className="text-slate-900 text-xl font-bold">
                {calories}
              </Text>
              <Text className="text-slate-500 text-xs uppercase tracking-wider">
                Kcal Burned
              </Text>
            </View>

            <View className="bg-white w-[47%] p-4 rounded-2xl border border-slate-200 shadow-sm items-center">
              <View className="bg-blue-100 p-3 rounded-full mb-2">
                <MapPin color="#3B82F6" size={24} />
              </View>
              <Text className="text-slate-900 text-xl font-bold">
                {distance}
              </Text>
              <Text className="text-slate-500 text-xs uppercase tracking-wider">
                Kilometers
              </Text>
            </View>

            <View className="bg-white w-full p-4 rounded-2xl border border-slate-200 shadow-sm flex-row items-center justify-between mt-2">
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
              <View className="h-12 w-1 bg-slate-100 rounded-full" />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
