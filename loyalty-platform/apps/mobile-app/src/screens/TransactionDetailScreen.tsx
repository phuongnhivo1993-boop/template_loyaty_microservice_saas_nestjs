import { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { members } from '../services/api';
import type { PointTransaction } from '../services/types';
import { LoadingState, ErrorState } from '../components';

export default function TransactionDetailScreen() {
  const route = useRoute<any>();
  const { transaction } = route.params || {};
  const [tx, setTx] = useState<PointTransaction | null>(transaction || null);
  const [loading, setLoading] = useState(!transaction);
  const [error, setError] = useState('');

  const load = () => {
    if (transaction) return;
    setLoading(true);
    setError('');
    members.getTransactions({ limit: 50 })
      .then(r => {
        const list = r.data?.data || r.data || [];
        const found = list.find((t: PointTransaction) => t.id === route.params?.id);
        if (found) setTx(found);
        else setError('Transaction not found');
      })
      .catch(() => setError('Failed to load transaction'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!tx) return <ErrorState message="Transaction not found" />;

  const isEarn = tx.type === 'EARN';
  const typeColors: Record<string, string> = {
    EARN: '#16a34a', BURN: '#dc2626', EXPIRE: '#d97706', ADJUST: '#2563eb',
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.amount, { color: typeColors[tx.type] || '#64748b' }]}>
          {isEarn ? '+' : ''}{tx.amount?.toLocaleString()}
        </Text>
        <Text style={[styles.type, { backgroundColor: (typeColors[tx.type] || '#64748b') + '18', color: typeColors[tx.type] || '#64748b' }]}>
          {tx.type}
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Balance After</Text>
          <Text style={styles.value}>{tx.balance?.toLocaleString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{new Date(tx.createdAt).toLocaleDateString('vi-VN')}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Time</Text>
          <Text style={styles.value}>{new Date(tx.createdAt).toLocaleTimeString('vi-VN')}</Text>
        </View>
        {tx.reason && (
          <View style={styles.row}>
            <Text style={styles.label}>Reason</Text>
            <Text style={styles.value}>{tx.reason}</Text>
          </View>
        )}
        <View style={styles.row}>
          <Text style={styles.label}>Transaction ID</Text>
          <Text style={[styles.value, { fontFamily: 'monospace', fontSize: 12 }]}>{tx.id}</Text>
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingTop: 60 },
  header: { alignItems: 'center', paddingVertical: 32 },
  amount: { fontSize: 42, fontWeight: '800' },
  type: { paddingHorizontal: 16, paddingVertical: 4, borderRadius: 12, fontSize: 14, fontWeight: '700', marginTop: 8, overflow: 'hidden' },
  card: { marginHorizontal: 20, backgroundColor: 'white', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  label: { fontSize: 14, color: '#64748b' },
  value: { fontSize: 14, fontWeight: '600', color: '#1e293b', maxWidth: '55%', textAlign: 'right' },
});
