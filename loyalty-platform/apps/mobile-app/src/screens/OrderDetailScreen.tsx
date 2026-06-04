import { useState, useEffect } from 'react';
import {
  View, ScrollView, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { orders } from '../services/api';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import Header from '../components/Header';

const STATUS_FLOW: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
  REFUNDED: [],
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#F59E0B',
  CONFIRMED: '#3B82F6',
  PROCESSING: '#8B5CF6',
  SHIPPED: '#06B6D4',
  DELIVERED: '#10B981',
  CANCELLED: '#EF4444',
  REFUNDED: '#6B7280',
};

export default function OrderDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: { orderId: string } }, 'params'>>();
  const { orderId } = route.params || {};
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setError('Order ID not provided');
      setLoading(false);
      return;
    }
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const res = await orders.getById(orderId);
      setOrder(res.data?.data || res.data);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert('Cancel Order', 'Are you sure you want to cancel this order?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: async () => {
          setCancelling(true);
          try {
            await orders.cancel(orderId, { cancelReason: 'Cancelled by member' });
            Alert.alert('Cancelled', 'Order has been cancelled');
            loadOrder();
          } catch (err: any) {
            Alert.alert('Error', err?.response?.data?.message || 'Failed to cancel order');
          } finally {
            setCancelling(false);
          }
        },
      },
    ]);
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={() => { setLoading(true); loadOrder(); }} />;
  if (!order) return <ErrorState message="Order not found" />;

  const formatCurrency = (amount: number) => amount.toLocaleString('vi-VN') + ' VND';
  const canCancel = STATUS_FLOW[order.status]?.includes('CANCELLED');

  const timeline = (() => {
    const events: Array<{ status: string; date: Date }> = [];
    if (order.createdAt) events.push({ status: 'PENDING', date: new Date(order.createdAt) });
    if (order.deliveredAt) events.push({ status: 'DELIVERED', date: new Date(order.deliveredAt) });
    if (order.cancelledAt) events.push({ status: 'CANCELLED', date: new Date(order.cancelledAt) });
    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  })();

  return (
    <View style={styles.container}>
      <Header title={`Order #${order.orderCode}`} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statusSection}>
          <View style={[styles.statusBadgeLarge, { backgroundColor: STATUS_COLORS[order.status] || '#6B7280' }]}>
            <Text style={styles.statusBadgeText}>{order.status}</Text>
          </View>
          <Text style={styles.totalAmount}>{formatCurrency(order.total)}</Text>
          {order.pointsEarned > 0 && (
            <Text style={styles.pointsEarned}>+{order.pointsEarned} points earned</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {(order.items || []).map((item: any, idx: number) => (
            <View key={idx} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name || item.productName}</Text>
                <Text style={styles.itemQty}>x{item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>{formatCurrency(item.price * item.quantity)}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Shipping</Text>
            <Text style={styles.totalValue}>{order.shippingFee > 0 ? formatCurrency(order.shippingFee) : 'Free'}</Text>
          </View>
          {order.discount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Discount</Text>
              <Text style={[styles.totalValue, { color: '#EF4444' }]}>-{formatCurrency(order.discount)}</Text>
            </View>
          )}
          {order.pointsUsed > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Points Used</Text>
              <Text style={[styles.totalValue, { color: '#8B5CF6' }]}>-{order.pointsUsed} pts</Text>
            </View>
          )}
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>{formatCurrency(order.total)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timeline</Text>
          {timeline.map((event, idx) => (
            <View key={idx} style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: STATUS_COLORS[event.status] }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineStatus}>{event.status}</Text>
                <Text style={styles.timelineDate}>{event.date.toLocaleString('vi-VN')}</Text>
              </View>
            </View>
          ))}
        </View>

        {order.couponCode && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Coupon</Text>
            <Text style={styles.couponCode}>{order.couponCode}</Text>
          </View>
        )}

        {canCancel && (
          <TouchableOpacity
            style={[styles.cancelButton, cancelling && styles.cancelButtonDisabled]}
            onPress={handleCancel}
            disabled={cancelling}
          >
            {cancelling ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.cancelButtonText}>Cancel Order</Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContent: { paddingBottom: 32 },
  statusSection: { alignItems: 'center', padding: 24, backgroundColor: '#FFFFFF' },
  statusBadgeLarge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 12 },
  statusBadgeText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  totalAmount: { fontSize: 28, fontWeight: '800', color: '#059669' },
  pointsEarned: { fontSize: 14, color: '#3B82F6', marginTop: 4, fontWeight: '500' },
  section: { margin: 16, padding: 16, backgroundColor: '#FFFFFF', borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 12 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '500', color: '#111827' },
  itemQty: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  itemPrice: { fontSize: 14, fontWeight: '600', color: '#374151' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  totalLabel: { fontSize: 14, color: '#6B7280' },
  totalValue: { fontSize: 14, fontWeight: '600', color: '#374151' },
  grandTotal: { borderTopWidth: 1, borderTopColor: '#E5E7EB', marginTop: 8, paddingTop: 8 },
  grandTotalLabel: { fontSize: 16, fontWeight: '700', color: '#111827' },
  grandTotalValue: { fontSize: 16, fontWeight: '700', color: '#059669' },
  timelineItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, marginTop: 4, marginRight: 12 },
  timelineContent: { flex: 1 },
  timelineStatus: { fontSize: 14, fontWeight: '600', color: '#111827' },
  timelineDate: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  couponCode: { fontSize: 16, fontWeight: '600', color: '#8B5CF6', fontFamily: 'monospace' },
  cancelButton: { margin: 16, padding: 16, backgroundColor: '#EF4444', borderRadius: 12, alignItems: 'center' },
  cancelButtonDisabled: { opacity: 0.6 },
  cancelButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
