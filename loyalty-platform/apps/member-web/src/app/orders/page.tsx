'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import MemberLayout from '../member-layout';
import { getMyOrders } from '@/lib/api';
import { CardSkeleton } from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';

const PAGE_SIZE = 10;

const statusFilters = ['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as const;
type StatusFilter = (typeof statusFilters)[number];

const statusColors: Record<string, string> = {
  PENDING: '#f59e0b', CONFIRMED: '#3b82f6', PROCESSING: '#8b5cf6',
  SHIPPED: '#06b6d4', DELIVERED: '#10b981', CANCELLED: '#ef4444', REFUNDED: '#f97316',
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const loadData = () => {
    setError('');
    getMyOrders({ limit: 50 })
      .then((res: any) => setOrders(res?.data || res || []))
      .catch((e) => setError(e?.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    loadData();
  }, []);

  const searched = useMemo(() => {
    if (!search.trim()) return orders;
    const q = search.toLowerCase();
    return orders.filter(o =>
      (o.orderCode || '').toLowerCase().includes(q) ||
      (o.couponCode || '').toLowerCase().includes(q) ||
      (o.status || '').toLowerCase().includes(q)
    );
  }, [orders, search]);

  const filtered = useMemo(() => {
    if (statusFilter === 'All') return searched;
    return searched.filter(o => o.status === statusFilter.toUpperCase());
  }, [searched, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleStatusFilter = (f: StatusFilter) => {
    setStatusFilter(f);
    setPage(1);
  };

  if (loading) {
    return <MemberLayout><CardSkeleton /></MemberLayout>;
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
        <div>
          <div className="header-title">🛒 My Orders</div>
          <div className="header-subtitle">{filtered.length} order{filtered.length !== 1 ? 's' : ''}</div>
        </div>
      </div>

      <input
        type="text"
        placeholder="🔍 Search orders..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '12px' }}
      />

      <div className="tab-bar" style={{ overflowX: 'auto', flexWrap: 'wrap' }}>
        {statusFilters.map(f => (
          <button key={f} className={`tab ${statusFilter === f ? 'active' : ''}`} onClick={() => handleStatusFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="📦" title={search ? 'No orders match your search' : 'No orders yet'} action={{ label: 'Start shopping', onClick: () => router.push('/orders/create') }} />
      ) : (
        <>
          {paginated.map((o: any) => (
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
          ))}

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
              <button
                className="btn btn-sm btn-outline"
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                style={{ width: 'auto', opacity: page <= 1 ? 0.5 : 1 }}
              >
                Previous
              </button>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                {page} / {totalPages}
              </span>
              <button
                className="btn btn-sm btn-outline"
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                style={{ width: 'auto', opacity: page >= totalPages ? 0.5 : 1 }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </MemberLayout>
  );
}
