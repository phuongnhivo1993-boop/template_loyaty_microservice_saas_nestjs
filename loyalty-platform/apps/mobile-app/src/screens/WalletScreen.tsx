import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { members } from '../services/api';
import type { PointTransaction } from '../services/types';
import { Card, LoadingState, ErrorState, EmptyState } from '../components';

interface WalletData {
  availablePoints: number;
  transactions: PointTransaction[];
}

export default function WalletScreen() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    members.getWallet()
      .then((r) => setWallet(r.data))
      .catch(() => setError('Failed to load wallet'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.balance}>{(wallet?.availablePoints || 0).toLocaleString()}</Text>
        <Text style={styles.label}>Available Points</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {wallet?.transactions && wallet.transactions.length > 0 ? wallet.transactions.map((t: PointTransaction) => (
          <View key={t.id} style={styles.transaction}>
            <View>
              <Text style={styles.txType}>{t.type}</Text>
              <Text style={styles.txDate}>{new Date(t.createdAt).toLocaleDateString()}</Text>
            </View>
            <Text style={[styles.txAmount, t.amount > 0 ? styles.positive : styles.negative]}>
              {t.amount > 0 ? '+' : ''}{t.amount}
            </Text>
          </View>
        )) : (
          <EmptyState message="No transactions yet" icon="💳" />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  header: { padding: 32, alignItems: 'center', backgroundColor: '#2563eb' },
  balance: { fontSize: 40, fontWeight: '800', color: 'white' },
  label: { fontSize: 14, color: '#bfdbfe', marginTop: 4 },
  section: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16, color: '#1e293b' },
  transaction: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  txType: { fontWeight: '600', color: '#1e293b' },
  txDate: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  txAmount: { fontWeight: '700', fontSize: 16 },
  positive: { color: '#16a34a' },
  negative: { color: '#dc2626' },
  emptyText: { textAlign: 'center', color: '#94a3b8', marginTop: 20, fontSize: 15 },
  errorText: { color: '#dc2626', fontSize: 16, textAlign: 'center', paddingHorizontal: 20 },
});
