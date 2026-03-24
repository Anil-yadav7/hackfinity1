import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AIInsightCard() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="bulb" size={16} color="#ffffff" />
        <Text style={styles.headerText}>AI INSIGHT</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.insightText}>
          You spend <Text style={styles.boldText}>15% more</Text> on <Text style={styles.underlineText}>Food Delivery</Text> during weekends. Opting for a meal kit could save you <Text style={styles.boldText}>$120/mo</Text>.
        </Text>
        <View style={styles.iconContainer}>
            <Ionicons name="sparkles" size={40} color="rgba(255, 255, 255, 0.3)" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a73e8',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#1a73e8',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 8,
    letterSpacing: 1,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  insightText: {
    color: '#ffffff',
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '500',
    flex: 1,
    paddingRight: 10,
  },
  boldText: { fontWeight: '800' },
  underlineText: { textDecorationLine: 'underline', fontWeight: '800', textDecorationColor: '#86f898' },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
