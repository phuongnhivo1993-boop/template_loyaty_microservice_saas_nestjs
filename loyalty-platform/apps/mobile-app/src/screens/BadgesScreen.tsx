import { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet } from 'react-native';
import { members } from '../services/api';
import type { Badge } from '../services/types';
import { LoadingState, ErrorState, EmptyState } from '../components';

export default function BadgesScreen() {
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
    <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.container}>
      <Text style={styles.title}>Badges</Text>
      <FlatList
        data={badges}
        keyExtractor={(item: Badge) => item.id}
        contentContainerStyle={badges.length === 0 ? styles.emptyContainer : styles.list}
        ListEmptyComponent={<EmptyState message="No badges earned yet" icon="🏅" />}
        renderItem={({ item }: { item: Badge }) => (
          <View style={styles.card}>
            <Text style={styles.badgeIcon}>{item.iconUrl || '🏅'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.badgeName}>{item.name}</Text>
              {item.description && <Text style={styles.badgeDesc}>{item.description}</Text>}
            </View>
          </View>
        )}
      />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  title: { fontSize: 24, fontWeight: '700', color: '#1e293b', marginBottom: 16 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { paddingBottom: 20 },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12,
    padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  badgeIcon: { fontSize: 32, marginRight: 12 },
  badgeName: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  badgeDesc: { fontSize: 13, color: '#64748b', marginTop: 4 },
});
