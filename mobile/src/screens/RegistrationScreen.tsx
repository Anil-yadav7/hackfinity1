import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { saveToken } from '../services/storage';
import { Ionicons } from '@expo/vector-icons';

export default function RegistrationScreen({ navigation }: { navigation: any }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      
      if (response.ok) {
        await saveToken(data.token);
        Alert.alert("Success", "Registered securely!");
        navigation.replace('Main');
      } else {
        Alert.alert('Error', data.message || 'Registration failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to server');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Ionicons name="wallet" size={24} color="#ffffff" style={styles.logoIcon} />
          </View>
          <Text style={styles.logoText}>SpendIQ</Text>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the intelligent wealth engine</Text>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>FULL NAME</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#727785" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Alex Walker"
              placeholderTextColor="#727785"
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>EMAIL ADDRESS</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#727785" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="name@company.com"
              placeholderTextColor="#727785"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>PASSWORD</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#727785" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#727785"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#727785" />
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Sign Up</Text>
          <Ionicons name="arrow-forward" size={18} color="#ffffff" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
        
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signupText}>Log in</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f9fa' },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  headerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, justifyContent: 'center' },
  logoContainer: { width: 40, height: 40, backgroundColor: '#005bbf', borderRadius: 12, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '3deg' }] },
  logoIcon: { transform: [{ rotate: '-3deg' }] },
  logoText: { fontSize: 24, fontWeight: '800', color: '#005bbf', marginLeft: 10, letterSpacing: -1 },
  titleContainer: { marginBottom: 32, alignItems: 'center' },
  title: { fontSize: 32, fontWeight: '800', color: '#191c1d', marginBottom: 8, letterSpacing: -1 },
  subtitle: { fontSize: 14, color: '#414754' },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 11, fontWeight: '700', color: '#414754', marginBottom: 8, letterSpacing: 1 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e1e3e4', borderRadius: 16, paddingHorizontal: 16, height: 56 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, height: '100%', color: '#191c1d', fontSize: 16 },
  eyeIcon: { padding: 4 },
  button: { backgroundColor: '#005bbf', height: 56, borderRadius: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10, shadowColor: '#005bbf', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 8 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  footerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  footerText: { fontSize: 14, color: '#414754', fontWeight: '500' },
  signupText: { fontSize: 14, color: '#005bbf', fontWeight: '700' }
});
