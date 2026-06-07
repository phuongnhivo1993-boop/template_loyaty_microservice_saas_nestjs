import { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { rewards, cartRedeem } from '../services/api';
import { useAuthStore } from '../services/authStore';
import type { Reward } from '../services/types';
import { LoadingState, ErrorState, EmptyState } from '../components';
import { useColors } from '../theme/useColors';

export default function RewardsScreen() {
  const navigation = useNavigation<any>();
  const colors = useColors();
  const [items, setItems] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const profile = useAuthStore((s) => s.profile);

  const load = () => {
    setLoading(true);
    setError('');
    rewards.list()
      .then((r) => setItems(Array.isArray(r.data) ? r.data : r.data?.data || []))
      .catch(() => setError('Failed to load rewards'))
      .finally(() => setLoading(false));
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const r = await rewards.list();
      setItems(Array.isArray(r.data) ? r.data : r.data?.data || []);
    } catch { setError('Failed to load rewards'); }
    setRefreshing(false);
  }, []);

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

  const categories = [...new Set(items.map(r => r.type))];
  const filteredItems = items.filter(r => {
    if (typeFilter && r.type !== typeFilter) return false;
    if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primaryDark]} />}>
      <View style={[styles.header, { backgroundColor: colors.text }]}>
        <Text style={styles.title}>Rewards Catalog</Text>
        <Text style={styles.subtitle}>Redeem your points</Text>
      </View>

      {cartItems.length > 0 && (
        <View style={[styles.cartBar, { backgroundColor: colors.primaryDark }]}>
          <Text style={styles.cartText}>{cartItems.length} items · {cartTotal.toLocaleString()} pts</Text>
          <TouchableOpacity style={styles.cartBtn} onPress={handleCartRedeem}>
            <Text style={[styles.cartBtnText, { color: colors.primaryDark }]}>Redeem All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCart({})}>
            <Text style={styles.clearCart}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.filterRow}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
          placeholder="Search rewards..."
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {categories.length > 1 && (
        <ScrollView horizontal style={styles.categoryRow} showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.catBtn, { backgroundColor: colors.border }, !typeFilter && { backgroundColor: colors.primaryDark }]}
            onPress={() => setTypeFilter('')}
          >
            <Text style={[styles.catText, { color: colors.textSecondary }, !typeFilter && styles.catTextActive]}>All</Text>
          </TouchableOpacity>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.catBtn, { backgroundColor: colors.border }, typeFilter === cat && { backgroundColor: colors.primaryDark }]}
              onPress={() => setTypeFilter(cat)}
            >
              <Text style={[styles.catText, { color: colors.textSecondary }, typeFilter === cat && styles.catTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <View style={styles.list}>
        {filteredItems.length > 0 ? filteredItems.map((r: Reward) => {
          const inCart = cart[r.id] || 0;
          return (
            <View key={r.id} style={[styles.card, { backgroundColor: colors.card }]}>
              <TouchableOpacity style={styles.cardBody} onPress={() => navigation.navigate('RewardDetail', { id: r.id })}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{r.name}</Text>
                <Text style={[styles.cardType, { color: colors.textSecondary }]}>{r.type}</Text>
                <Text style={[styles.points, { color: colors.primaryDark }]}>{r.pointsRequired?.toLocaleString()} pts</Text>
                <Text style={[styles.stock, { color: colors.textSecondary }]}>Stock: {r.quantity}</Text>
              </TouchableOpacity>
              <View style={styles.cardActions}>
                {inCart > 0 ? (
                  <View style={styles.qtyControl}>
                    <TouchableOpacity onPress={() => updateQty(r.id, -1)} style={[styles.qtyBtn, { backgroundColor: colors.border }]}><Text style={[styles.qtyBtnText, { color: colors.textSecondary }]}>-</Text></TouchableOpacity>
                    <Text style={[styles.qtyValue, { color: colors.text }]}>{inCart}</Text>
                    <TouchableOpacity onPress={() => updateQty(r.id, 1)} style={[styles.qtyBtn, { backgroundColor: colors.border }]}><Text style={[styles.qtyBtnText, { color: colors.textSecondary }]}>+</Text></TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={[styles.button, { backgroundColor: colors.primaryDark }]} onPress={() => toggleCart(r.id)}>
                    <Text style={styles.buttonText}>Add</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={[styles.button, { backgroundColor: colors.border, marginTop: 4 }]} onPress={() => handleSingleRedeem(r.id)}>
                  <Text style={[styles.buttonText, { color: colors.textSecondary }]}>Quick</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }) : (
          <EmptyState message="No rewards available" icon="🎁" />
        )}
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: '700', color: 'white' },
  subtitle: { color: '#94a3b8', marginTop: 4 },
  filterRow: { paddingHorizontal: 16, paddingTop: 12 },
  searchInput: { borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, borderWidth: 1 },
  categoryRow: { paddingHorizontal: 16, paddingVertical: 8 },
  catBtn: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, marginRight: 8 },
  catText: { fontSize: 13, fontWeight: '600' },
  catTextActive: { color: 'white' },
  cartBar: {
    flexDirection: 'row', alignItems: 'center',
    margin: 12, padding: 12, borderRadius: 10, gap: 8,
  },
  cartText: { flex: 1, color: 'white', fontWeight: '600', fontSize: 14 },
  cartBtn: { backgroundColor: 'white', borderRadius: 6, paddingHorizontal: 14, paddingVertical: 6 },
  cartBtnText: { fontWeight: '700', fontSize: 13 },
  clearCart: { color: '#bfdbfe', fontSize: 13, fontWeight: '600' },
  list: { padding: 16, gap: 12 },
  card: { borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardType: { fontSize: 12, marginTop: 2 },
  points: { fontSize: 18, fontWeight: '700', marginTop: 4 },
  stock: { fontSize: 12, marginTop: 2 },
  cardActions: { alignItems: 'center', gap: 4 },
  qtyControl: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { fontSize: 16, fontWeight: '700' },
  qtyValue: { fontSize: 16, fontWeight: '700', minWidth: 20, textAlign: 'center' },
  button: { borderRadius: 8, paddingHorizontal: 20, paddingVertical: 6 },
  buttonText: { color: 'white', fontWeight: '600', fontSize: 13 },
  emptyText: { textAlign: 'center', marginTop: 60, fontSize: 15 },
  errorText: { fontSize: 16, textAlign: 'center', paddingHorizontal: 20 },
});
