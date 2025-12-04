import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Static Data for Testing ---
const staticChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      data: [1500, 2000, 1000, 500, 250, 3000, 2750], // Example data points
    },
  ],
};

const TestBarChartScreen = () => {
  const screenWidth = Dimensions.get('window').width;

  // FIX: Set the chart canvas wider than the container to allow the last label space
  const chartCanvasWidth = screenWidth + 10;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Isolated Weekly Intake Chart Test</Text>
      </View>

      <View style={styles.chartWrapper}>
        <View style={styles.chartInnerWrapper}>
          <BarChart
            data={staticChartData}
            width={chartCanvasWidth - 80} // Use the wider calculated width
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
              labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
              style: {
                marginVertical: 0,
                borderRadius: 0,
                paddingRight: 90, // 🔥 **KEY FIX: Aggressive padding (90) to push content left**
                paddingLeft: 20,
              },
              propsForLabels: {
                fontSize: 12,
                fontWeight: '600',
              },
              propsForBackgroundLines: {
                strokeDasharray: '5,5',
                stroke: '#e2e8f0',
              },
              propsForDots: { r: '4', strokeWidth: '2', stroke: '#3b82f6' },
            }}
            withVerticalLabels={true}
            withHorizontalLabels={true}
            withInnerLines={false}
            showValuesOnTopOfBars={true}
            flatColor={true}
          />
        </View>
      </View>

      <Text style={styles.noteText}>
        **Note:** If 'Sun' is still cut off, try increasing `paddingRight` to
        100 or reducing `chartCanvasWidth` slightly (e.g., to `screenWidth`).
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chartWrapper: {
    marginHorizontal: 15,
    overflow: 'hidden', // This is what clips the excess chart width
    borderRadius: 12,
    elevation: 2, // Optional: gives a slight shadow
    backgroundColor: '#f8fafc',
  },
  chartInnerWrapper: {
    marginVertical: 10,
    // No conflicting padding here
  },
  noteText: {
    marginHorizontal: 20,
    marginTop: 30,
    fontSize: 12,
    color: '#333',
    lineHeight: 18,
  },
});

export default TestBarChartScreen;
