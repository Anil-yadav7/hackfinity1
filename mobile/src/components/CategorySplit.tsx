import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, useWindowDimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { authenticatedFetch } from '../services/api';

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

const defaultData = [
  { name: 'Loading...', population: 100, color: '#e1e3e4', legendFontColor: '#414754', legendFontSize: 14 }
];

export default function CategorySplit({ refreshIndicator }: { refreshIndicator?: number }) {
  const { width: screenWidth } = useWindowDimensions();
  const [data, setData] = useState(defaultData);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const res = await authenticatedFetch('http://localhost:5001/api/transactions/summary');
        const json = await res.json();
        if (res.ok && json.categoryBreakdown) {
          const colors = ['#1a73e8', '#006e2c', '#dc392c', '#f97316', '#8b5cf6', '#64748b'];
          let sum = 0;
          
          if (json.categoryBreakdown.length === 0) {
              setData([{ name: 'No data', population: 1, color: '#e1e3e4', legendFontColor: '#414754', legendFontSize: 14}]);
              setTotalSpent(0);
              return;
          }

          const newData = json.categoryBreakdown.map((item: any, i: number) => {
            sum += item.total;
            return {
              name: item._id || 'Other',
              population: item.total,
              color: colors[i % colors.length],
              legendFontColor: '#414754',
              legendFontSize: 14,
            };
          });
          
          setData(newData);
          setTotalSpent(sum);
        }
      } catch (e) {
        console.log("Error loading category summary:", e);
      }
    };
    loadSummary();
  }, [refreshIndicator]);

  // Compute percentages
  const renderedLegend = data.map((item, index) => {
    const pct = totalSpent > 0 && item.color !== '#e1e3e4' ? Math.round((item.population / totalSpent) * 100) : 0;
    return (
      <View key={index} style={styles.legendItem}>
        <View style={styles.legendLeft}>
            <View style={[styles.dot, { backgroundColor: item.color }]} />
            <Text style={styles.legendName}>{item.name}</Text>
        </View>
        {item.color !== '#e1e3e4' && <Text style={styles.legendPercent}>{pct}%</Text>}
      </View>
    );
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Category Split</Text>
      <Text style={styles.subtitle}>Where your money goes</Text>
      
      <View style={styles.chartWrapper}>
        <PieChart
          data={data}
          width={Math.min(screenWidth - 48, 800)}
          height={200}
          chartConfig={chartConfig}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          center={[10, 0]}
          absolute
          hasLegend={false}
        />
        <View style={styles.centerText}>
          <Text style={styles.centerAmount}>${totalSpent.toFixed(0)}</Text>
          <Text style={styles.centerLabel}>TOTAL SPENT</Text>
        </View>
      </View>

      <View style={styles.legendContainer}>
        {renderedLegend}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 24,
    marginTop: 10,
    marginBottom: 24,
    shadowColor: '#191c1d',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 32,
    elevation: 4,
    maxWidth: 848,
    alignSelf: 'stretch',
  },
  title: { fontSize: 24, fontWeight: '800', color: '#191c1d', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: '#414754', marginTop: 4, marginBottom: 10, fontWeight: '500' },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 220,
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
  },
  centerAmount: { fontSize: 24, fontWeight: '800', color: '#191c1d' },
  centerLabel: { fontSize: 10, fontWeight: '700', color: '#727785', letterSpacing: 0.5 },
  legendContainer: { marginTop: 10 },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  legendName: { fontSize: 14, color: '#414754', fontWeight: '500' },
  legendPercent: { fontSize: 14, color: '#191c1d', fontWeight: '700' },
});
