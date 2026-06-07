import { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { cashback } from '../services/api';
import { useAuthStore } from '../services/authStore';
import type { CashbackBalance, CashbackTransaction } from '../services/types';
import { LoadingState, ErrorState, EmptyState, Header } from '../components';
import { useColors } from '../theme/useColors';

const TABS = ['ALL', 'EARN', 'BURN'];

export default function CashbackScreen() {
  const colors = useColors();
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Cashback" subtitle="Earn cashback on every purchase" />
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primaryDark]} />}
        ListHeaderComponent={
          <>
            <View style={[styles.balanceCard, { backgroundColor: colors.primaryDark }]}>
              <Text style={styles.balanceLabel}>Cashback Balance</Text>
              <Text style={styles.balanceValue}>
                {(balance?.balance ?? 0).toLocaleString()} {balance?.currency || 'VND'}
              </Text>
            </View>

            <View style={styles.filterRow}>
              {TABS.map(tab => (
                <TouchableOpacity key={tab} onPress={() => setFilter(tab)}
                  style={[styles.filterBtn, { backgroundColor: colors.border }, filter === tab && { backgroundColor: colors.primaryDark }]}>
                  <Text style={[styles.filterText, { color: colors.textSecondary }, filter === tab && styles.filterTextActive]}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        }
        data={filtered}
        keyExtractor={(item: CashbackTransaction) => item.id}
        renderItem={({ item }: { item: CashbackTransaction }) => (
          <View style={[styles.txCard, { backgroundColor: colors.card }]}>
            <View style={styles.txHeader}>
              <Text style={[styles.txType, item.type === 'EARN' ? { color: colors.success } : { color: colors.error }]}>
                {item.type === 'EARN' ? '+' : '-'}{item.amount.toLocaleString()}
              </Text>
              <Text style={[styles.txDate, { color: colors.textSecondary }]}>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</Text>
            </View>
            {item.reason && <Text style={[styles.txReason, { color: colors.textSecondary }]}>{item.reason}</Text>}
            <Text style={[styles.txBalance, { color: colors.textSecondary }]}>Balance: {item.balance.toLocaleString()}</Text>
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
    margin: 16, padding: 24, borderRadius: 16,
    alignItems: 'center',
  },
  balanceLabel: { fontSize: 14, color: '#bfdbfe' },
  balanceValue: { fontSize: 32, fontWeight: '800', color: 'white', marginTop: 4 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 12, gap: 8 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  filterActive: {},
  filterText: { fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: 'white' },
  txCard: {
    borderRadius: 12, padding: 16, marginHorizontal: 16, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  txHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  txType: { fontSize: 18, fontWeight: '700' },
  txDate: { fontSize: 13 },
  txReason: { fontSize: 14, marginTop: 4 },
  txBalance: { fontSize: 12, marginTop: 6 },
});
