import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { members } from '../services/api';

export default function BadgesScreen() {
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    members.getBadges()
      .then(res => setBadges(Array.isArray(res.data) ? res.data : res.data.data || []))
      .catch(() => setError('Failed to load badges'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#2563eb" /></View>;
  if (error) return <View style={styles.center}><Text style={styles.error}>{error}</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Badges</Text>
      <FlatList
        data={badges}
        keyExtractor={item => item.id}
        contentContainerStyle={badges.length === 0 ? styles.emptyContainer : undefined}
        ListEmptyComponent={<Text style={styles.empty}>No badges earned yet</Text>}
        renderItem={({ item }) => (
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  title: { fontSize: 24, fontWeight: '700', color: '#1e293b', marginBottom: 16 },
  error: { color: '#dc2626', fontSize: 14 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { color: '#94a3b8', fontSize: 14 },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12,
    padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  badgeIcon: { fontSize: 32, marginRight: 12 },
  badgeName: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  badgeDesc: { fontSize: 13, color: '#64748b', marginTop: 4 },
});
