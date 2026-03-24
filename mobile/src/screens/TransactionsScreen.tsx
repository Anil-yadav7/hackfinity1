import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TextInput, TouchableOpacity, SafeAreaView, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { authenticatedFetch } from '../services/api';
import TransactionItem from '../components/TransactionItem';
import { useIsFocused } from '@react-navigation/native';

export default function TransactionsScreen() {
  const { width } = useWindowDimensions();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await authenticatedFetch('http://localhost:5001/api/transactions');
      const json = await res.json();
      if (res.ok && json.transactions) {
        setTransactions(json.transactions);
      }
    } catch (e) {
      console.log('Fetch transactions error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchTransactions();
    }
  }, [isFocused]);

  const renderProgress = (label: string, percent: number, color: string) => (
    <View style={styles.categoryItem} key={label}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryName}>{label}</Text>
        <Text style={styles.categoryPercent}>{percent}%</Text>
      </View>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${percent}%`, backgroundColor: color }]} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
           <Ionicons name="person" size={20} color="#ffffff" />
        </View>
        <Text style={styles.headerTitle}>SpendIQ</Text>
        <TouchableOpacity style={styles.notificationBtn}>
           <Ionicons name="notifications" size={24} color="#1e293b" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.contentWrapper}>
          <View style={styles.titleSection}>
            <Text style={styles.pageTitle}>History</Text>
            <Text style={styles.pageSubtitle}>Refining your financial narrative through curated transaction analysis.</Text>
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#94a3b8" />
              <TextInput placeholder="Search transactions..." style={styles.searchInput} placeholderTextColor="#94a3b8" />
            </View>
            <TouchableOpacity style={styles.filterBtn}>
              <Ionicons name="options-outline" size={20} color="#0f172a" />
              <Text style={styles.filterText}>Filters</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeader}>
             <Text style={styles.sectionTitle}>Today</Text>
             <Text style={styles.sectionDate}>OCT 24, 2023</Text>
          </View>

          <View style={styles.groupedList}>
            {loading ? <ActivityIndicator color="#3b82f6" /> : transactions.slice(0, 2).map(tx => (
              <TransactionItem key={tx._id || tx.id} transaction={{ id: tx._id, merchant: tx.merchantName || tx.merchant, amount: tx.amount, reason: tx.reason, date: tx.date }} />
            ))}
          </View>

          <View style={styles.sectionHeader}>
             <Text style={styles.sectionTitle}>Yesterday</Text>
             <Text style={styles.sectionDate}>OCT 23, 2023</Text>
          </View>

          <View style={styles.groupedList}>
             {!loading && transactions.slice(2, 4).map(tx => (
               <TransactionItem key={tx._id || tx.id} transaction={{ id: tx._id, merchant: tx.merchantName || tx.merchant, amount: tx.amount, reason: tx.reason, date: tx.date }} />
             ))}
          </View>

          {/* October Flow Card */}
          <View style={styles.flowCard}>
             <Text style={styles.flowLabel}>OCTOBER FLOW</Text>
             <View style={styles.flowRow}>
                 <View>
                   <Text style={styles.flowSublabel}>Total Spent</Text>
                   <Text style={styles.flowAmount}>$4,291.50</Text>
                 </View>
             </View>
             <View style={styles.flowDivider} />
             <View style={styles.flowRow}>
                 <View>
                   <Text style={styles.flowSublabel}>Monthly Income</Text>
                   <Text style={styles.flowAmount}>$8,400.00</Text>
                 </View>
             </View>
             {/* Mini chart placeholder */}
             <View style={styles.miniChartContainer}>
                 <Ionicons name="trending-up" size={40} color="rgba(255, 255, 255, 0.2)" />
             </View>
          </View>

          {/* Top Categories */}
          <View style={styles.categoriesSection}>
              <Text style={styles.sectionHeading}>Top Categories</Text>
              {renderProgress('Housing', 56, '#0f172a')}
              {renderProgress('Travel', 20, '#134e4a')}
              {renderProgress('Food', 12, '#064e3b')}
              
              <TouchableOpacity style={styles.fullReportBtn}>
                  <Text style={styles.fullReportText}>Full Report</Text>
              </TouchableOpacity>
          </View>

          {/* Wealth Advisory Banner */}
          <View style={styles.advisoryBanner}>
              <View style={styles.advisoryOverlay}>
                  <Text style={styles.advisoryTitle}>Wealth Advisory</Text>
                  <Text style={styles.advisorySubtitle}>Optimize your savings with AI.</Text>
                  <TouchableOpacity style={styles.learnMoreBtn}>
                      <Text style={styles.learnMoreText}>Learn More</Text>
                  </TouchableOpacity>
              </View>
          </View>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f9ff' },
  contentWrapper: { maxWidth: 848, alignSelf: 'center', width: '100%' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 24, 
    paddingTop: 10, 
    paddingBottom: 15 
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  avatar: { 
    width: 36, height: 36, borderRadius: 10, backgroundColor: '#1e293b', 
    justifyContent: 'center', alignItems: 'center',
  },
  notificationBtn: { padding: 4 },
  scrollContent: { paddingBottom: 20 },
  titleSection: { paddingHorizontal: 24, marginTop: 10, marginBottom: 24 },
  pageTitle: { fontSize: 42, fontWeight: '800', color: '#042f2e', marginBottom: 8 },
  pageSubtitle: { fontSize: 15, color: '#64748b', lineHeight: 22, fontWeight: '500' },
  searchContainer: { 
    flexDirection: 'row', 
    paddingHorizontal: 24, 
    marginBottom: 24,
    gap: 12
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15, color: '#0f172a' },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterText: { marginLeft: 8, fontSize: 15, fontWeight: '600', color: '#0f172a' },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'baseline', 
    paddingHorizontal: 24, 
    marginBottom: 12 
  },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  sectionDate: { fontSize: 11, fontWeight: '700', color: '#64748b', textTransform: 'uppercase' },
  groupedList: { paddingHorizontal: 24, marginBottom: 24 },
  flowCard: {
    backgroundColor: '#042f2e',
    marginHorizontal: 24,
    borderRadius: 24,
    padding: 24,
    marginBottom: 30,
    overflow: 'hidden',
  },
  flowLabel: { fontSize: 11, fontWeight: '800', color: '#94a3b8', letterSpacing: 1, marginBottom: 16 },
  flowRow: { marginBottom: 16 },
  flowSublabel: { fontSize: 13, color: '#94a3b8', marginBottom: 4 },
  flowAmount: { fontSize: 32, fontWeight: '800', color: '#ffffff' },
  flowDivider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', marginBottom: 16 },
  miniChartContainer: { position: 'absolute', bottom: 20, right: 20 },
  categoriesSection: {
    backgroundColor: '#e0f2fe',
    marginHorizontal: 24,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
  },
  sectionHeading: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 16 },
  categoryItem: { marginBottom: 16 },
  categoryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  categoryName: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  categoryPercent: { fontSize: 14, fontWeight: '700', color: '#64748b' },
  progressBarBg: { height: 8, backgroundColor: '#ffffff', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  fullReportBtn: {
    backgroundColor: '#ffffff',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 10,
  },
  fullReportText: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  advisoryBanner: {
    marginHorizontal: 24,
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#064e3b',
  },
  advisoryOverlay: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  advisoryTitle: { fontSize: 24, fontWeight: '800', color: '#10b981', marginBottom: 4 },
  advisorySubtitle: { fontSize: 14, color: '#ffffff', opacity: 0.8, marginBottom: 16 },
  learnMoreBtn: {
    backgroundColor: '#10b981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  learnMoreText: { color: '#ffffff', fontWeight: '800', fontSize: 14 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
