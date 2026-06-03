'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import Pagination from '@/components/Pagination';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import { getFeedbackList, updateFeedback, deleteFeedback } from '@/lib/api';

const ratingColors: Record<number, string> = {
  1: '#dc2626', 2: '#ea580c', 3: '#d97706', 4: '#16a34a', 5: '#2563eb',
};

export default function FeedbackPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('ALL');
  const [entityTypeFilter, setEntityTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const load = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit };
      if (search) params.search = search;
      if (ratingFilter !== 'ALL') params.rating = ratingFilter;
      if (entityTypeFilter !== 'ALL') params.entityType = entityTypeFilter;
      if (statusFilter !== 'ALL') params.status = statusFilter;
      const result = await getFeedbackList(params);
      setFeedbacks(result.data);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) { router.push('/login'); return; }
    load();
  }, [search, page, ratingFilter, entityTypeFilter, statusFilter]);

  const handleApprove = async (id: string) => {
    try {
      await updateFeedback(id, { status: 'APPROVED' });
      showToast('Feedback approved', 'success');
      load();
    } catch { showToast('Operation failed', 'error'); }
  };

  const handleHide = async (id: string) => {
    try {
      await updateFeedback(id, { status: 'HIDDEN' });
      showToast('Feedback hidden', 'success');
      load();
    } catch { showToast('Operation failed', 'error'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this feedback permanently?')) return;
    try {
      await deleteFeedback(id);
      showToast('Feedback deleted', 'success');
      load();
    } catch { showToast('Failed to delete', 'error'); }
  };

  const columns = [
    { key: 'member', label: 'Member', render: (f: any) => (
      <div>
        <div className="font-medium">{f.memberName || f.memberId?.slice(0, 8) || 'Unknown'}</div>
        {f.memberEmail && <div className="text-muted" style={{ fontSize: '12px' }}>{f.memberEmail}</div>}
      </div>
    )},
    { key: 'entity', label: 'Entity', render: (f: any) => (
      <div>
        <div style={{ fontSize: '13px' }}>{f.entityType || '-'}</div>
        <div className="text-muted" style={{ fontSize: '12px' }}>{f.entityId?.slice(0, 8) || ''}</div>
      </div>
    )},
    { key: 'rating', label: 'Rating', render: (f: any) => (
      <span style={{ fontSize: '18px', color: ratingColors[f.rating] || '#64748b', fontWeight: 700 }}>
        {'★'.repeat(f.rating)}{'☆'.repeat(5 - (f.rating || 0))}
      </span>
    )},
    { key: 'content', label: 'Content', render: (f: any) => (
      <span style={{ fontSize: '13px', maxWidth: '250px', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.content || '-'}</span>
    )},
    { key: 'status', label: 'Status', render: (f: any) => (
      <span className={`status-badge ${(f.status || 'PENDING').toLowerCase()}`}>{f.status || 'PENDING'}</span>
    )},
    { key: 'actions', label: 'Actions', render: (f: any) => (
      <>
        {(f.status === 'PENDING' || f.status === 'HIDDEN') && (
          <button onClick={() => handleApprove(f.id)} className="btn-primary btn-sm" style={{ marginRight: '8px' }}>Approve</button>
        )}
        {f.status !== 'HIDDEN' && (
          <button onClick={() => handleHide(f.id)} className="btn-secondary btn-sm" style={{ marginRight: '8px' }}>Hide</button>
        )}
        <button onClick={() => handleDelete(f.id)} className="btn-danger btn-sm">Delete</button>
      </>
    )},
  ];

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><TableSkeleton rows={6} cols={6} /></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <PageHeader
          title="Member Feedback"
          subtitle="Manage reviews and feedback from members"
        />

        <div className="toolbar">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="filter-select">
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="HIDDEN">Hidden</option>
          </select>
          <select value={entityTypeFilter} onChange={(e) => { setEntityTypeFilter(e.target.value); setPage(1); }} className="filter-select">
            <option value="ALL">All Entities</option>
            <option value="STORE">Store</option>
            <option value="PRODUCT">Product</option>
            <option value="CAMPAIGN">Campaign</option>
            <option value="REWARD">Reward</option>
          </select>
          <select value={ratingFilter} onChange={(e) => { setRatingFilter(e.target.value); setPage(1); }} className="filter-select">
            <option value="ALL">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <input type="text" placeholder="Search feedback..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="search-input" />
          <span className="text-muted">{total > 0 ? `${total} results` : ''}</span>
        </div>

        <DataTable columns={columns} data={feedbacks} emptyMessage="No feedback found" />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </main>
    </div>
  );
}
