import { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../services/authStore';
import { members } from '../services/api';
import { LoadingState, ErrorState, QRCode } from '../components';

export default function MembershipCardScreen() {
  const profile = useAuthStore((s) => s.profile);
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    members.getWallet()
      .then(r => setWallet(r.data))
      .catch(() => setError('Failed to load wallet'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const points = wallet?.availablePoints ?? profile?.availablePoints ?? 0;
  const tierName = profile?.tier?.name || 'Bronze';
  const tierColor = profile?.tier?.color || '#cd7f32';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Membership Card</Text>

      <View style={[styles.card, { borderColor: tierColor }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Loyalty Member</Text>
          <View style={[styles.tierBadge, { backgroundColor: tierColor + '22' }]}>
            <Text style={[styles.tierText, { color: tierColor }]}>{tierName}</Text>
          </View>
        </View>

        <View style={styles.qrPlaceholder}>
          <QRCode value={profile?.id || 'MEMBER'} size={160} />
        </View>

        <Text style={styles.memberName}>{profile?.fullName || 'Member'}</Text>
        <Text style={styles.memberEmail}>{profile?.email || ''}</Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{points?.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{tierName}</Text>
            <Text style={styles.statLabel}>Tier</Text>
          </View>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>How to use</Text>
        <Text style={styles.infoText}>Show this card to the store staff to earn points on your purchases.</Text>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingTop: 60 },
  title: { fontSize: 24, fontWeight: '800', color: '#1e293b', paddingHorizontal: 20, marginBottom: 16 },
  card: { marginHorizontal: 20, backgroundColor: 'white', borderRadius: 20, padding: 24, borderWidth: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  tierBadge: { paddingHorizontal: 14, paddingVertical: 4, borderRadius: 12 },
  tierText: { fontSize: 13, fontWeight: '700' },
  qrPlaceholder: { width: 180, height: 180, backgroundColor: '#f8fafc', borderRadius: 16, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  memberName: { fontSize: 20, fontWeight: '700', color: '#1e293b', textAlign: 'center' },
  memberEmail: { fontSize: 14, color: '#64748b', textAlign: 'center', marginTop: 4 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '700', color: '#2563eb' },
  statLabel: { fontSize: 13, color: '#94a3b8', marginTop: 4 },
  infoBox: { margin: 20, padding: 16, backgroundColor: '#eff6ff', borderRadius: 12 },
  infoTitle: { fontSize: 15, fontWeight: '600', color: '#2563eb', marginBottom: 6 },
  infoText: { fontSize: 14, color: '#64748b', lineHeight: 20 },
});
