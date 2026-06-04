import { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { products, orders } from '../services/api';
import { LoadingState, ErrorState, EmptyState } from '../components';
import type { Product } from '../services/types';

interface CartItem {
  product: Product;
  quantity: number;
}

export default function CreateOrderScreen() {
  const navigation = useNavigation<any>();
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadProducts = () => {
    setLoading(true);
    setError('');
    products.list({ search, page: 1, limit: 50 })
      .then(r => setProductList(Array.isArray(r.data) ? r.data : r.data?.data || []))
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadProducts(); }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.product.id !== productId) return i;
      const newQty = i.quantity + delta;
      return newQty <= 0 ? null : { ...i, quantity: newQty };
    }).filter(Boolean) as CartItem[]);
  };

  const total = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const handleSubmit = async () => {
    if (cart.length === 0) return;
    setSubmitting(true);
    try {
      await orders.create({
        items: cart.map(i => ({ productId: i.product.id, quantity: i.quantity })),
      });
      navigation.goBack();
    } catch {
      setError('Failed to create order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Order</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={loadProducts}
        />
      </View>

      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={loadProducts} /> : (
            <ScrollView style={{ padding: 12 }}>
              {productList.length === 0 ? (
                <EmptyState message="No products found" icon="📦" />
              ) : (
                productList.map(p => (
                  <TouchableOpacity key={p.id} style={styles.productItem} onPress={() => addToCart(p)}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.productName}>{p.name}</Text>
                      <Text style={styles.productPrice}>{p.price.toLocaleString()}đ</Text>
                      <Text style={styles.productStock}>Stock: {p.stock}</Text>
                    </View>
                    <Text style={styles.addBtn}>+</Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          )}
        </View>

        <View style={styles.cartPanel}>
          <Text style={styles.cartTitle}>Cart ({cart.length})</Text>
          <ScrollView style={{ flex: 1 }}>
            {cart.map(item => (
              <View key={item.product.id} style={styles.cartItem}>
                <Text style={styles.cartItemName} numberOfLines={1}>{item.product.name}</Text>
                <View style={styles.qtyRow}>
                  <TouchableOpacity onPress={() => updateQuantity(item.product.id, -1)}>
                    <Text style={styles.qtyBtn}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyValue}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => updateQuantity(item.product.id, 1)}>
                    <Text style={styles.qtyBtn}>+</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.cartItemPrice}>{(item.product.price * item.quantity).toLocaleString()}đ</Text>
                <TouchableOpacity onPress={() => removeFromCart(item.product.id)}>
                  <Text style={styles.removeBtn}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{total.toLocaleString()}đ</Text>
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, (cart.length === 0 || submitting) && { opacity: 0.5 }]}
            onPress={handleSubmit}
            disabled={cart.length === 0 || submitting}
          >
            <Text style={styles.submitText}>{submitting ? 'Creating...' : 'Confirm Order'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 12, backgroundColor: '#1e293b' },
  backBtn: { color: '#fff', fontSize: 16 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  searchRow: { padding: 12, backgroundColor: '#fff' },
  searchInput: { backgroundColor: '#f1f5f9', borderRadius: 10, padding: 12, fontSize: 15 },
  productItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 8, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  productName: { fontSize: 15, fontWeight: '600', color: '#1e293b' },
  productPrice: { fontSize: 14, color: '#2563eb', fontWeight: '700', marginTop: 2 },
  productStock: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  addBtn: { fontSize: 24, color: '#2563eb', fontWeight: '700', paddingLeft: 12 },
  cartPanel: { width: '40%', backgroundColor: '#fff', borderLeftWidth: 1, borderLeftColor: '#e2e8f0', padding: 12 },
  cartTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 8 },
  cartItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', gap: 6 },
  cartItemName: { flex: 1, fontSize: 13, color: '#1e293b' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  qtyBtn: { fontSize: 18, fontWeight: '700', color: '#2563eb', width: 24, textAlign: 'center' },
  qtyValue: { fontSize: 14, fontWeight: '600', minWidth: 20, textAlign: 'center' },
  cartItemPrice: { fontSize: 12, color: '#64748b', minWidth: 60, textAlign: 'right' },
  removeBtn: { fontSize: 14, color: '#ef4444', paddingLeft: 4 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#e2e8f0', marginTop: 4 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  totalValue: { fontSize: 16, fontWeight: '800', color: '#2563eb' },
  submitBtn: { backgroundColor: '#2563eb', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 8 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
