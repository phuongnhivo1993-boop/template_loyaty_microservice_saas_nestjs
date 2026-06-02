import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../services/api';

export default function MissionsScreen() {
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/missions')
      .then(r => setMissions(Array.isArray(r.data) ? r.data : r.data?.data || []))
      .catch(() => setError('Failed to load missions'))
      .finally(() => setLoading(false));
  }, []);

  const renderItem = ({ item }: { item: any }) => (
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

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#2563eb" /></View>;
  if (error) return <View style={styles.center}><Text style={styles.errorText}>{error}</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Missions</Text>
      <FlatList data={missions} renderItem={renderItem} keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No missions available</Text>}
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
  empty: { textAlign: 'center', color: '#94a3b8', marginTop: 60, fontSize: 15 },
  errorText: { color: '#dc2626', fontSize: 16, textAlign: 'center', paddingHorizontal: 20 },
});
