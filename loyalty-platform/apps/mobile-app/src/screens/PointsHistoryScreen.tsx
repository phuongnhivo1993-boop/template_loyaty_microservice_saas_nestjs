import { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { members } from '../services/api';
import { LoadingState, ErrorState, EmptyState } from '../components';

export default function PointsHistoryScreen() {
  const navigation = useNavigation<any>();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [loadingMore, setLoadingMore] = useState(false);

  const load = async (p = 1, append = false) => {
    if (append) setLoadingMore(true); else setLoading(true);
    setError('');
    try {
      const res = await members.getTransactions({ page: p, limit: 30, type: typeFilter || undefined });
      const result = res.data;
      const payload = result.data ?? result;
      setTransactions(append ? [...transactions, ...(Array.isArray(payload) ? payload : payload?.data || [])] : (Array.isArray(payload) ? payload : payload?.data || []));
      setTotalPages(result.totalPages || 1);
      setPage(p);
    } catch { setError('Failed to load transactions'); }
    if (append) setLoadingMore(false); else setLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await members.getTransactions({ page: 1, limit: 30, type: typeFilter || undefined });
      const result = res.data;
      const payload = result.data ?? result;
      setTransactions(Array.isArray(payload) ? payload : payload?.data || []);
      setTotalPages(result.totalPages || 1);
      setPage(1);
    } catch { setError('Failed to load transactions'); }
    setRefreshing(false);
  }, [typeFilter]);

  useEffect(() => { load(); }, [typeFilter]);

  const handleLoadMore = () => {
    if (page < totalPages) load(page + 1, true);
  };

  const filters = [
    { label: 'All', value: '' },
    { label: 'Earned', value: 'earned' },
    { label: 'Burned', value: 'burned' },
  ];

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={() => load()} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
    <ScrollView style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563eb']} />}>
      <View style={styles.header}>
        <Text style={styles.title}>Points History</Text>
      </View>

      <View style={styles.filterRow}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.value}
            style={[styles.filterBtn, typeFilter === f.value && styles.filterBtnActive]}
            onPress={() => setTypeFilter(f.value)}
          >
            <Text style={[styles.filterText, typeFilter === f.value && styles.filterTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.list}>
        {transactions.length > 0 ? (
          <>
            {transactions.map((t: any) => (
              <View key={t.id} style={styles.txRow}>
                <View style={[styles.txDot, { backgroundColor: t.amount > 0 ? '#16a34a' : '#dc2626' }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.txReason}>{t.reason || `${t.type} transaction`}</Text>
                  <Text style={styles.txDate}>{new Date(t.createdAt).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</Text>
                </View>
                <Text style={[styles.txAmount, { color: t.amount > 0 ? '#16a34a' : '#dc2626' }]}>
                  {t.amount > 0 ? '+' : ''}{t.amount?.toLocaleString()}
                </Text>
              </View>
            ))}
            {page < totalPages && (
              <TouchableOpacity style={styles.loadMore} onPress={handleLoadMore} disabled={loadingMore}>
                {loadingMore ? <ActivityIndicator size="small" color="#2563eb" /> : <Text style={styles.loadMoreText}>Load More</Text>}
              </TouchableOpacity>
            )}
          </>
        ) : (
          <EmptyState message="No transactions found" icon="📄" />
        )}
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 20, paddingTop: 60, backgroundColor: '#1e293b' },
  title: { fontSize: 24, fontWeight: '700', color: 'white' },
  filterRow: { flexDirection: 'row', padding: 12, gap: 8 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f1f5f9' },
  filterBtnActive: { backgroundColor: '#2563eb' },
  filterText: { fontSize: 14, fontWeight: '600', color: '#475569' },
  filterTextActive: { color: 'white' },
  list: { padding: 16, gap: 8 },
  txRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'white',
    borderRadius: 10, padding: 14, gap: 12,
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
  },
  txDot: { width: 10, height: 10, borderRadius: 5 },
  txReason: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  txDate: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  txAmount: { fontSize: 16, fontWeight: '700' },
  loadMore: { alignItems: 'center', padding: 16 },
  loadMoreText: { color: '#2563eb', fontWeight: '600', fontSize: 14 },
});
