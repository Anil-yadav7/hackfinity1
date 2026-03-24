import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions, RefreshControl, useWindowDimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { authenticatedFetch } from '../services/api';
import { useIsFocused } from '@react-navigation/native';

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#ef4444',
  Transport: '#3b82f6',
  Utilities: '#f59e0b',
  Entertainment: '#a855f7',
  Shopping: '#10b981',
  Other: '#94a3b8',
};

const CATEGORY_ICONS: Record<string, string> = {
  Food: 'restaurant',
  Transport: 'car',
  Utilities: 'flash',
  Entertainment: 'musical-notes',
  Shopping: 'bag-handle',
  Other: 'ellipsis-horizontal',
};

export default function InsightsScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [insightsData, setInsightsData] = useState<any>(null);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const isFocused = useIsFocused();

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const [insightsRes, summaryRes] = await Promise.all([
        authenticatedFetch('http://localhost:5001/api/insights/generate'),
        authenticatedFetch('http://localhost:localhost:5001/api/transactions/summary'),
      ]);

      const insightsJson = await insightsRes.json();
      const summaryJson = await summaryRes.json();

      if (insightsJson.success) setInsightsData(insightsJson.data);
      if (summaryRes.ok && summaryJson.categoryBreakdown) setSummaryData(summaryJson);
    } catch (e) {
      setError('Failed to load. Pull down to retry.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      loadData();
    }
  }, [isFocused]);

  const onRefresh = () => { setRefreshing(true); loadData(); };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#005bbf" />
        <Text style={styles.loadingText}>Analyzing your spending...</Text>
      </View>
    );
  }

  const categoryBreakdown = summaryData?.categoryBreakdown || [];
  const totalSpent = categoryBreakdown.reduce((sum: number, c: any) => sum + c.total, 0);

  const chartData = categoryBreakdown.length > 0
    ? categoryBreakdown.map((cat: any) => ({
        name: cat._id || 'Other',
        population: cat.total,
        color: CATEGORY_COLORS[cat._id] || CATEGORY_COLORS.Other,
        legendFontColor: '#374151',
        legendFontSize: 13,
      }))
    : [{ name: 'No data', population: 1, color: '#e2e8f0', legendFontColor: '#94a3b8', legendFontSize: 13 }];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#005bbf" />}
    >
      <View style={styles.contentWrapper}>
        <Text style={styles.headerTitle}>Spending Insights</Text>
        <Text style={styles.headerSub}>Pull to refresh • Live data</Text>

        {/* Donut Chart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Category Breakdown</Text>
          <Text style={styles.cardSub}>${totalSpent.toFixed(0)} spent this month</Text>
          {totalSpent > 0 ? (
            <PieChart
              data={chartData}
              width={Math.min(screenWidth - 80, 800)}
              height={200}
              chartConfig={{ color: (opacity = 1) => `rgba(0,0,0,${opacity})` }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              center={[0, 0]}
              absolute
            />
          ) : (
            <View style={styles.emptyChart}>
              <Ionicons name="pie-chart-outline" size={48} color="#cbd5e1" />
              <Text style={styles.emptyText}>Add transactions to see breakdown</Text>
            </View>
          )}
        </View>

        {/* Category Progress Bars */}
        {categoryBreakdown.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Top Categories</Text>
            {categoryBreakdown.map((cat: any, i: number) => {
              const pct = totalSpent > 0 ? Math.round((cat.total / totalSpent) * 100) : 0;
              const color = CATEGORY_COLORS[cat._id] || CATEGORY_COLORS.Other;
              const icon = CATEGORY_ICONS[cat._id] || CATEGORY_ICONS.Other;
              return (
                <View key={i} style={styles.categoryRow}>
                  <View style={styles.categoryLeft}>
                    <View style={[styles.catIcon, { backgroundColor: color + '20' }]}>
                      <Ionicons name={icon as any} size={16} color={color} />
                    </View>
                    <Text style={styles.categoryName}>{cat._id || 'Other'}</Text>
                  </View>
                  <View style={styles.barContainer}>
                    <View style={[styles.bar, { width: `${pct}%` as any, backgroundColor: color }]} />
                  </View>
                  <Text style={styles.categoryPct}>{pct}%</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* AI Insight */}
        <View style={[styles.card, styles.aiCard]}>
          <View style={styles.aiHeader}>
            <Ionicons name="sparkles" size={20} color="#005bbf" />
            <Text style={[styles.cardTitle, { marginBottom: 0, marginLeft: 8, color: '#005bbf' }]}>AI Financial Summary</Text>
          </View>
          <Text style={styles.cardText}>
            {insightsData?.insight || 'Add more transactions to get personalized AI insights about your spending habits.'}
          </Text>
        </View>

        {/* Avoidable costs */}
        {insightsData?.avoidableCategories?.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Top Areas to Optimise</Text>
            {insightsData.avoidableCategories.map((cat: string, idx: number) => (
              <View key={idx} style={styles.listItem}>
                <Ionicons name="alert-circle-outline" size={18} color="#ef4444" style={{ marginRight: 10 }} />
                <Text style={styles.listItemText}>{cat}</Text>
              </View>
            ))}
          </View>
        )}

        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={{ height: 80 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  contentWrapper: { padding: 20, maxWidth: 848, alignSelf: 'center', width: '100%' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
  loadingText: { marginTop: 10, fontSize: 15, color: '#727785', fontWeight: '500' },
  headerTitle: { fontSize: 32, fontWeight: '800', color: '#191c1d', marginTop: 40, marginBottom: 4, letterSpacing: -0.5 },
  headerSub: { fontSize: 13, color: '#727785', fontWeight: '500', marginBottom: 24 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#191c1d',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  aiCard: { borderLeftWidth: 3, borderLeftColor: '#005bbf' },
  aiHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#191c1d', marginBottom: 4, letterSpacing: -0.3 },
  cardSub: { fontSize: 13, color: '#727785', fontWeight: '500', marginBottom: 12 },
  cardText: { fontSize: 15, color: '#414754', lineHeight: 24 },
  emptyChart: { alignItems: 'center', paddingVertical: 24 },
  emptyText: { marginTop: 10, color: '#94a3b8', fontSize: 14, fontWeight: '500' },
  categoryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  categoryLeft: { flexDirection: 'row', alignItems: 'center', width: 120 },
  catIcon: { width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  categoryName: { fontSize: 13, fontWeight: '600', color: '#191c1d', flex: 1 },
  barContainer: { flex: 1, height: 8, backgroundColor: '#f1f5f9', borderRadius: 4, marginHorizontal: 8, overflow: 'hidden' },
  bar: { height: 8, borderRadius: 4 },
  categoryPct: { fontSize: 13, fontWeight: '700', color: '#191c1d', width: 36, textAlign: 'right' },
  listItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  listItemText: { fontSize: 15, color: '#414754', fontWeight: '500' },
  errorCard: { backgroundColor: '#fef2f2', padding: 16, borderRadius: 12, marginBottom: 20 },
  errorText: { color: '#dc2626', fontSize: 14 },
});
