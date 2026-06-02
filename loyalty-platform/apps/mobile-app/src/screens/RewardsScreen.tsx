import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { rewards } from '../services/api';
import { useAuthStore } from '../services/authStore';
import type { Reward } from '../services/types';
import { LoadingState, ErrorState, EmptyState } from '../components';

export default function RewardsScreen() {
  const navigation = useNavigation<any>();
  const [items, setItems] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const profile = useAuthStore((s) => s.profile);

  const load = () => {
    setLoading(true);
    setError('');
    rewards.list()
      .then((r) => setItems(Array.isArray(r.data) ? r.data : r.data?.data || []))
      .catch(() => setError('Failed to load rewards'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleRedeem = async (rewardId: string) => {
    if (!profile?.id) return;
    Alert.alert('Confirm', 'Redeem this reward?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Redeem', onPress: async () => {
        try {
          await rewards.redeem(rewardId, { memberId: profile.id });
          Alert.alert('Success', 'Reward redeemed!');
        } catch { Alert.alert('Error', 'Not enough points or out of stock.'); }
      }},
    ]);
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rewards Catalog</Text>
        <Text style={styles.subtitle}>Redeem your points</Text>
      </View>
      <View style={styles.list}>
        {items.length > 0 ? items.map((r: Reward) => (
          <TouchableOpacity key={r.id} style={styles.card} onPress={() => navigation.navigate('RewardDetail', { id: r.id })}>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{r.name}</Text>
              <Text style={styles.cardType}>{r.type}</Text>
              <Text style={styles.points}>{r.pointsRequired?.toLocaleString()} pts</Text>
              <Text style={styles.stock}>Stock: {r.quantity}</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => handleRedeem(r.id)}>
              <Text style={styles.buttonText}>Redeem</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )) : (
          <EmptyState message="No rewards available" icon="🎁" />
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
  list: { padding: 16, gap: 12 },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  cardType: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  points: { fontSize: 18, fontWeight: '700', color: '#2563eb', marginTop: 4 },
  stock: { fontSize: 12, color: '#64748b', marginTop: 2 },
  button: { backgroundColor: '#2563eb', borderRadius: 8, paddingHorizontal: 20, paddingVertical: 10 },
  buttonText: { color: 'white', fontWeight: '600', fontSize: 14 },
  emptyText: { textAlign: 'center', color: '#94a3b8', marginTop: 60, fontSize: 15 },
  errorText: { color: '#dc2626', fontSize: 16, textAlign: 'center', paddingHorizontal: 20 },
});
