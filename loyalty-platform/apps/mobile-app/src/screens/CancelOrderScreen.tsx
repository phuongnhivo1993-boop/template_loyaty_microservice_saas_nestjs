import { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { orders } from '../services/api';

export default function CancelOrderScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const orderId = route.params?.orderId;
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCancel = async () => {
    if (!orderId) return;
    setSubmitting(true);
    try {
      await orders.cancel(orderId, reason ? { cancelReason: reason } : undefined);
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to cancel order');
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Cancel Order</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.warningBox}>
          <Ionicons name="warning-outline" size={24} color="#dc2626" />
          <Text style={styles.warningText}>
            Are you sure you want to cancel this order? This action cannot be undone.
          </Text>
        </View>

        <Text style={styles.label}>Reason (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter cancellation reason..."
          value={reason}
          onChangeText={setReason}
          multiline
          numberOfLines={3}
        />

        <View style={styles.actions}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelBtnText}>Keep Order</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.confirmBtn, submitting && { opacity: 0.5 }]}
            onPress={handleCancel}
            disabled={submitting}
          >
            <Text style={styles.confirmBtnText}>
              {submitting ? 'Cancelling...' : 'Yes, Cancel Order'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 12, backgroundColor: '#1e293b' },
  backBtn: { color: '#fff', fontSize: 16 },
  title: { color: '#fff', fontSize: 18, fontWeight: '700' },
  content: { flex: 1, padding: 20 },
  warningBox: { flexDirection: 'row', backgroundColor: '#fef2f2', borderRadius: 12, padding: 16, marginBottom: 24, gap: 12 },
  warningIcon: { fontSize: 24 },
  warningText: { flex: 1, fontSize: 14, color: '#991b1b', lineHeight: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#1e293b', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 14, fontSize: 15, borderWidth: 1, borderColor: '#e2e8f0', minHeight: 80, textAlignVertical: 'top' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 32 },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 10, borderWidth: 1, borderColor: '#cbd5e1', alignItems: 'center' },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: '#64748b' },
  confirmBtn: { flex: 1, paddingVertical: 14, borderRadius: 10, backgroundColor: '#dc2626', alignItems: 'center' },
  confirmBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
