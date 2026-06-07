import { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { members } from '../services/api';
import type { Mission } from '../services/types';
import { LoadingState, ErrorState, EmptyState } from '../components';
import { useColors } from '../theme/useColors';

export default function MissionsScreen() {
  const colors = useColors();
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
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
      {item.description && <Text style={[styles.desc, { color: colors.textSecondary }]}>{item.description}</Text>}
      <View style={styles.footer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons name="navigate-outline" size={14} color={colors.primaryDark} />
          <Text style={[styles.reward, { color: colors.primaryDark }]}>{item.pointsReward} pts</Text>
        </View>
        {item.endDate && (
          <Text style={[styles.date, { color: colors.textSecondary }]}>Due: {new Date(item.endDate).toLocaleDateString()}</Text>
        )}
      </View>
    </View>
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Missions</Text>
      <FlatList data={missions} renderItem={renderItem} keyExtractor={(item: Mission) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState message="No missions available" icon="🎯" />}
      />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', paddingHorizontal: 20, marginBottom: 16 },
  list: { padding: 16 },
  card: { borderRadius: 14, padding: 18, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  name: { fontSize: 16, fontWeight: '700' },
  desc: { fontSize: 14, marginTop: 6 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  reward: { fontSize: 14, fontWeight: '700' },
  date: { fontSize: 12 },
  errorText: { fontSize: 16, textAlign: 'center', paddingHorizontal: 20 },
});
