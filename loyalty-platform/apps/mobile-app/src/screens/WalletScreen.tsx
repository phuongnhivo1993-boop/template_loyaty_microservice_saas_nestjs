import { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { members } from '../services/api';
import type { PointTransaction } from '../services/types';
import { LoadingState, ErrorState, EmptyState } from '../components';
import { useColors } from '../theme/useColors';

interface WalletData {
  availablePoints: number;
  transactions: PointTransaction[];
}

const TABS = ['ALL', 'EARN', 'BURN', 'EXPIRE', 'ADJUST'];

export default function WalletScreen() {
  const navigation = useNavigation<any>();
  const colors = useColors();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');

  const load = () => {
    setLoading(true);
    setError('');
    members.getWallet()
      .then((r) => setWallet(r.data))
      .catch(() => setError('Failed to load wallet'))
      .finally(() => setLoading(false));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    members.getWallet()
      .then((r) => setWallet(r.data))
      .catch(() => setError('Failed to refresh'))
      .finally(() => setRefreshing(false));
  }, []);

  useEffect(() => { load(); }, []);

  const filteredTx = wallet?.transactions?.filter(t =>
    filter === 'ALL' || t.type === filter
  ) || [];

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const totalEarned = wallet?.transactions?.filter(t => t.type === 'EARN').reduce((s, t) => s + (t.amount > 0 ? t.amount : 0), 0) || 0;
  const totalBurned = wallet?.transactions?.filter(t => t.type === 'BURN').reduce((s, t) => s + Math.abs(t.amount), 0) || 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primaryDark]} />}>
      <View style={[styles.header, { backgroundColor: colors.primaryDark }]}>
        <Text style={styles.balance}>{(wallet?.availablePoints || 0).toLocaleString()}</Text>
        <Text style={styles.label}>Available Points</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.success }]}>+{totalEarned.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Earned</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.error }]}>-{totalBurned.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Burned</Text>
          </View>
        </View>
      </View>

      <View style={styles.filterRow}>
        {TABS.map(tab => (
          <TouchableOpacity key={tab} onPress={() => setFilter(tab)}
            style={[styles.filterBtn, { backgroundColor: colors.border }, filter === tab && { backgroundColor: colors.primaryDark }]}>
            <Text style={[styles.filterText, { color: colors.textSecondary }, filter === tab && styles.filterTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        {filteredTx.length > 0 ? filteredTx.map((t: PointTransaction) => (
          <View key={t.id} style={[styles.transaction, { borderBottomColor: colors.border }]}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={[styles.txType, { color: colors.text, backgroundColor: colors.border }]}>{t.type}</Text>
                <Text style={[styles.txReason, { color: colors.textSecondary }]}>{t.reason || '-'}</Text>
              </View>
              <Text style={[styles.txDate, { color: colors.textSecondary }]}>{new Date(t.createdAt).toLocaleDateString('vi-VN')}</Text>
            </View>
            <Text style={[styles.txAmount, t.amount > 0 ? { color: colors.success } : { color: colors.error }]}>
              {t.amount > 0 ? '+' : ''}{t.amount?.toLocaleString()}
            </Text>
          </View>
        )) : (
          <EmptyState message="No transactions found" icon="💳" />
        )}
        <TouchableOpacity style={styles.viewAllBtn} onPress={() => navigation.navigate('PointsHistory')}>
          <Text style={[styles.viewAllText, { color: colors.primaryDark }]}>View Full History →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 32, alignItems: 'center' },
  balance: { fontSize: 40, fontWeight: '800', color: 'white' },
  label: { fontSize: 14, color: '#bfdbfe', marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 32, marginTop: 16 },
  statBox: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '700' },
  statLabel: { fontSize: 12, color: '#bfdbfe', marginTop: 2 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  filterText: { fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: 'white' },
  section: { padding: 16, paddingTop: 0 },
  transaction: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  txType: { fontWeight: '700', fontSize: 13, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' },
  txReason: { fontSize: 13, flex: 1 },
  txDate: { fontSize: 12, marginTop: 4 },
  txAmount: { fontWeight: '700', fontSize: 16 },
  viewAllBtn: { alignItems: 'center', paddingVertical: 14, marginTop: 4 },
  viewAllText: { fontWeight: '600', fontSize: 14 },
});
