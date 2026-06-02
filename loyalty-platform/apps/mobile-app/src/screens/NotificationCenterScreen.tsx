import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { notifications } from '../services/api';
import { LoadingState, ErrorState, EmptyState } from '../components';

interface NotificationItem {
  id: string;
  title?: string;
  message?: string;
  type?: string;
  read?: boolean;
  createdAt: string;
}

export default function NotificationCenterScreen() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    notifications.list()
      .then(r => setItems(Array.isArray(r.data) ? r.data : r.data?.data || []))
      .catch(() => setError('Failed to load notifications'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity style={[styles.card, !item.read && styles.unread]}>
      <View style={styles.header}>
        <Text style={styles.type}>{item.type || 'Info'}</Text>
        <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
      {item.title && <Text style={styles.title}>{item.title}</Text>}
      {item.message && <Text style={styles.message}>{item.message}</Text>}
    </TouchableOpacity>
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Notifications</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item: NotificationItem) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState message="No notifications yet" icon="🔔" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingTop: 60 },
  screenTitle: { fontSize: 24, fontWeight: '800', color: '#1e293b', paddingHorizontal: 20, marginBottom: 16 },
  list: { padding: 16 },
  card: { backgroundColor: 'white', borderRadius: 14, padding: 16, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  unread: { borderLeftWidth: 3, borderLeftColor: '#2563eb' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  type: { fontSize: 12, fontWeight: '600', color: '#2563eb', textTransform: 'uppercase' },
  date: { fontSize: 12, color: '#94a3b8' },
  title: { fontSize: 15, fontWeight: '600', color: '#1e293b', marginBottom: 4 },
  message: { fontSize: 14, color: '#64748b', lineHeight: 20 },
});
