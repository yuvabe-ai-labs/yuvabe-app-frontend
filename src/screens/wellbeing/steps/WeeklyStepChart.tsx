import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { getWeeklySteps } from '../../../api/wellbeing/wellBeingApi';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function WeeklyStepsChart() {
  const [data, setData] = useState<any[]>([]);
  const maxSteps = Math.max(...data.map(d => d.value), 1000);
  const roundedMax = Math.ceil(maxSteps / 1000) * 1000;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getWeeklySteps();
        const weekData = res.data;

        const chartData = days.map(day => ({
          value: weekData[day] || 0,
          label: day,
          frontColor: '#60A5FA',
        }));

        setData(chartData);
      } catch (e) {
        console.log('[WEEKLY STEPS FAILED]', e);
      }
    };

    load();
  }, []);

  return (
    <View className="bg-white rounded-2xl p-4 border border-slate-200">
      <View className="flex-row justify-between mb-4">
        <Text className="text-lg font-semibold text-slate-900">Statistics</Text>
        <Text className="text-sm text-slate-500">This week</Text>
      </View>

      <BarChart
        data={data}
        barWidth={22}
        spacing={18}
        roundedTop
        hideRules
        yAxisThickness={0}
        xAxisThickness={0}
        maxValue={roundedMax}
        stepValue={1000}
        noOfSections={roundedMax / 1000}
        yAxisLabelWidth={45}
        yAxisTextStyle={{ color: '#94A3B8' }}
        xAxisLabelTextStyle={{ color: '#64748B' }}
      />
    </View>
  );
}
