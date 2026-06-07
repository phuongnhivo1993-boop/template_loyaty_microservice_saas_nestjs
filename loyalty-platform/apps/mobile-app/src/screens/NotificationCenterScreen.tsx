import { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { notifications } from '../services/api';
import { LoadingState, ErrorState, EmptyState } from '../components';
import { useColors } from '../theme/useColors';

interface NotificationItem {
  id: string;
  title?: string;
  message?: string;
  type?: string;
  read?: boolean;
  createdAt: string;
}

export default function NotificationCenterScreen() {
  const navigation = useNavigation<any>();
  const colors = useColors();
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

  const handleNotificationPress = async (item: NotificationItem) => {
    if (!item.read) {
      try {
        await notifications.markAsRead(item.id);
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, read: true } : i));
      } catch {}
    }
    const type = (item.type || '').toLowerCase();
    if (type.includes('order')) {
      navigation.navigate('Orders');
    } else if (type.includes('reward')) {
      navigation.navigate('Rewards');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notifications.markAllAsRead();
      setItems(prev => prev.map(i => ({ ...i, read: true })));
    } catch {
      Alert.alert('Error', 'Failed to mark all as read');
    }
  };

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }, !item.read && styles.unread]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.header}>
        <Text style={[styles.type, { color: colors.primaryDark }]}>{item.type || 'Info'}</Text>
        <Text style={[styles.date, { color: colors.textSecondary }]}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
      {item.title && <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>}
      {item.message && <Text style={[styles.message, { color: colors.textSecondary }]}>{item.message}</Text>}
    </TouchableOpacity>
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.screenTitleRow}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>Notifications</Text>
        <TouchableOpacity onPress={handleMarkAllAsRead}>
          <Text style={[styles.markAllBtn, { color: colors.primaryDark }]}>Mark all as read</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item: NotificationItem) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState message="No notifications yet" icon="🔔" />}
      />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  screenTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  screenTitle: { fontSize: 24, fontWeight: '800' },
  markAllBtn: { fontSize: 14, fontWeight: '600' },
  list: { padding: 16 },
  card: { borderRadius: 14, padding: 16, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  unread: { borderLeftWidth: 3, borderLeftColor: '#2563eb' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  type: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  date: { fontSize: 12 },
  title: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  message: { fontSize: 14, lineHeight: 20 },
});
