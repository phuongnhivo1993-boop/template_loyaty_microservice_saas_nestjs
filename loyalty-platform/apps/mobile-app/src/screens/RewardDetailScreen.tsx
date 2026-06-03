import { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { rewards, members } from '../services/api';
import { useAuthStore } from '../services/authStore';
import type { Reward } from '../services/types';
import { LoadingState, ErrorState } from '../components';

export default function RewardDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { id } = route.params || {};
  const [reward, setReward] = useState<Reward | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [redeeming, setRedeeming] = useState(false);
  const profile = useAuthStore((s) => s.profile);

  const load = () => {
    if (!id) { setError('Reward ID not found'); setLoading(false); return; }
    setLoading(true);
    setError('');
    rewards.getById(id)
      .then(r => setReward(r.data))
      .catch(() => setError('Failed to load reward'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  const handleRedeem = () => {
    if (!reward || !profile) return;
    Alert.alert(
      'Redeem Reward',
      `Redeem "${reward.name}" for ${reward.pointsRequired} points?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Redeem',
          onPress: async () => {
            setRedeeming(true);
            try {
              await rewards.redeem(reward.id, { memberId: profile.id });
              Alert.alert('Success', 'Reward redeemed successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (err: any) {
              Alert.alert('Error', err?.response?.data?.message || 'Failed to redeem reward');
            }
            setRedeeming(false);
          },
        },
      ],
    );
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!reward) return <ErrorState message="Reward not found" onRetry={load} />;

  const outOfStock = reward.quantity <= 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {reward.imageUrl ? (
          <Image source={{ uri: reward.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderIcon}>🎁</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{reward.name}</Text>
        {reward.description && <Text style={styles.desc}>{reward.description}</Text>}

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{reward.pointsRequired?.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, outOfStock && { color: '#dc2626' }]}>{reward.quantity}</Text>
            <Text style={styles.statLabel}>In Stock</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{reward.type}</Text>
            <Text style={styles.statLabel}>Type</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.redeemButton, (outOfStock || redeeming) && styles.disabledButton]}
          onPress={handleRedeem}
          disabled={outOfStock || redeeming}
        >
          {redeeming ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.redeemText}>{outOfStock ? 'Out of Stock' : 'Redeem Now'}</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  imageContainer: { height: 240, backgroundColor: '#e2e8f0' },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholderIcon: { fontSize: 80 },
  content: { padding: 20 },
  name: { fontSize: 24, fontWeight: '800', color: '#1e293b', marginBottom: 8 },
  desc: { fontSize: 15, color: '#64748b', lineHeight: 22, marginBottom: 24 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'white', borderRadius: 16, padding: 20, marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '700', color: '#2563eb' },
  statLabel: { fontSize: 13, color: '#94a3b8', marginTop: 4 },
  redeemButton: { backgroundColor: '#2563eb', borderRadius: 14, padding: 16, alignItems: 'center' },
  disabledButton: { backgroundColor: '#94a3b8' },
  redeemText: { color: 'white', fontSize: 16, fontWeight: '700' },
});
