import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import ActionBottomSheet from '../components/ActionBottomSheet';
import FraudBanner from '../components/FraudBanner';
import SummaryCards from '../components/SummaryCards';
import TransactionItem from '../components/TransactionItem';
import CategorySplit from '../components/CategorySplit';
import WeeklyTrend from '../components/WeeklyTrend';
import AIInsightCard from '../components/AIInsightCard';
import { authenticatedFetch } from '../services/api';
import { useIsFocused } from '@react-navigation/native';

export default function DashboardScreen({ navigation }: { navigation: any }) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const [refreshIndicator, setRefreshIndicator] = useState(0);

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
  }, [isFocused, refreshIndicator]);

  const openSheet = () => bottomSheetRef.current?.expand();

  const handleTransactionSaved = () => {
    setRefreshIndicator(prev => prev + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </View>
        </View>
        <Text style={styles.headerMainTitle}>SpendIQ</Text>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications" size={24} color="#727785" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.greetingSection}>
          <Text style={styles.portfolioLabel}>PORTFOLIO OVERVIEW</Text>
          <Text style={styles.greetingText}>
            Good morning, <Text style={styles.userName}>Alex.</Text>
          </Text>
          <Text style={styles.insightSummary}>
            Your financial health score improved by <Text style={styles.boldText}>4%</Text> this week. Keep maintaining your savings goal.
          </Text>
        </View>

        <View style={styles.bannerContainer}>
          <FraudBanner navigation={navigation} />
        </View>

        <SummaryCards refreshIndicator={refreshIndicator} />

        <CategorySplit refreshIndicator={refreshIndicator} />

        <WeeklyTrend refreshIndicator={refreshIndicator} />

        <AIInsightCard />

        <View style={styles.transactionsWrapper}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              <Text style={styles.transactionSubtitle}>Real-time ledger of your spends</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
              <Text style={styles.seeAll}>View All History</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionsContainer}>
            {loading ? (
              <ActivityIndicator style={{ marginTop: 20 }} color="#005bbf" />
            ) : (
              transactions.slice(0, 5).map((tx) => (
                <TransactionItem 
                  key={tx._id || tx.id} 
                  transaction={{ 
                    id: tx._id, 
                    merchant: tx.merchantName || tx.merchant, 
                    amount: tx.amount, 
                    reason: tx.reason, 
                    date: tx.date 
                  }} 
                />
              ))
            )}
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={openSheet}>
        <Ionicons name="add" size={32} color="#ffffff" />
      </TouchableOpacity>

      <ActionBottomSheet bottomSheetRef={bottomSheetRef as any} onTransactionSaved={handleTransactionSaved} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 24, 
    paddingTop: 10, 
    paddingBottom: 15,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerMainTitle: { fontSize: 24, fontWeight: '800', color: '#1a73e8', letterSpacing: -0.5 },
  avatar: { 
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#e7e8e9', 
    justifyContent: 'center', alignItems: 'center', borderColor: 'rgba(26,115,232,0.1)', borderWidth: 2
  },
  avatarText: { fontSize: 16, fontWeight: '800', color: '#1a73e8' },
  notificationBtn: { padding: 4 },
  scrollContent: { paddingBottom: 20, maxWidth: 848, alignSelf: 'center', width: '100%' },
  greetingSection: { paddingHorizontal: 24, marginTop: 10, marginBottom: 20 },
  portfolioLabel: { fontSize: 11, fontWeight: '700', color: '#727785', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' },
  greetingText: { fontSize: 36, color: '#191c1d', fontWeight: '800', marginBottom: 8, letterSpacing: -1 },
  userName: { fontWeight: '800', color: '#005bbf' },
  insightSummary: { fontSize: 14, color: '#414754', lineHeight: 20, fontWeight: '500' },
  boldText: { fontWeight: '700', color: '#191c1d' },
  bannerContainer: { marginBottom: 10 },
  transactionsWrapper: { backgroundColor: '#ffffff', marginHorizontal: 24, borderRadius: 16, padding: 24, shadowColor: '#191c1d', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.06, shadowRadius: 32, elevation: 4 },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-end', 
    marginBottom: 20
  },
  sectionTitle: { fontSize: 24, fontWeight: '800', color: '#191c1d', letterSpacing: -0.5 },
  transactionSubtitle: { fontSize: 13, color: '#414754', fontWeight: '500', marginTop: 2 },
  seeAll: { fontSize: 13, color: '#005bbf', fontWeight: '700', paddingBottom: 2 },
  transactionsContainer: { },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 25,
    backgroundColor: '#005bbf',
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#005bbf',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 12,
    zIndex: 100,
  }
});
