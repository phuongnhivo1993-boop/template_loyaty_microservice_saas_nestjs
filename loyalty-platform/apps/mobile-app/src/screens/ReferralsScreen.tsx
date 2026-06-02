import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Share } from 'react-native';
import { members } from '../services/api';
import type { Referral } from '../services/types';
import { LoadingState, ErrorState, EmptyState } from '../components';

interface ReferralStats {
  total: number; converted: number; pending: number;
}

export default function ReferralsScreen() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    members.getReferrals().then((r) => {
      const data = r.data;
      setReferrals(Array.isArray(data) ? data : data?.data || []);
      setStats(data?.stats || null);
    }).catch(() => setError('Failed to load referrals'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleShare = async (code: string) => {
    await Share.share({ message: `Join me on Loyalty Platform! Use my referral code: ${code}` });
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Referrals</Text>
        <Text style={styles.subtitle}>Invite friends and earn points</Text>
      </View>

      {stats && (
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.total || 0}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#16a34a' }]}>{stats.converted || 0}</Text>
            <Text style={styles.statLabel}>Converted</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#2563eb' }]}>{stats.pending || 0}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>
      )}

      <View style={styles.list}>
        {referrals.length > 0 ? referrals.map((r: Referral) => (
          <View key={r.id} style={styles.card}>
            <View>
              <Text style={styles.code}>Code: {r.code}</Text>
              <Text style={styles.status}>{r.status}</Text>
            </View>
            <Text style={styles.shareLink} onPress={() => handleShare(r.code)}>Share</Text>
          </View>
        )) : (
          <EmptyState message="No referrals yet" icon="🔗" />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  header: { padding: 20, paddingTop: 60, backgroundColor: '#1e293b' },
  title: { fontSize: 24, fontWeight: '700', color: 'white' },
  subtitle: { color: '#94a3b8', marginTop: 4 },
  statsRow: { flexDirection: 'row', padding: 16, gap: 12 },
  statCard: { flex: 1, backgroundColor: 'white', borderRadius: 12, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  statValue: { fontSize: 24, fontWeight: '800', color: '#1e293b' },
  statLabel: { fontSize: 12, color: '#64748b', marginTop: 4 },
  list: { padding: 16, gap: 12 },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  code: { fontSize: 16, fontWeight: '600', color: '#1e293b', fontFamily: 'monospace' },
  status: { fontSize: 12, color: '#64748b', marginTop: 4 },
  shareLink: { color: '#2563eb', fontWeight: '600', fontSize: 14 },
  errorText: { color: '#dc2626', fontSize: 16, textAlign: 'center', paddingHorizontal: 20 },
});
