import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { rewards, cartRedeem } from '../services/api';
import { useAuthStore } from '../services/authStore';
import type { Reward } from '../services/types';
import { LoadingState, ErrorState, EmptyState } from '../components';

export default function RewardsScreen() {
  const navigation = useNavigation<any>();
  const [items, setItems] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState<Record<string, number>>({});
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

  const toggleCart = (rewardId: string) => {
    setCart(prev => {
      const next = { ...prev };
      if (next[rewardId]) delete next[rewardId];
      else next[rewardId] = 1;
      return next;
    });
  };

  const updateQty = (rewardId: string, delta: number) => {
    setCart(prev => {
      const next = { ...prev };
      const current = next[rewardId] || 0;
      const newQty = current + delta;
      if (newQty <= 0) delete next[rewardId];
      else next[rewardId] = newQty;
      return next;
    });
  };

  const cartItems = Object.entries(cart);
  const cartTotal = cartItems.reduce((sum, [id, qty]) => {
    const r = items.find(i => i.id === id);
    return sum + (r ? r.pointsRequired * qty : 0);
  }, 0);

  const handleCartRedeem = () => {
    if (!profile?.id || cartItems.length === 0) return;
    const payload = cartItems.map(([rewardId, quantity]) => ({ rewardId, quantity }));
    Alert.alert(
      'Confirm Cart',
      `Redeem ${cartItems.length} item(s) for ${cartTotal.toLocaleString()} points?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Redeem All',
          onPress: async () => {
            try {
              await cartRedeem(payload);
              Alert.alert('Success', 'All rewards redeemed!', [
                { text: 'OK', onPress: () => { setCart({}); load(); } },
              ]);
            } catch (err: any) {
              Alert.alert('Error', err?.response?.data?.message || 'Cart redemption failed');
            }
          },
        },
      ],
    );
  };

  const handleSingleRedeem = async (rewardId: string) => {
    if (!profile?.id) return;
    Alert.alert('Confirm', 'Redeem this reward?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Redeem', onPress: async () => {
        try {
          await cartRedeem([{ rewardId, quantity: 1 }]);
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

      {cartItems.length > 0 && (
        <View style={styles.cartBar}>
          <Text style={styles.cartText}>{cartItems.length} items · {cartTotal.toLocaleString()} pts</Text>
          <TouchableOpacity style={styles.cartBtn} onPress={handleCartRedeem}>
            <Text style={styles.cartBtnText}>Redeem All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCart({})}>
            <Text style={styles.clearCart}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.list}>
        {items.length > 0 ? items.map((r: Reward) => {
          const inCart = cart[r.id] || 0;
          return (
            <View key={r.id} style={styles.card}>
              <TouchableOpacity style={styles.cardBody} onPress={() => navigation.navigate('RewardDetail', { id: r.id })}>
                <Text style={styles.cardTitle}>{r.name}</Text>
                <Text style={styles.cardType}>{r.type}</Text>
                <Text style={styles.points}>{r.pointsRequired?.toLocaleString()} pts</Text>
                <Text style={styles.stock}>Stock: {r.quantity}</Text>
              </TouchableOpacity>
              <View style={styles.cardActions}>
                {inCart > 0 ? (
                  <View style={styles.qtyControl}>
                    <TouchableOpacity onPress={() => updateQty(r.id, -1)} style={styles.qtyBtn}><Text style={styles.qtyBtnText}>-</Text></TouchableOpacity>
                    <Text style={styles.qtyValue}>{inCart}</Text>
                    <TouchableOpacity onPress={() => updateQty(r.id, 1)} style={styles.qtyBtn}><Text style={styles.qtyBtnText}>+</Text></TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.button} onPress={() => toggleCart(r.id)}>
                    <Text style={styles.buttonText}>Add</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={[styles.button, { backgroundColor: '#e2e8f0', marginTop: 4 }]} onPress={() => handleSingleRedeem(r.id)}>
                  <Text style={[styles.buttonText, { color: '#475569' }]}>Quick</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }) : (
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
  cartBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#2563eb',
    margin: 12, padding: 12, borderRadius: 10, gap: 8,
  },
  cartText: { flex: 1, color: 'white', fontWeight: '600', fontSize: 14 },
  cartBtn: { backgroundColor: 'white', borderRadius: 6, paddingHorizontal: 14, paddingVertical: 6 },
  cartBtnText: { color: '#2563eb', fontWeight: '700', fontSize: 13 },
  clearCart: { color: '#bfdbfe', fontSize: 13, fontWeight: '600' },
  list: { padding: 16, gap: 12 },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  cardType: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  points: { fontSize: 18, fontWeight: '700', color: '#2563eb', marginTop: 4 },
  stock: { fontSize: 12, color: '#64748b', marginTop: 2 },
  cardActions: { alignItems: 'center', gap: 4 },
  qtyControl: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { fontSize: 16, fontWeight: '700', color: '#475569' },
  qtyValue: { fontSize: 16, fontWeight: '700', color: '#1e293b', minWidth: 20, textAlign: 'center' },
  button: { backgroundColor: '#2563eb', borderRadius: 8, paddingHorizontal: 20, paddingVertical: 6 },
  buttonText: { color: 'white', fontWeight: '600', fontSize: 13 },
  emptyText: { textAlign: 'center', color: '#94a3b8', marginTop: 60, fontSize: 15 },
  errorText: { color: '#dc2626', fontSize: 16, textAlign: 'center', paddingHorizontal: 20 },
});
