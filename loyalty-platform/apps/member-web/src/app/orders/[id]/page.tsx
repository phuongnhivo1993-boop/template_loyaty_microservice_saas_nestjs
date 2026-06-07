'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MemberLayout from '../../member-layout';
import { api, cancelOrder } from '@/lib/api';
import { CardSkeleton } from '@/components/LoadingSkeleton';

const statusColors: Record<string, string> = {
  PENDING: '#f59e0b', CONFIRMED: '#3b82f6', PROCESSING: '#8b5cf6',
  SHIPPED: '#06b6d4', DELIVERED: '#10b981', CANCELLED: '#ef4444', REFUNDED: '#f97316',
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = () => {
    if (!id) return;
    setError('');
    api.get(`/orders/${id}`)
      .then(setOrder)
      .catch((e) => setError(e?.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    loadData();
  }, [id]);

  if (loading) {
    return <MemberLayout><CardSkeleton /></MemberLayout>;
  }

  if (!order) {
    return <MemberLayout><div className="empty-state"><div className="empty-icon">❌</div><div className="empty-text">Order not found</div></div></MemberLayout>;
  }

  return (
    <MemberLayout>
      {error && (
        <div className="card" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
          ⚠️ {error}
          <button className="btn btn-sm btn-outline" style={{ marginLeft: '12px' }} onClick={loadData}>Retry</button>
        </div>
      )}
      <div className="header">
        <button className="btn btn-outline btn-sm" onClick={() => router.back()} style={{ width: 'auto' }}>← Back</button>
      </div>

      <div className="card">
        <div className="order-header">
          <div className="order-code" style={{ fontSize: '16px' }}>{order.orderCode}</div>
          <span className="badge" style={{ background: `${statusColors[order.status] || '#94a3b8'}20`, color: statusColors[order.status] || '#64748b' }}>{order.status}</span>
        </div>
        <div className="order-total" style={{ marginTop: '8px', fontSize: '24px' }}>{order.total?.toLocaleString()} VND</div>
      </div>

      <div className="card">
        <div style={{ fontWeight: 600, marginBottom: '12px' }}>Items</div>
        {order.items?.map((item: any) => (
          <div key={item.id} className="tx-item">
            <div className="tx-left">
              <div className="tx-reason">{item.name}</div>
              <div className="tx-date">{item.quantity} × {item.price?.toLocaleString()} VND</div>
            </div>
            <div className="tx-amount">{item.subtotal?.toLocaleString()} VND</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div style={{ fontWeight: 600, marginBottom: '8px' }}>Summary</div>
        {[
          { label: 'Subtotal', value: order.subtotal },
          { label: 'Discount', value: -order.discount },
          { label: 'Shipping', value: order.shippingFee },
          { label: 'Tax', value: order.tax },
        ].map((row, i) => (
          <div key={i} className="tx-item" style={{ padding: '8px 0' }}>
            <div className="tx-reason">{row.label}</div>
            <div className="tx-amount">{row.value?.toLocaleString()} VND</div>
          </div>
        ))}
        <div className="tx-item" style={{ borderTop: '2px solid var(--border)', paddingTop: '12px', marginTop: '4px' }}>
          <div className="tx-reason" style={{ fontWeight: 700 }}>Total</div>
          <div className="tx-amount" style={{ fontWeight: 800 }}>{order.total?.toLocaleString()} VND</div>
        </div>
      </div>

      {order.couponCode && (
        <div className="card" style={{ background: '#f0fdf4' }}>
          🏷️ Coupon: <strong>{order.couponCode}</strong> • 🪙 Points earned: <strong>{order.pointsEarned}</strong>
        </div>
      )}

      <div className="card" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
        Created: {new Date(order.createdAt).toLocaleString('vi-VN')}
      </div>

      {['PENDING', 'CONFIRMED', 'PROCESSING'].includes(order.status) && (
        <div className="card" style={{ textAlign: 'center' }}>
          <button
            className="btn"
            style={{ background: 'var(--error)', color: 'white' }}
            onClick={() => {
              const reason = prompt('Reason for cancellation (optional):');
              if (reason === null) return;
              cancelOrder(order.id, reason || undefined)
                .then(() => { alert('Order cancelled'); loadData(); })
                .catch((e: any) => alert(e?.message || 'Failed to cancel order'));
            }}
          >
            Cancel Order
          </button>
        </div>
      )}
    </MemberLayout>
  );
}
