import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { authenticatedFetch } from '../services/api';

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(26, 115, 232, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(114, 119, 133, ${opacity})`,
  style: {
    borderRadius: 16
  },
  propsForDots: {
    r: "4",
    strokeWidth: "2",
    stroke: "#1a73e8"
  },
  propsForBackgroundLines: {
    strokeDasharray: "" // solid background lines
  }
};

export default function WeeklyTrend({ refreshIndicator }: { refreshIndicator?: number }) {
  const { width: screenWidth } = useWindowDimensions();
  const [trendData, setTrendData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [labels, setLabels] = useState(["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]);
  const [dateRange, setDateRange] = useState("");

  useEffect(() => {
// ... omitting fetch details ...
    const fetchTransactions = async () => {
      try {
        const res = await authenticatedFetch('http://localhost:5001/api/transactions?limit=100');
        const json = await res.json();
        if (res.ok && json.transactions) {
          const values = [0, 0, 0, 0, 0, 0, 0];
          const days = [];
          const now = new Date();
          now.setHours(0,0,0,0);
          
          for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            days.push(d.toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase());
          }
          setLabels(days);
          setDateRange(`${new Date(now.getTime() - 6*24*60*60*1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})} - ${new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}`);

          json.transactions.forEach((tx: any) => {
            const txDate = new Date(tx.date);
            txDate.setHours(0,0,0,0);
            const diffTime = Math.abs(now.getTime() - txDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays >= 0 && diffDays <= 6 && tx.type === 'debit') {
               values[6 - diffDays] += tx.amount;
            }
          });
          setTrendData(values);
        }
      } catch (e) {
         console.log(e);
      }
    };
    fetchTransactions();
  }, [refreshIndicator]);

  const data = {
    labels,
    datasets: [
      {
        data: trendData.some(d => d > 0) ? trendData : [0, 0, 0, 0, 0, 0, 0],
        color: (opacity = 1) => `rgba(26, 115, 232, ${opacity})`,
        strokeWidth: 3
      }
    ],
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Weekly Trend</Text>
          <Text style={styles.subtitle}>Daily spending frequency</Text>
        </View>
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>{dateRange || "Loading..."}</Text>
        </View>
      </View>

      <LineChart
        data={data}
        width={Math.min(screenWidth - 48, 800)}
        height={180}
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
          paddingRight: 40
        }}
        withInnerLines={false}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={false}
        formatYLabel={() => ""}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#191c1d',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 32,
    elevation: 4,
    maxWidth: 848,
    alignSelf: 'stretch', // Make it natural centered looking when wrapped in full screen
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  title: { fontSize: 24, fontWeight: '800', color: '#191c1d', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: '#414754', marginTop: 4, fontWeight: '500' },
  dateBadge: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(193, 198, 214, 0.2)',
  },
  dateText: { fontSize: 11, fontWeight: '700', color: '#191c1d' },
});
