import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { authenticatedFetch } from '../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function SummaryCards({ refreshIndicator }: { refreshIndicator?: number }) {
  const [data, setData] = useState([
    { title: 'Total Income', amount: '+$0', color: '#006e2c', icon: 'trending-up', percent: '+0%', percentColor: '#006e2c', bg: '#ffffff', titleColor: '#414754', amtColor: '#191c1d' },
    { title: 'Total Expenses', amount: '-$0', color: '#b81d17', icon: 'trending-up', percent: '+0%', percentColor: '#b81d17', bg: '#ffffff', titleColor: '#414754', amtColor: '#b81d17' },
    { title: 'Net Savings', amount: '$0', color: '#005bbf', icon: 'checkmark-circle-outline', percent: 'On track', percentColor: '#006e2c', bg: '#ffffff', titleColor: '#414754', amtColor: '#005bbf' },
  ]);

  const alertsCount = 0; // Mock for now

  useEffect(() => {
    const loadSummary = async () => {
      try {
        // Fetch both summary and full transaction list
        const [summaryRes, txRes] = await Promise.all([
          authenticatedFetch('http://localhost:5001/api/transactions/summary'),
          authenticatedFetch('http://localhost:5001/api/transactions?limit=200'),
        ]);
        const summaryJson = await summaryRes.json();
        const txJson = await txRes.json();

        if (summaryRes.ok && summaryJson.categoryBreakdown) {
          const totalExpenses = summaryJson.categoryBreakdown.reduce((acc: any, curr: any) => acc + curr.total, 0);

          // Sum credit-type transactions for real income
          let totalIncome = 0;
          if (txRes.ok && txJson.transactions) {
            txJson.transactions.forEach((tx: any) => {
              if (tx.type === 'credit') totalIncome += tx.amount;
            });
          }
          // If no credits recorded, show expenses only
          const savings = totalIncome > 0 ? totalIncome - totalExpenses : 0;

          setData([
            {
              title: 'Total Income',
              amount: totalIncome > 0 ? `+$${totalIncome.toFixed(0)}` : '+$0',
              color: '#006e2c', icon: 'trending-up', percent: totalIncome > 0 ? '+tracked' : 'N/A',
              percentColor: '#006e2c', bg: '#ffffff', titleColor: '#414754', amtColor: '#191c1d'
            },
            {
              title: 'Total Expenses',
              amount: `-$${totalExpenses.toFixed(0)}`,
              color: '#b81d17', icon: 'trending-up', percent: `${summaryJson.categoryBreakdown.length} categories`,
              percentColor: '#b81d17', bg: '#ffffff', titleColor: '#414754', amtColor: '#b81d17'
            },
            {
              title: 'Net Savings',
              amount: savings >= 0 ? `$${savings.toFixed(0)}` : `-$${Math.abs(savings).toFixed(0)}`,
              color: '#005bbf', icon: 'checkmark-circle-outline', percent: savings >= 0 ? 'On track' : 'Over budget',
              percentColor: savings >= 0 ? '#006e2c' : '#b81d17', bg: '#ffffff', titleColor: '#414754', amtColor: '#005bbf'
            },
          ]);
        }
      } catch (e) {}
    };
    loadSummary();
  }, [refreshIndicator]);

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {data.map((item, index) => (
          <View key={index} style={[styles.card, { width: '47%', backgroundColor: item.bg }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: item.titleColor }]}>{item.title}</Text>
            </View>
            <Text style={[styles.cardAmount, { color: item.amtColor }]}>{item.amount}</Text>
            <View style={styles.indicatorContainer}>
              {item.icon !== 'checkmark-circle-outline' && <Ionicons name={item.icon as any} size={14} color={item.percentColor} style={{ marginRight: 4 }} />}
              <Text style={[styles.indicatorText, { color: item.percentColor }]}>
                {item.percent}
              </Text>
            </View>
          </View>
        ))}
        <View style={[styles.card, styles.alertCard, { width: '47%' }]}>
          <Text style={[styles.cardTitle, { color: 'rgba(255,255,255,0.8)' }]}>ACTIVE ALERTS</Text>
          <Text style={[styles.cardAmount, { color: '#ffffff' }]}>{alertsCount}</Text>
          <Text style={styles.alertSubtitle}>All secure</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, paddingVertical: 10 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#191c1d',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 32,
    elevation: 4,
  },
  alertCard: {
    backgroundColor: '#dc392c',
  },
  cardHeader: {
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  cardAmount: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 2
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  indicatorText: {
    fontSize: 12,
    fontWeight: '600',
  },
  alertSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    marginTop: 4,
  }
});
