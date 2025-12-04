import { useEffect, useState } from 'react';
import { fetchWaterLogsForChart } from '../../../api/wellbeing/wellBeingApi';

export const useWeeklyWaterChart = () => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [{ data: [] }],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const getWeekDays = (offset: number) => {
    const today = new Date();
    const start = getStartOfWeek(today);
    start.setDate(start.getDate() + offset * 7);
    return [...Array(7)].map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  const loadChart = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const logs = await fetchWaterLogsForChart();
      const weekDays = getWeekDays(weekOffset);

      const labels = weekDays.map(day =>
        day.toLocaleDateString('en-US', { weekday: 'short' }),
      );

      const datasets = weekDays.map(day => {
        const dailyLogs = logs.filter(log => {
          const d = new Date(log.logged_at);
          return d.toDateString() === day.toDateString();
        });

        const total = dailyLogs.length
          ? dailyLogs[dailyLogs.length - 1].amount_ml
          : 0;

        return Math.round(total);
      }); 

      const formatted = {
        labels: labels,
        datasets: [{ data: datasets }],
      };

      setChartData(formatted);
    } catch (err) {
      console.log('📉 Chart load failed:', err);
      setError('Failed to load chart data');
      setChartData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChart();
  }, [weekOffset]);

  return {
    weekOffset,
    setWeekOffset,
    chartData,
    isLoading,
    error,
  };
};
