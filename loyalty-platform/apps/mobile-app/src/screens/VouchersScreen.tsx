import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { members } from '../services/api';
import type { MemberVoucher } from '../services/types';
import { LoadingState, ErrorState, EmptyState } from '../components';

const TABS = ['ALL', 'ACTIVE', 'REDEEMED'];

export default function VouchersScreen() {
  const [vouchers, setVouchers] = useState<MemberVoucher[]>([]);
  const [loading, setLoading] = useState(true);
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
    <TouchableOpacity style={styles.card} onPress={() => setSelectedVoucher(item)}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardCode}>{item.voucher?.code || item.code}</Text>
        <Text style={[styles.badge, item.redeemed ? styles.redeemedBadge : styles.activeBadge]}>
          {item.redeemed ? 'Used' : 'Active'}
        </Text>
      </View>
      <Text style={styles.cardValue}>{item.voucher?.type}: {item.voucher?.value?.toLocaleString()} VND</Text>
      {!item.redeemed && (
        <Text style={styles.qrHint}>Tap to show QR code</Text>
      )}
      {item.voucher?.expiresAt && (
        <Text style={styles.expiry}>Expires: {new Date(item.voucher.expiresAt).toLocaleDateString('vi-VN')}</Text>
      )}
    </TouchableOpacity>
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Vouchers</Text>

      <View style={styles.filterRow}>
        {TABS.map(tab => (
          <TouchableOpacity key={tab} onPress={() => setFilter(tab)}
            style={[styles.filterBtn, filter === tab && styles.filterActive]}>
            <Text style={[styles.filterText, filter === tab && styles.filterTextActive]}>{tab}</Text>
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
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Voucher QR Code</Text>
            <View style={styles.qrPlaceholder}>
              <Text style={styles.qrCode}>{selectedVoucher?.qrCode || selectedVoucher?.id}</Text>
            </View>
            <Text style={styles.qrLabel}>Show this code to the store staff</Text>
            <Text style={styles.qrSub}>Code: {selectedVoucher?.voucher?.code}</Text>
            <Text style={styles.qrSub}>Value: {selectedVoucher?.voucher?.value?.toLocaleString()} VND</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedVoucher(null)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingTop: 60 },
  title: { fontSize: 24, fontWeight: '800', color: '#1e293b', paddingHorizontal: 20, marginBottom: 8 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 12, gap: 8 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, backgroundColor: '#f1f5f9' },
  filterActive: { backgroundColor: '#2563eb' },
  filterText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  filterTextActive: { color: 'white' },
  list: { padding: 16 },
  card: { backgroundColor: 'white', borderRadius: 14, padding: 18, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardCode: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, fontSize: 12, fontWeight: '600', overflow: 'hidden' },
  activeBadge: { backgroundColor: '#dcfce7', color: '#16a34a' },
  redeemedBadge: { backgroundColor: '#f1f5f9', color: '#64748b' },
  cardValue: { fontSize: 14, color: '#64748b', marginTop: 4 },
  qrHint: { fontSize: 13, color: '#2563eb', marginTop: 6, fontWeight: '600' },
  expiry: { fontSize: 13, color: '#94a3b8', marginTop: 4 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', borderRadius: 20, padding: 32, alignItems: 'center', width: '85%' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 20 },
  qrPlaceholder: { width: 200, height: 200, backgroundColor: '#f8fafc', borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#e2e8f0', marginBottom: 16 },
  qrCode: { fontSize: 12, color: '#1e293b', fontFamily: 'monospace', textAlign: 'center', padding: 8 },
  qrLabel: { fontSize: 14, color: '#64748b', marginBottom: 8 },
  qrSub: { fontSize: 13, color: '#94a3b8', marginTop: 2 },
  closeBtn: { marginTop: 20, paddingHorizontal: 32, paddingVertical: 12, backgroundColor: '#2563eb', borderRadius: 10 },
  closeBtnText: { color: 'white', fontSize: 15, fontWeight: '600' },
});
