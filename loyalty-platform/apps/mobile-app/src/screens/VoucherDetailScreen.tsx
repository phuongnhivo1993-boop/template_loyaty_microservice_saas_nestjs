import { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { members } from '../services/api';
import type { MemberVoucher } from '../services/types';
import { LoadingState, ErrorState } from '../components';

export default function VoucherDetailScreen() {
  const route = useRoute<any>();
  const voucherParam = route.params?.voucher as MemberVoucher | undefined;
  const [voucher, setVoucher] = useState<MemberVoucher | null>(voucherParam || null);
  const [loading, setLoading] = useState(!voucherParam);
  const [error, setError] = useState('');

  const load = () => {
    if (voucherParam) return;
    setLoading(true);
    setError('');
    members.getVouchers()
      .then(r => {
        const list = r.data?.data || r.data || [];
        const found = list.find((v: MemberVoucher) => v.id === route.params?.id);
        if (found) setVoucher(found);
        else setError('Voucher not found');
      })
      .catch(() => setError('Failed to load voucher'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!voucher) return <ErrorState message="Voucher not found" />;

  const v = voucher.voucher || voucher as any;
  const isRedeemed = voucher.redeemed;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
    <ScrollView style={styles.container}>
      <View style={styles.qrSection}>
        <View style={styles.qrPlaceholder}>
          <Text style={styles.qrCode}>{voucher.qrCode || voucher.id}</Text>
        </View>
        <Text style={styles.qrLabel}>Show this code to the store staff</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.code}>{v.code}</Text>
          <Text style={[styles.badge, isRedeemed ? styles.redeemedBadge : styles.activeBadge]}>
            {isRedeemed ? 'Used' : 'Active'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Type</Text>
          <Text style={styles.value}>{v.type}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Value</Text>
          <Text style={styles.value}>{v.value?.toLocaleString()} VND</Text>
        </View>
        {v.expiresAt && (
          <View style={styles.row}>
            <Text style={styles.label}>Expires</Text>
            <Text style={styles.value}>{new Date(v.expiresAt).toLocaleDateString('vi-VN')}</Text>
          </View>
        )}
        {voucher.redeemedAt && (
          <View style={styles.row}>
            <Text style={styles.label}>Redeemed At</Text>
            <Text style={styles.value}>{new Date(voucher.redeemedAt).toLocaleDateString('vi-VN')}</Text>
          </View>
        )}
        <View style={styles.row}>
          <Text style={styles.label}>Code</Text>
          <Text style={[styles.value, { fontFamily: 'monospace' }]}>{v.code}</Text>
        </View>
      </View>

      {!isRedeemed && (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Present this voucher at the store to redeem your reward.</Text>
        </View>
      )}
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingTop: 60 },
  qrSection: { alignItems: 'center', paddingVertical: 24 },
  qrPlaceholder: { width: 200, height: 200, backgroundColor: 'white', borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#e2e8f0', marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  qrCode: { fontSize: 11, color: '#1e293b', fontFamily: 'monospace', textAlign: 'center', padding: 8 },
  qrLabel: { fontSize: 14, color: '#64748b', fontWeight: '500' },
  card: { marginHorizontal: 20, backgroundColor: 'white', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  code: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, fontSize: 13, fontWeight: '600', overflow: 'hidden' },
  activeBadge: { backgroundColor: '#dcfce7', color: '#16a34a' },
  redeemedBadge: { backgroundColor: '#f1f5f9', color: '#64748b' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  label: { fontSize: 14, color: '#64748b' },
  value: { fontSize: 14, fontWeight: '600', color: '#1e293b', maxWidth: '55%', textAlign: 'right' },
  infoBox: { margin: 20, padding: 16, backgroundColor: '#eff6ff', borderRadius: 12 },
  infoText: { fontSize: 14, color: '#2563eb', lineHeight: 20, textAlign: 'center' },
});
