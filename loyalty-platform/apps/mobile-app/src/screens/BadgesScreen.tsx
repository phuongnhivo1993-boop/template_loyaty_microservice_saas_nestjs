import { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet } from 'react-native';
import { members } from '../services/api';
import type { Badge } from '../services/types';
import { LoadingState, ErrorState, EmptyState } from '../components';
import { useColors } from '../theme/useColors';

export default function BadgesScreen() {
  const colors = useColors();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    members.getBadges()
      .then(res => setBadges(Array.isArray(res.data) ? res.data : res.data.data || []))
      .catch(() => setError('Failed to load badges'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Badges</Text>
      <FlatList
        data={badges}
        keyExtractor={(item: Badge) => item.id}
        contentContainerStyle={badges.length === 0 ? styles.emptyContainer : styles.list}
        ListEmptyComponent={<EmptyState message="No badges earned yet" icon="🏅" />}
        renderItem={({ item }: { item: Badge }) => (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={styles.badgeIcon}>{item.iconUrl || '🏅'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.badgeName, { color: colors.text }]}>{item.name}</Text>
              {item.description && <Text style={[styles.badgeDesc, { color: colors.textSecondary }]}>{item.description}</Text>}
            </View>
          </View>
        )}
      />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { paddingBottom: 20 },
  card: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 12,
    padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  badgeIcon: { fontSize: 32, marginRight: 12 },
  badgeName: { fontSize: 16, fontWeight: '600' },
  badgeDesc: { fontSize: 13, marginTop: 4 },
});
