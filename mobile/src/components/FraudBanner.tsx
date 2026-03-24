import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FraudBanner({ navigation }: { navigation: any }) {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    fetchAlerts();
  }, []);

  useEffect(() => {
    if (alerts.length > 1) {
      const interval = setInterval(() => {
        animateTransition();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [alerts, currentIndex]);

  const fetchAlerts = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/fraud/news');
      const json = await res.json();
      if (json.success && json.data.length > 0) {
        setAlerts(json.data);
      } else {
        setAlerts([
          { title: 'Security Alert: Increased phishing', description: '' },
          { title: 'Security Alert: Watch out for fake delivery texts', description: '' },
          { title: 'Security Tip: Never share your OTP over phone', description: '' }
        ]);
      }
    } catch (e) {
      setAlerts([{ title: 'Security Alert: Monitor transactions daily', description: '' }]);
    }
  };

  const animateTransition = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % alerts.length);
    }, 500);
  };

  if (alerts.length === 0) return null;

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => navigation.navigate('FraudFeed')}
      activeOpacity={0.8}
    >
      <View style={styles.alertCapsule}>
          <View style={styles.iconContainer}>
            <Ionicons name="shield-checkmark" size={24} color="#ef4444" />
          </View>
          <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
            <Text style={styles.tickerTitle} numberOfLines={1}>
              {alerts[currentIndex]?.title}
            </Text>
          </Animated.View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    marginTop: 5,
    marginBottom: 15,
  },
  alertCapsule: {
    backgroundColor: '#fff1f2',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  iconContainer: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: '#ffffff', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#ef4444'
  },
  textContainer: { flex: 1 },
  tickerTitle: { fontSize: 13, fontWeight: '700', color: '#991b1b' },
});
