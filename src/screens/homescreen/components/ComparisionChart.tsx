import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

export default function MirroredMoodChart() {
  const labels = [
    '6 Aug',
    '7 Aug',
    '8 Aug',
    '9 Aug',
    '10 Aug',
    '11 Aug',
    '12 Aug',
  ];
  const moodValues = [4, 3, 5, 2, 4, 5];
  const mirroredValues = moodValues.map(v => 6 - v);

  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
    labelColor: () => '#666',
    propsForDots: { r: '4' },
    propsForBackgroundLines: { strokeDasharray: '' },
  };
  return (
    <View style={styles.container}>
      <View style={styles.axisContainer}>
        {[5, 4, 3, 2, 1].map(v => (
          <Text key={`top-${v}`} style={styles.yLabel}>
            {v}
          </Text>
        ))}
        {[1, 2, 3, 4, 5].map(v => (
          <Text key={`bottom-${v}`} style={styles.yLabel}>
            {v}
          </Text>
        ))}
      </View>

      <View>
        <LineChart
          data={{
            labels: [],
            datasets: [
              { data: mirroredValues, color: () => 'rgba(255,99,99,0.8)' },
            ],
          }}
          width={width - 30}
          height={150}
          chartConfig={chartConfig}
          withInnerLines={false}
          withVerticalLabels={true}
          withHorizontalLabels={false}
          withVerticalLines={false}
          withHorizontalLines={false}
          bezier
          style={{
            transform: [{ scaleY: -1 }],
            paddingRight: 0,
            marginLeft: 0,
            marginRight: 0,
          }}
        />

        <LineChart
          data={{
            labels,
            datasets: [
              { data: moodValues, color: () => 'rgba(0,150,255,0.8)' },
            ],
          }}
          width={width - 30}
          height={150}
          chartConfig={chartConfig}
          withInnerLines={false}
          withVerticalLabels={false}
          withHorizontalLabels={false}
          withVerticalLines={false}
          withHorizontalLines={false}
          bezier
          style={{
            transform: [{ scaleY: -1 }],
            paddingRight: 0,
            marginLeft: 0,
            marginRight: 0,
          }}
        />

        <View style={styles.xAxis}>
          {labels.map(label => (
            <Text key={label} style={styles.xLabel}>
              {label}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  axisContainer: {
    height: 300,
    justifyContent: 'space-between',
    marginRight: 4,
  },
  yLabel: {
    fontSize: 10,
    color: '#555',
  },
  divider: {
    height: 1,
    backgroundColor: '#aaa',
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  xLabel: {
    fontSize: 9,
    color: '#444',
    textAlign: 'center',
    width: (width - 70) / 7,
  },
});
