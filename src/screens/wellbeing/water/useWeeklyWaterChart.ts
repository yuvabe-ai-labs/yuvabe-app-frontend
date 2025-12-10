import { useEffect, useState } from 'react';
import { fetchWaterLogsForChart } from '../../../api/wellbeing/wellBeingApi';

export const useWeeklyWaterChart = (todayAmount: number) => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

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

  const getWeekRange = (offset: number) => {
    const now = new Date();

    // Get Monday of current week (change to Sunday if needed)
    const day = now.getDay(); // 0 = Sunday, 1 = Monday
    const diff = now.getDate() - day + 1; // Monday-based week

    const start = new Date(now);
    start.setDate(diff + offset * 7);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return { start, end };
  };

  const { start: weekStart, end: weekEnd } = getWeekRange(weekOffset);

  const format = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const weekLabel = `${format(weekStart)} ➜ ${format(weekEnd)}`;

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
        // ALWAYS override today with current UI amount
        if (day.toDateString() === new Date().toDateString()) {
          return todayAmount;
        }

        const dailyLogs = logs.filter(log => {
          const d = new Date(log.logged_at);
          return d.toDateString() === day.toDateString();
        });

        return dailyLogs.length ? dailyLogs[dailyLogs.length - 1].amount_ml : 0;
      });

      setChartData({
        labels,
        datasets: [{ data: datasets }],
      });
    } catch (err) {
      console.log('Chart load failed:', err);
      setError('Failed to load chart data');
      setChartData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 Force chart to reload EVERY time todayAmount changes
  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [todayAmount]);

  useEffect(() => {
    loadChart();
  }, [weekOffset, refreshKey]); // now refreshKey ensures updated state is used

  return {
    weekOffset,
    setWeekOffset,
    chartData,
    isLoading,
    weekLabel,
    error,
    refresh: () => setRefreshKey(prev => prev + 1),
  };
};
