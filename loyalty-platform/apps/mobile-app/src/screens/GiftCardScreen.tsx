import { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { giftCards } from '../services/api';
import { useAuthStore } from '../services/authStore';
import type { GiftCard } from '../services/types';
import { LoadingState, ErrorState, EmptyState, Badge } from '../components';
import { useColors } from '../theme/useColors';

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  ACTIVE: { color: '#16a34a', bg: '#f0fdf4' },
  EXPIRED: { color: '#dc2626', bg: '#fef2f2' },
  REDEEMED: { color: '#2563eb', bg: '#eff6ff' },
  DISABLED: { color: '#64748b', bg: '#f1f5f9' },
};

export default function GiftCardScreen() {
  const colors = useColors();
  const profile = useAuthStore((s) => s.profile);
  const [cards, setCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    if (!profile?.id) return;
    setLoading(true);
    setError('');
    giftCards.list(profile.id)
      .then((r) => setCards(Array.isArray(r.data) ? r.data : r.data?.data || []))
      .catch(() => setError('Failed to load gift cards'))
      .finally(() => setLoading(false));
  };

  const onRefresh = useCallback(() => {
    if (!profile?.id) return;
    setRefreshing(true);
    giftCards.list(profile.id)
      .then((r) => setCards(Array.isArray(r.data) ? r.data : r.data?.data || []))
      .catch(() => setError('Failed to refresh'))
      .finally(() => setRefreshing(false));
  }, [profile?.id]);

  useEffect(() => { load(); }, [profile?.id]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primaryDark]} />}
      >
        <View style={[styles.header, { backgroundColor: colors.primaryDark }]}>
          <Text style={styles.headerTitle}>Gift Cards</Text>
          <Text style={styles.headerSubtitle}>{cards.length} card{cards.length !== 1 ? 's' : ''}</Text>
        </View>

        <View style={styles.list}>
          {cards.length > 0 ? cards.map((card) => {
            const sc = STATUS_COLORS[card.status] || STATUS_COLORS.DISABLED;
            return (
              <View key={card.id} style={[styles.card, { backgroundColor: colors.card }]}>
                <View style={[styles.cardTop, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.cardCode, { color: colors.text }]}>{card.code}</Text>
                  <Badge label={card.status} color={sc.color} bg={sc.bg} />
                </View>
                <View style={styles.cardBody}>
                  <View style={styles.cardRow}>
                    <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Type</Text>
                    <Text style={[styles.cardValue, { color: colors.text }]}>{card.type}</Text>
                  </View>
                  <View style={styles.cardRow}>
                    <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Balance</Text>
                    <Text style={[styles.cardValue, { color: colors.text }]}>{card.balance?.toLocaleString()} {card.currency}</Text>
                  </View>
                  <View style={styles.cardRow}>
                    <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Initial Value</Text>
                    <Text style={[styles.cardValue, { color: colors.text }]}>{card.initialValue?.toLocaleString()} {card.currency}</Text>
                  </View>
                  {card.expiresAt && (
                    <View style={styles.cardRow}>
                      <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Expires</Text>
                      <Text style={[styles.cardValue, { color: colors.text }]}>{new Date(card.expiresAt).toLocaleDateString('vi-VN')}</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          }) : (
            <EmptyState message="No gift cards yet" icon="🎴" />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: 'white' },
  headerSubtitle: { fontSize: 14, color: '#bfdbfe', marginTop: 4 },
  list: { padding: 16, gap: 16 },
  card: { borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingBottom: 12, borderBottomWidth: 1 },
  cardCode: { fontSize: 16, fontWeight: '700', fontFamily: 'monospace' },
  cardBody: { padding: 16, gap: 12 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { fontSize: 14 },
  cardValue: { fontSize: 14, fontWeight: '600' },
});
