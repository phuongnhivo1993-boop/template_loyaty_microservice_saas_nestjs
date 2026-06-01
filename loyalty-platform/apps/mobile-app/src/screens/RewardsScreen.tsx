import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { rewards, members } from '../services/api';
import { useAuthStore } from '../services/authStore';

export default function RewardsScreen() {
  const [items, setItems] = useState<any[]>([]);
  const profile = useAuthStore((s) => s.profile);

  useEffect(() => {
    rewards.list().then((r) => setItems(Array.isArray(r.data) ? r.data : r.data?.data || [])).catch(() => {});
  }, []);

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rewards Catalog</Text>
        <Text style={styles.subtitle}>Redeem your points</Text>
      </View>
      <View style={styles.list}>
        {items.map((r: any) => (
          <View key={r.id} style={styles.card}>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{r.name}</Text>
              <Text style={styles.cardType}>{r.type}</Text>
              <Text style={styles.points}>{r.pointsRequired?.toLocaleString()} pts</Text>
              <Text style={styles.stock}>Stock: {r.quantity}</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => handleRedeem(r.id)}>
              <Text style={styles.buttonText}>Redeem</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
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
});
