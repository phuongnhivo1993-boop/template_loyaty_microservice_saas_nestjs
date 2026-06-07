import { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { members } from '../services/api';
import type { MemberVoucher } from '../services/types';
import { LoadingState, ErrorState, EmptyState, QRCode } from '../components';
import { useColors } from '../theme/useColors';

const TABS = ['ALL', 'ACTIVE', 'REDEEMED'];

export default function VouchersScreen() {
  const colors = useColors();
  const [vouchers, setVouchers] = useState<MemberVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [selectedVoucher, setSelectedVoucher] = useState<MemberVoucher | null>(null);

  const load = () => {
    setLoading(true);
    setError('');
    members.getVouchers()
      .then(r => setVouchers(Array.isArray(r.data) ? r.data : r.data?.data || []))
      .catch(() => setError('Failed to load vouchers'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filteredVouchers = vouchers.filter(v => {
    if (filter === 'ALL') return true;
    if (filter === 'ACTIVE') return !v.redeemed;
    if (filter === 'REDEEMED') return v.redeemed;
    return true;
  });

  const renderItem = ({ item }: { item: MemberVoucher }) => (
    <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]} onPress={() => setSelectedVoucher(item)}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardCode, { color: colors.text }]}>{item.voucher?.code || item.code}</Text>
        <Text style={[styles.badge, item.redeemed ? { backgroundColor: colors.border, color: colors.textSecondary } : { backgroundColor: colors.successBg, color: colors.success }]}>
          {item.redeemed ? 'Used' : 'Active'}
        </Text>
      </View>
      <Text style={[styles.cardValue, { color: colors.textSecondary }]}>{item.voucher?.type}: {item.voucher?.value?.toLocaleString()} VND</Text>
      {!item.redeemed && (
        <Text style={[styles.qrHint, { color: colors.primaryDark }]}>Tap to show QR code</Text>
      )}
      {item.voucher?.expiresAt && (
        <Text style={[styles.expiry, { color: colors.textSecondary }]}>Expires: {new Date(item.voucher.expiresAt).toLocaleDateString('vi-VN')}</Text>
      )}
    </TouchableOpacity>
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>My Vouchers</Text>

      <View style={styles.filterRow}>
        {TABS.map(tab => (
          <TouchableOpacity key={tab} onPress={() => setFilter(tab)}
            style={[styles.filterBtn, { backgroundColor: colors.border }, filter === tab && { backgroundColor: colors.primaryDark }]}>
            <Text style={[styles.filterText, { color: colors.textSecondary }, filter === tab && styles.filterTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList data={filteredVouchers} renderItem={renderItem} keyExtractor={(item: MemberVoucher) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState message="No vouchers found" icon="🎟️" />}
      />

      <Modal visible={!!selectedVoucher} transparent animationType="fade"
        onRequestClose={() => setSelectedVoucher(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Voucher QR Code</Text>
            <View style={[styles.qrPlaceholder, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <QRCode value={selectedVoucher?.id} size={180} />
            </View>
            <Text style={[styles.qrLabel, { color: colors.textSecondary }]}>Show this code to the store staff</Text>
            <Text style={[styles.qrSub, { color: colors.textSecondary }]}>Code: {selectedVoucher?.voucher?.code}</Text>
            <Text style={[styles.qrSub, { color: colors.textSecondary }]}>Value: {selectedVoucher?.voucher?.value?.toLocaleString()} VND</Text>
            <TouchableOpacity style={[styles.closeBtn, { backgroundColor: colors.primaryDark }]} onPress={() => setSelectedVoucher(null)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: '800', paddingHorizontal: 20, marginBottom: 8 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 12, gap: 8 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  filterText: { fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: 'white' },
  list: { padding: 16 },
  card: { borderRadius: 14, padding: 18, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardCode: { fontSize: 16, fontWeight: '700' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, fontSize: 12, fontWeight: '600', overflow: 'hidden' },
  cardValue: { fontSize: 14, marginTop: 4 },
  qrHint: { fontSize: 13, marginTop: 6, fontWeight: '600' },
  expiry: { fontSize: 13, marginTop: 4 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { borderRadius: 20, padding: 32, alignItems: 'center', width: '85%' },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 20 },
  qrPlaceholder: { width: 200, height: 200, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, marginBottom: 16 },
  qrLabel: { fontSize: 14, marginBottom: 8 },
  qrSub: { fontSize: 13, marginTop: 2 },
  closeBtn: { marginTop: 20, paddingHorizontal: 32, paddingVertical: 12, borderRadius: 10 },
  closeBtnText: { color: 'white', fontSize: 15, fontWeight: '600' },
});
