import { useState, useEffect, useCallback } from 'react';
import {
  View, FlatList, TouchableOpacity, Text, StyleSheet, RefreshControl, ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { orders } from '../services/api';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import Header from '../components/Header';

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#F59E0B',
  CONFIRMED: '#3B82F6',
  PROCESSING: '#8B5CF6',
  SHIPPED: '#06B6D4',
  DELIVERED: '#10B981',
  CANCELLED: '#EF4444',
  REFUNDED: '#6B7280',
};

export default function OrdersScreen() {
  const navigation = useNavigation<any>();
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [loadingMore, setLoadingMore] = useState(false);

  const loadOrders = useCallback(async (pageNum = 1, append = false) => {
    try {
      const res = await orders.list({ page: pageNum, limit: 20, status: statusFilter });
      const { data, total, totalPages: tp } = res.data;
      if (append) {
        setOrdersList((prev) => [...prev, ...data]);
      } else {
        setOrdersList(data);
      }
      setTotalPages(tp);
      setPage(pageNum);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    setLoading(true);
    loadOrders(1);
  }, [loadOrders]);

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders(1);
  };

  const loadMore = () => {
    if (page < totalPages && !loadingMore) {
      setLoadingMore(true);
      loadOrders(page + 1, true);
    }
  };

  const filters = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={() => { setLoading(true); loadOrders(1); }} />;

  const formatCurrency = (amount: number) =>
    amount.toLocaleString('vi-VN') + ' VND';

  return (
    <View style={styles.container}>
      <Header title="My Orders" onBack={() => navigation.goBack()} />
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, !statusFilter && styles.filterChipActive]}
          onPress={() => setStatusFilter(undefined)}
        >
          <Text style={[styles.filterText, !statusFilter && styles.filterTextActive]}>All</Text>
        </TouchableOpacity>
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, statusFilter === f && styles.filterChipActive]}
            onPress={() => setStatusFilter(f)}
          >
            <Text style={[styles.filterText, statusFilter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={ordersList}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={<EmptyState message="No orders found" icon="📋" />}
        ListFooterComponent={loadingMore ? <ActivityIndicator style={{ padding: 16 }} /> : null}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.orderCard}
            onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
          >
            <View style={styles.orderHeader}>
              <Text style={styles.orderCode}>#{item.orderCode}</Text>
              <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] || '#6B7280' }]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.orderTotal}>{formatCurrency(item.total)}</Text>
            <View style={styles.orderMeta}>
              <Text style={styles.metaText}>{item.items?.length || 0} items</Text>
              <Text style={styles.metaText}>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</Text>
            </View>
            {item.pointsEarned > 0 && (
              <Text style={styles.pointsText}>+{item.pointsEarned} points earned</Text>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 8, gap: 8, flexWrap: 'wrap' },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#F3F4F6' },
  filterChipActive: { backgroundColor: '#3B82F6' },
  filterText: { fontSize: 12, color: '#6B7280' },
  filterTextActive: { color: '#FFFFFF', fontWeight: '600' },
  orderCard: { marginHorizontal: 16, marginVertical: 4, padding: 16, backgroundColor: '#FFFFFF', borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  orderCode: { fontSize: 16, fontWeight: '700', color: '#111827' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '600', color: '#FFFFFF' },
  orderTotal: { fontSize: 20, fontWeight: '700', color: '#059669', marginBottom: 4 },
  orderMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  metaText: { fontSize: 13, color: '#6B7280' },
  pointsText: { fontSize: 12, color: '#3B82F6', marginTop: 4, fontWeight: '500' },
});
