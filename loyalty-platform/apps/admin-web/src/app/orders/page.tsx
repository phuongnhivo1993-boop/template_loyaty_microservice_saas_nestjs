'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import Pagination from '@/components/Pagination';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import { getOrders } from '@/lib/api';

const statusColors: Record<string, string> = {
  PENDING: '#f59e0b', CONFIRMED: '#3b82f6', PROCESSING: '#8b5cf6',
  SHIPPED: '#06b6d4', DELIVERED: '#10b981', CANCELLED: '#ef4444', REFUNDED: '#f97316',
};

export default function OrdersPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const load = async () => {
    setLoading(true);
    try {
      const result = await getOrders({ page, limit, search: search || undefined, status: statusFilter !== 'ALL' ? statusFilter : undefined });
      setOrders(result.data);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    load();
  }, [search, page, statusFilter]);

  const exportCsv = async () => {
    const result = await getOrders({ page: 1, limit: 10000, search: search || undefined, status: statusFilter !== 'ALL' ? statusFilter : undefined });
    const data = result.data;
    const cols = ['orderCode', 'status', 'total', 'pointsEarned', 'createdAt', 'memberId'];
    const rows = data.map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
    const url = URL.createObjectURL(new Blob([[cols.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = 'orders.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const columns = [
    { key: 'orderCode', label: 'Order Code', render: (o: any) => <span style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '13px' }}>{o.orderCode}</span> },
    { key: 'member', label: 'Member', render: (o: any) => <span className="text-muted" style={{ fontSize: '13px' }}>{o.member?.name || o.memberId?.slice(0, 8) || '—'}</span> },
    { key: 'total', label: 'Total', render: (o: any) => <span>{o.total?.toLocaleString()} VND</span> },
    { key: 'pointsEarned', label: 'Points', render: (o: any) => <span>🪙 {o.pointsEarned || 0}</span> },
    { key: 'items', label: 'Items', render: (o: any) => <span className="text-muted">{o.items?.length || 0}</span> },
    { key: 'status', label: 'Status', render: (o: any) => (
      <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: `${statusColors[o.status] || '#94a3b8'}20`, color: statusColors[o.status] || '#64748b' }}>{o.status}</span>
    )},
    { key: 'createdAt', label: 'Date', render: (o: any) => <span className="text-muted" style={{ fontSize: '12px' }}>{new Date(o.createdAt).toLocaleString()}</span> },
    { key: 'actions', label: 'Actions', render: (o: any) => (
      <button onClick={() => router.push(`/orders/${o.id}`)} className="btn-primary btn-sm">View</button>
    )},
  ];

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><TableSkeleton rows={6} cols={7} /></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <PageHeader title="Orders" subtitle="Track and manage orders" />
        <div className="toolbar">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="filter-select">
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REFUNDED">Refunded</option>
          </select>
          <input type="text" placeholder="Search by order code..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="search-input" />
          <span style={{ color: '#64748b', fontSize: '14px' }}>{total > 0 ? `${total} results` : ''}</span>
          <button onClick={exportCsv} className="btn-secondary">Export CSV</button>
        </div>
        <DataTable columns={columns} data={orders} emptyMessage="No orders found" />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </main>
    </div>
  );
}
