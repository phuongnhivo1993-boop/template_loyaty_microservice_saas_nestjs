'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import MemberLayout from '@/app/member-layout';
import { getProducts, createOrder } from '@/lib/api';
import { CardSkeleton } from '@/components/LoadingSkeleton';

interface CartItem {
  product: any;
  quantity: number;
}

export default function CreateOrderPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadData = () => {
    setError('');
    getProducts({ limit: 50 })
      .then((res: any) => setProducts(res?.data || res || []))
      .catch((e) => setError(e?.message || 'Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    loadData();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(p =>
      (p.name || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    );
  }, [products, search]);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(c => c.product.id === product.id);
      if (existing) {
        return prev.map(c => c.product.id === product.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      const updated = prev.map(c => {
        if (c.product.id !== productId) return c;
        const newQty = c.quantity + delta;
        return newQty <= 0 ? null : { ...c, quantity: newQty };
      }).filter(Boolean) as CartItem[];
      return updated;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(c => c.product.id !== productId));
  };

  const total = useMemo(() => {
    return cart.reduce((sum, c) => sum + (c.product.price || 0) * c.quantity, 0);
  }, [cart]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (cart.length === 0) e.cart = 'Your cart is empty';
    if (note.length > 500) e.note = 'Note must be under 500 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setMessage('');
    try {
      const res = await createOrder({
        items: cart.map(c => ({ productId: c.product.id, quantity: c.quantity })),
        note: note || undefined,
      });
      setMessage('Order created successfully!');
      setCart([]);
      setNote('');
      setTimeout(() => router.push('/orders'), 1500);
    } catch (err: any) {
      setMessage(err.message || 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <MemberLayout><CardSkeleton /></MemberLayout>;
  }

  return (
    <MemberLayout>
      {error && (
        <div className="card" style={{ background: 'var(--error-bg, #fef2f2)', color: 'var(--error, #dc2626)', border: '1px solid var(--error-border, #fecaca)', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
          ⚠️ {error}
          <button className="btn btn-sm btn-outline" style={{ marginLeft: '12px' }} onClick={loadData}>Retry</button>
        </div>
      )}
      <div className="header">
        <div>
          <div className="header-title">🛒 Create Order</div>
          <div className="header-subtitle">{cart.length} item{cart.length !== 1 ? 's' : ''} in cart</div>
        </div>
      </div>

      <input
        type="text"
        placeholder="🔍 Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '12px' }}
      />

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <div className="empty-text">{search ? 'No products match your search' : 'No products available'}</div>
        </div>
      ) : (
        <div className="card" style={{ padding: '0 20px', marginBottom: '12px' }}>
          {filtered.map(p => (
            <div key={p.id} className="tx-item">
              <div className="tx-left">
                <div className="tx-reason">{p.name}</div>
                <div className="tx-date">{(p.price || 0).toLocaleString()} VND</div>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => addToCart(p)}>
                + Add
              </button>
            </div>
          ))}
        </div>
      )}

      {cart.length > 0 && (
        <div className="card" style={{ marginBottom: '12px' }}>
          <div style={{ fontWeight: 600, marginBottom: '12px' }}>🛒 Cart Summary</div>
          {cart.map(c => (
            <div key={c.product.id} className="tx-item" style={{ borderBottom: '1px solid var(--border, #e2e8f0)', paddingBottom: '8px', marginBottom: '8px' }}>
              <div className="tx-left">
                <div className="tx-reason">{c.product.name}</div>
                <div className="tx-date">{(c.product.price * c.quantity).toLocaleString()} VND</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button className="btn btn-sm btn-outline" onClick={() => updateQuantity(c.product.id, -1)}>-</button>
                <span style={{ fontWeight: 600, minWidth: '24px', textAlign: 'center' }}>{c.quantity}</span>
                <button className="btn btn-sm btn-outline" onClick={() => updateQuantity(c.product.id, 1)}>+</button>
                <button className="btn btn-sm" style={{ color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => removeFromCart(c.product.id)}>✕</button>
              </div>
            </div>
          ))}

          <div style={{ fontWeight: 700, fontSize: '18px', textAlign: 'right', margin: '12px 0' }}>
            Total: {total.toLocaleString()} VND
          </div>

          <input
            type="text"
            placeholder="Order note (optional, max 500 characters)"
            value={note}
            onChange={e => { setNote(e.target.value); if (errors.note) setErrors(prev => ({ ...prev, note: '' })); }}
            style={{ marginBottom: '12px', borderColor: errors.note ? 'var(--error)' : undefined }}
          />
          {errors.note && <div style={{ color: 'var(--error)', fontSize: '12px', marginTop: '4px', marginBottom: '8px' }}>{errors.note}</div>}

          {errors.cart && (
            <div style={{ fontSize: '14px', color: 'var(--error)', marginBottom: '8px', padding: '8px', background: 'var(--error-bg, #fef2f2)', borderRadius: '6px' }}>
              {errors.cart}
            </div>
          )}
          {message && (
            <div style={{ fontSize: '14px', color: message.includes('successfully') ? 'var(--success)' : 'var(--error)', marginBottom: '8px', padding: '8px', background: message.includes('successfully') ? 'var(--success-bg, #dcfce7)' : 'var(--error-bg, #fef2f2)', borderRadius: '6px' }}>
              {message}
            </div>
          )}

          <button
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={handleSubmit}
            disabled={submitting || cart.length === 0}
          >
            {submitting ? 'Creating Order...' : `Place Order`}
          </button>
        </div>
      )}
    </MemberLayout>
  );
}
