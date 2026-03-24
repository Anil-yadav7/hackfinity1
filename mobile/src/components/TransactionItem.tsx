import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const getCategoryDetails = (reason: string, merchant: string) => {
    const r = (reason || '').toLowerCase();
    const m = (merchant || '').toLowerCase();
    
    if (r.includes('grocery') || m.includes('bakery') || m.includes('market')) {
        return { icon: 'cart-outline', label: 'GROCERIES', color: '#00722f', bg: '#86f898', iconColor: '#414754', iconBg: '#f3f4f5' };
    }
    if (r.includes('uber') || m.includes('uber') || r.includes('transport')) {
        return { icon: 'car-outline', label: 'TRANSPORT', color: '#004493', bg: '#d8e2ff', iconColor: '#414754', iconBg: '#f3f4f5' };
    }
    if (r.includes('fun') || r.includes('impulse') || r.includes('shopping')) {
        return { icon: 'flash-outline', label: 'IMPULSE', color: '#930004', bg: '#ffdad5', iconColor: '#414754', iconBg: '#f3f4f5' };
    }
    if (m.includes('apple') || r.includes('electronics')) {
        return { icon: 'laptop-outline', label: 'ELECTRONICS', color: '#004493', bg: '#d8e2ff', iconColor: '#414754', iconBg: '#f3f4f5' };
    }
    if (r.includes('social') || m.includes('club') || m.includes('bar')) {
        return { icon: 'wine-outline', label: 'SOCIAL', color: '#930004', bg: '#ffdad5', iconColor: '#414754', iconBg: '#f3f4f5' };
    }
    return { icon: 'receipt-outline', label: 'OTHER', color: '#414754', bg: '#e1e3e4', iconColor: '#414754', iconBg: '#f3f4f5' };
};

export default function TransactionItem({ transaction }: { transaction: any }) {
  const { icon, label, color, bg, iconColor, iconBg } = getCategoryDetails(transaction.reason, transaction.merchant);

  return (
    <View style={styles.container}>
      <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
        <Ionicons name={icon as any} size={22} color={iconColor} />
      </View>
      
      <View style={styles.middleCol}>
        <Text style={styles.merchant} numberOfLines={1}>{transaction.merchant}</Text>
        <Text style={styles.date}>
            {new Date(transaction.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • 09:12 AM
        </Text>
      </View>

      <View style={styles.rightCol}>
        <Text style={styles.amount}>-${Math.abs(parseFloat(transaction.amount)).toFixed(2)}</Text>
        <View style={[styles.badge, { backgroundColor: bg }]}>
          <Text style={[styles.badgeText, { color }]}>{label}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  middleCol: { flex: 1, paddingRight: 10 },
  merchant: { fontSize: 16, fontWeight: '700', color: '#191c1d', marginBottom: 2 },
  date: { fontSize: 12, color: '#727785', fontWeight: '500' },
  rightCol: { alignItems: 'flex-end', justifyContent: 'center' },
  amount: { fontSize: 18, fontWeight: '800', color: '#191c1d', marginBottom: 4 },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 }
});
