import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { members } from '../services/api';
import type { MemberVoucher } from '../services/types';
import { LoadingState, ErrorState, EmptyState } from '../components';

export default function VouchersScreen() {
  const [vouchers, setVouchers] = useState<MemberVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    members.getVouchers()
      .then(r => setVouchers(Array.isArray(r.data) ? r.data : r.data?.data || []))
      .catch(() => setError('Failed to load vouchers'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const renderItem = ({ item }: { item: MemberVoucher }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardCode}>{item.voucher?.code || item.code}</Text>
        <Text style={[styles.badge, item.redeemed ? styles.redeemedBadge : styles.activeBadge]}>
          {item.redeemed ? 'Used' : 'Active'}
        </Text>
      </View>
      <Text style={styles.cardValue}>Value: {item.voucher?.value || item.value}</Text>
      {item.voucher?.expiresAt && (
        <Text style={styles.expiry}>Expires: {new Date(item.voucher.expiresAt).toLocaleDateString()}</Text>
      )}
    </View>
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Vouchers</Text>
      <FlatList data={vouchers} renderItem={renderItem} keyExtractor={(item: MemberVoucher) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState message="No vouchers yet" icon="🎟️" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingTop: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: '#1e293b', paddingHorizontal: 20, marginBottom: 16 },
  list: { padding: 16 },
  card: { backgroundColor: 'white', borderRadius: 14, padding: 18, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardCode: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, fontSize: 12, fontWeight: '600', overflow: 'hidden' },
  activeBadge: { backgroundColor: '#dcfce7', color: '#16a34a' },
  redeemedBadge: { backgroundColor: '#f1f5f9', color: '#64748b' },
  cardValue: { fontSize: 14, color: '#64748b', marginTop: 4 },
  expiry: { fontSize: 13, color: '#94a3b8', marginTop: 4 },
  errorText: { color: '#dc2626', fontSize: 16, textAlign: 'center', paddingHorizontal: 20 },
});
