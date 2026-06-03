import { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, Linking, Platform } from 'react-native';
import { stores } from '../services/api';
import type { Store } from '../services/types';
import { LoadingState, ErrorState, EmptyState, Header } from '../components';

export default function StoresScreen() {
  const [items, setItems] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    stores.list()
      .then(r => setItems(Array.isArray(r.data) ? r.data : r.data?.data || []))
      .catch(() => setError('Failed to load stores'))
      .finally(() => setLoading(false));
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const r = await stores.list();
      setItems(Array.isArray(r.data) ? r.data : r.data?.data || []);
    } catch { setError('Failed to load stores'); }
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, []);

  const callStore = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const openMap = (store: Store) => {
    const { lat, lng, address } = store;
    if (lat && lng) {
      const url = Platform.OS === 'ios'
        ? `maps://app?daddr=${lat},${lng}`
        : `geo:${lat},${lng}?q=${encodeURIComponent(address)}`;
      Linking.openURL(url);
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <Header title="Stores" subtitle="Find our branches near you" />
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563eb']} />}
        data={items}
        keyExtractor={(item: Store) => item.id}
        renderItem={({ item }: { item: Store }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.storeName}>{item.name}</Text>
              <View style={styles.mapPlaceholder}>
                <Text style={styles.mapIcon}>📍</Text>
              </View>
            </View>
            <Text style={styles.address}>{item.address}</Text>
            {item.phone && (
              <TouchableOpacity style={styles.phoneRow} onPress={() => callStore(item.phone!)}>
                <Text style={styles.phoneIcon}>📞</Text>
                <Text style={styles.phone}>{item.phone}</Text>
              </TouchableOpacity>
            )}
            {item.hours && <Text style={styles.hours}>🕐 {item.hours}</Text>}
            <View style={styles.actions}>
              {item.lat && item.lng && (
                <TouchableOpacity style={styles.actionBtn} onPress={() => openMap(item)}>
                  <Text style={styles.actionText}>Navigate</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={<EmptyState message="No stores available" icon="🏪" />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 24 },
  card: {
    backgroundColor: 'white', borderRadius: 14, padding: 18, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  storeName: { fontSize: 17, fontWeight: '700', color: '#1e293b', flex: 1 },
  mapPlaceholder: { width: 48, height: 48, borderRadius: 10, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  mapIcon: { fontSize: 22 },
  address: { fontSize: 14, color: '#64748b', marginBottom: 6 },
  phoneRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  phoneIcon: { fontSize: 14, marginRight: 6 },
  phone: { fontSize: 14, color: '#2563eb', fontWeight: '600' },
  hours: { fontSize: 13, color: '#94a3b8', marginBottom: 8 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 8 },
  actionBtn: {
    paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#2563eb',
    borderRadius: 8,
  },
  actionText: { color: 'white', fontSize: 13, fontWeight: '600' },
});
