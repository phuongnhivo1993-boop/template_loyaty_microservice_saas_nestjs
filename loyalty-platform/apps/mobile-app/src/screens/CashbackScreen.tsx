import { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { cashback } from '../services/api';
import { useAuthStore } from '../services/authStore';
import type { CashbackBalance, CashbackTransaction } from '../services/types';
import { LoadingState, ErrorState, EmptyState, Header } from '../components';

const TABS = ['ALL', 'EARN', 'BURN'];

export default function CashbackScreen() {
  const profile = useAuthStore((s) => s.profile);
  const [balance, setBalance] = useState<CashbackBalance | null>(null);
  const [transactions, setTransactions] = useState<CashbackTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');

  const load = () => {
    if (!profile?.id) return;
    setLoading(true);
    setError('');
    Promise.all([
      cashback.getBalance(profile.id).then(r => setBalance(r.data)),
      cashback.getTransactions(profile.id).then(r => setTransactions(Array.isArray(r.data) ? r.data : r.data?.data || [])),
    ]).catch(() => setError('Failed to load cashback data'))
      .finally(() => setLoading(false));
  };

  const onRefresh = useCallback(async () => {
    if (!profile?.id) return;
    setRefreshing(true);
    try {
      const [b, t] = await Promise.all([
        cashback.getBalance(profile.id),
        cashback.getTransactions(profile.id),
      ]);
      setBalance(b.data);
      setTransactions(Array.isArray(t.data) ? t.data : t.data?.data || []);
    } catch { setError('Failed to load cashback data'); }
    setRefreshing(false);
  }, [profile?.id]);

  useEffect(() => { load(); }, [profile?.id]);

  const filtered = transactions.filter(tx => {
    if (filter === 'ALL') return true;
    return tx.type === filter;
  });

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <Header title="Cashback" subtitle="Earn cashback on every purchase" />
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563eb']} />}
        ListHeaderComponent={
          <>
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Cashback Balance</Text>
              <Text style={styles.balanceValue}>
                {(balance?.balance ?? 0).toLocaleString()} {balance?.currency || 'VND'}
              </Text>
            </View>

            <View style={styles.filterRow}>
              {TABS.map(tab => (
                <TouchableOpacity key={tab} onPress={() => setFilter(tab)}
                  style={[styles.filterBtn, filter === tab && styles.filterActive]}>
                  <Text style={[styles.filterText, filter === tab && styles.filterTextActive]}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        }
        data={filtered}
        keyExtractor={(item: CashbackTransaction) => item.id}
        renderItem={({ item }: { item: CashbackTransaction }) => (
          <View style={styles.txCard}>
            <View style={styles.txHeader}>
              <Text style={[styles.txType, item.type === 'EARN' ? styles.earnText : styles.burnText]}>
                {item.type === 'EARN' ? '+' : '-'}{item.amount.toLocaleString()}
              </Text>
              <Text style={styles.txDate}>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</Text>
            </View>
            {item.reason && <Text style={styles.txReason}>{item.reason}</Text>}
            <Text style={styles.txBalance}>Balance: {item.balance.toLocaleString()}</Text>
          </View>
        )}
        ListEmptyComponent={<EmptyState message="No transactions found" icon="💵" />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingBottom: 24 },
  balanceCard: {
    margin: 16, padding: 24, backgroundColor: '#2563eb', borderRadius: 16,
    alignItems: 'center',
  },
  balanceLabel: { fontSize: 14, color: '#bfdbfe' },
  balanceValue: { fontSize: 32, fontWeight: '800', color: 'white', marginTop: 4 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 12, gap: 8 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, backgroundColor: '#f1f5f9' },
  filterActive: { backgroundColor: '#2563eb' },
  filterText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  filterTextActive: { color: 'white' },
  txCard: {
    backgroundColor: 'white', borderRadius: 12, padding: 16, marginHorizontal: 16, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  txHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  txType: { fontSize: 18, fontWeight: '700' },
  earnText: { color: '#16a34a' },
  burnText: { color: '#dc2626' },
  txDate: { fontSize: 13, color: '#94a3b8' },
  txReason: { fontSize: 14, color: '#64748b', marginTop: 4 },
  txBalance: { fontSize: 12, color: '#94a3b8', marginTop: 6 },
});
