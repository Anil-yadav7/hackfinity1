import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { authenticatedFetch } from '../services/api';

const SUGGESTIONS = [
  "Coffee", "Groceries", "Uber", "Lunch", "Electricity Bill"
];

interface Props {
  bottomSheetRef: React.RefObject<BottomSheet>;
  onTransactionSaved?: () => void;
}

export default function ActionBottomSheet({ bottomSheetRef, onTransactionSaved }: Props) {
  const [reason, setReason] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [smsText, setSmsText] = React.useState('');
  const [isParsing, setIsParsing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  // Set snap points corresponding to modal heights 
  const snapPoints = useMemo(() => ['30%', '55%', '90%'], []);

  const handleSuggestion = (suggestion: string) => {
    setReason(suggestion);
  };

  const handleParseSMS = async () => {
    if (!smsText) return;
    setIsParsing(true);
    try {
      const res = await fetch('http://localhost:5001/api/insights/parse-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ smsText })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setAmount(json.data.amount.toString());
        setReason(json.data.merchant + ' - ' + json.data.category);
        setSmsText('');
      } else {
        alert("Could not parse SMS: " + (json.message || ""));
      }
    } catch (e) {
      alert("Error parsing SMS");
    } finally {
      setIsParsing(false);
    }
  };

  const handleSave = async () => {
    if (!amount || !reason) {
      alert("Please enter amount and reason");
      return;
    }
    
    setIsSaving(true);
    try {
      const payload = {
        amount: parseFloat(amount),
        reason,
        merchant: reason.split(' - ')[0] || reason,
        date: new Date().toISOString()
      };
      
      const res = await authenticatedFetch('http://localhost:5001/api/transactions', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setReason('');
        setAmount('');
        bottomSheetRef.current?.close();
        if (onTransactionSaved) {
            onTransactionSaved();
        }
      } else {
        alert("Failed to save transaction");
      }
    } catch (e) {
       console.log(e);
       alert("Error saving transaction");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1} // Closed by default
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backgroundStyle={styles.bottomSheetBackground}
      keyboardBehavior="extend" // Keeps it above keyboard
    >
      <BottomSheetView style={styles.contentContainer}>
        <Text style={styles.title}>New Transaction</Text>
        
        <View style={styles.smsDivider}>
          <Text style={styles.smsDividerText}>Auto-Fill from SMS</Text>
        </View>
        <View style={styles.smsContainer}>
          <BottomSheetTextInput
            style={styles.smsInput}
            placeholder="Paste bank SMS here..."
            value={smsText}
            onChangeText={setSmsText}
            multiline
          />
          <TouchableOpacity 
            style={[styles.parseButton, (!smsText || isParsing) && styles.parseButtonDisabled]} 
            onPress={handleParseSMS}
            disabled={!smsText || isParsing}
          >
            {isParsing ? <ActivityIndicator color="#fff" /> : <Text style={styles.parseButtonText}>Parse</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.orDivider}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.orLine} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.currencySymbol}>$</Text>
          <BottomSheetTextInput
            style={styles.amountInput}
            placeholder="0.00"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <BottomSheetTextInput
          style={styles.reasonInput}
          placeholder="What was this for? (Reason)"
          value={reason}
          onChangeText={setReason}
        />

        {/* NLP Chips Engine UI */}
        <View style={styles.chipsContainer}>
          {SUGGESTIONS.map((suggestion, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.chip} 
              onPress={() => handleSuggestion(suggestion)}
            >
              <Text style={styles.chipText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isSaving}>
          {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Save Transaction</Text>}
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    shadowColor: '#191c1d',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  contentContainer: { flex: 1, padding: 24 },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 5, color: '#191c1d' },
  smsDivider: { marginVertical: 10 },
  smsDividerText: { fontSize: 11, color: '#414754', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  smsContainer: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  smsInput: { flex: 1, backgroundColor: '#f8f9fa', padding: 12, borderRadius: 10, fontSize: 14, minHeight: 44, maxHeight: 80, color: '#191c1d' },
  parseButton: { backgroundColor: '#727785', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16, borderRadius: 10, minWidth: 80 },
  parseButtonDisabled: { backgroundColor: '#e1e3e4' },
  parseButtonText: { color: '#fff', fontWeight: 'bold' },
  orDivider: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  orLine: { flex: 1, height: 1, backgroundColor: '#e1e3e4' },
  orText: { color: '#727785', fontWeight: 'bold', marginHorizontal: 12, fontSize: 12 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#e1e3e4',
    paddingBottom: 10,
  },
  currencySymbol: { fontSize: 32, fontWeight: '800', color: '#727785', marginRight: 10 },
  amountInput: { flex: 1, fontSize: 36, fontWeight: '800', color: '#191c1d' },
  reasonInput: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e1e3e4',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  chip: {
    backgroundColor: '#e7e8e9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  chipText: { color: '#005bbf', fontWeight: '700', fontSize: 12 },
  saveButton: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
