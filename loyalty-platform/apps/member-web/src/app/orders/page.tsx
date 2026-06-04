'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MemberLayout from '../member-layout';
import { getMyOrders } from '@/lib/api';

const statusColors: Record<string, string> = {
  PENDING: '#f59e0b', CONFIRMED: '#3b82f6', PROCESSING: '#8b5cf6',
  SHIPPED: '#06b6d4', DELIVERED: '#10b981', CANCELLED: '#ef4444', REFUNDED: '#f97316',
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    getMyOrders({ limit: 50 })
      .then((res: any) => setOrders(res?.data || res || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <MemberLayout><div className="card" style={{ textAlign: 'center', padding: '60px' }}>Loading...</div></MemberLayout>;
  }

  return (
    <MemberLayout>
      <div className="header">
        <div>
          <div className="header-title">🛒 My Orders</div>
          <div className="header-subtitle">{orders.length} order{orders.length !== 1 ? 's' : ''}</div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <div className="empty-text">No orders yet</div>
        </div>
      ) : (
        orders.map((o: any) => (
          <div key={o.id} className="card order-card" onClick={() => router.push(`/orders/${o.id}`)}>
            <div className="order-header">
              <div className="order-code">{o.orderCode}</div>
              <div className="order-total">{o.total?.toLocaleString()} VND</div>
            </div>
            <span className="badge" style={{ background: `${statusColors[o.status] || '#94a3b8'}20`, color: statusColors[o.status] || '#64748b' }}>{o.status}</span>
            <div className="order-meta" style={{ marginTop: '8px' }}>
              <span>{o.items?.length || 0} item{(o.items?.length || 0) !== 1 ? 's' : ''}</span>
              <span>🪙 +{o.pointsEarned || 0} pts</span>
              <span>{new Date(o.createdAt).toLocaleDateString('vi-VN')}</span>
            </div>
            {o.couponCode && <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--primary)' }}>🏷️ {o.couponCode}</div>}
          </div>
        ))
      )}
    </MemberLayout>
  );
}
