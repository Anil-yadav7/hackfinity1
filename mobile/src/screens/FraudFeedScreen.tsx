import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';

export default function FraudFeedScreen() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/fraud/news');
      const json = await res.json();
      if (json.success) {
        setAlerts(json.data);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to fetch fraud news');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        {item.source === 'community' && (
          <View style={styles.badge}><Text style={styles.badgeText}>Community</Text></View>
        )}
      </View>
      <Text style={styles.cardDesc}>{item.description}</Text>
      <Text style={styles.cardDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Active Scam Alerts</Text>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#ef4444" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={alerts}
          keyExtractor={(item) => item._id || Math.random().toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          ListEmptyComponent={<Text style={styles.emptyText}>No active scams reported globally.</Text>}
        />
      )}
      
      <TouchableOpacity 
        style={styles.reportBtn} 
        onPress={() => Alert.alert('Community Report', 'Community submission form coming soon.')}
      >
        <Text style={styles.reportBtnText}>Report a Scam</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 20, backgroundColor: '#b91c1c', paddingTop: 60 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOffset: {width:0, height:2}, shadowOpacity: 0.1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', flex: 1 },
  badge: { backgroundColor: '#fef08a', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginLeft: 10 },
  badgeText: { fontSize: 12, color: '#ca8a04', fontWeight: 'bold' },
  cardDesc: { fontSize: 15, color: '#475569', lineHeight: 22, marginBottom: 10 },
  cardDate: { fontSize: 12, color: '#94a3b8', textAlign: 'right' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#64748b' },
  reportBtn: { position: 'absolute', bottom: 30, left: 20, right: 20, backgroundColor: '#b91c1c', padding: 15, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  reportBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
