import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { members } from '../services/api';
import type { Mission } from '../services/types';
import { LoadingState, ErrorState, EmptyState } from '../components';

export default function MissionsScreen() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    members.getMissions()
      .then(r => setMissions(Array.isArray(r.data) ? r.data : r.data?.data || []))
      .catch(() => setError('Failed to load missions'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const renderItem = ({ item }: { item: Mission }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      {item.description && <Text style={styles.desc}>{item.description}</Text>}
      <View style={styles.footer}>
        <Text style={styles.reward}>🎯 {item.pointsReward} pts</Text>
        {item.endDate && (
          <Text style={styles.date}>Due: {new Date(item.endDate).toLocaleDateString()}</Text>
        )}
      </View>
    </View>
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Missions</Text>
      <FlatList data={missions} renderItem={renderItem} keyExtractor={(item: Mission) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState message="No missions available" icon="🎯" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingTop: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: '#1e293b', paddingHorizontal: 20, marginBottom: 16 },
  list: { padding: 16 },
  card: { backgroundColor: 'white', borderRadius: 14, padding: 18, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  name: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  desc: { fontSize: 14, color: '#64748b', marginTop: 6 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  reward: { fontSize: 14, fontWeight: '700', color: '#2563eb' },
  date: { fontSize: 12, color: '#94a3b8' },
  errorText: { color: '#dc2626', fontSize: 16, textAlign: 'center', paddingHorizontal: 20 },
});
