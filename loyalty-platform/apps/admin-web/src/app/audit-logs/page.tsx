'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import Pagination from '@/components/Pagination';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import { getAuditLogs } from '@/lib/api';

const ACTION_OPTIONS = ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'];
const ENTITY_OPTIONS = ['MEMBER', 'TENANT', 'CAMPAIGN', 'VOUCHER', 'USER', 'TIER', 'REWARD', 'PROMOTION', 'REFERRAL', 'BADGE', 'MISSION', 'NOTIFICATION', 'STORE', 'PRODUCT', 'ORDER', 'COUPON', 'GIFT_CARD', 'FEEDBACK', 'EARNING_RULE', 'POINTS', 'PRODUCT_CATEGORY', 'PARTNER_BRAND', 'WEBHOOK'];

const actionColors: Record<string, { bg: string; color: string }> = {
  CREATE: { bg: '#dcfce7', color: '#16a34a' },
  UPDATE: { bg: '#dbeafe', color: '#2563eb' },
  DELETE: { bg: '#fef2f2', color: '#dc2626' },
  LOGIN: { bg: '#ccfbf1', color: '#0d9488' },
  LOGOUT: { bg: '#f1f5f9', color: '#64748b' },
};

export default function AuditLogsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = { page, limit };
      if (search) params.search = search;
      if (actionFilter) params.action = actionFilter;
      if (entityFilter) params.entity = entityFilter;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const result = await getAuditLogs(params);
      setLogs(result.data);
      setTotalPages(result.totalPages || 1);
      setTotal(result.total || 0);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    load();
  }, [search, page, actionFilter, entityFilter, startDate, endDate]);

  const clearFilters = () => {
    setSearch('');
    setActionFilter('');
    setEntityFilter('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  const hasActiveFilters = search || actionFilter || entityFilter || startDate || endDate;

  const exportCsv = async () => {
    try {
      const params: Record<string, any> = { page: 1, limit: 10000 };
      if (search) params.search = search;
      if (actionFilter) params.action = actionFilter;
      if (entityFilter) params.entity = entityFilter;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const result = await getAuditLogs(params);
      const data = result.data;
      const cols = ['createdAt', 'action', 'entityType', 'entityId', 'userEmail', 'description', 'ipAddress'];
      const header = cols.join(',');
      const rows = data.map((item: any) => cols.map((col: string) => {
        const v = item[col]?.toString() || '';
        return v.includes(',') ? `"${v}"` : v;
      }).join(','));
      const csv = [header, ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'audit-logs.csv'; a.click();
      URL.revokeObjectURL(url);
      showToast('Xuất CSV thành công', 'success');
    } catch {
      showToast('Lỗi xuất CSV', 'error');
    }
  };

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const columns = [
    {
      key: 'createdAt', label: 'Thời gian',
      render: (l: any) => <span className="text-muted">{l.createdAt ? new Date(l.createdAt).toLocaleString('vi-VN') : '-'}</span>,
      sortable: true,
    },
    {
      key: 'userEmail', label: 'Người dùng',
      render: (l: any) => <span style={{ fontWeight: 500 }}>{l.userEmail || l.user?.email || '-'}</span>,
    },
    {
      key: 'action', label: 'Hành động',
      render: (l: any) => {
        const c = actionColors[l.action] || { bg: '#f1f5f9', color: '#64748b' };
        return <span className="status-badge" style={{ background: c.bg, color: c.color }}>{l.action}</span>;
      },
    },
    {
      key: 'entityType', label: 'Đối tượng',
      render: (l: any) => <span className="font-medium">{l.entityType || '-'}</span>,
    },
    {
      key: 'entityId', label: 'ID',
      render: (l: any) => (
        <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#94a3b8' }}>
          {l.entityId ? `${l.entityId.slice(0, 12)}...` : '-'}
        </span>
      ),
    },
    {
      key: 'description', label: 'Mô tả',
      render: (l: any) => (
        <span
          title={l.description}
          style={{
            maxWidth: '220px', display: 'inline-block', overflow: 'hidden',
            textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#64748b', fontSize: '13px',
          }}
        >
          {l.description || '-'}
        </span>
      ),
    },
    {
      key: 'ipAddress', label: 'IP',
      render: (l: any) => <span style={{ color: '#94a3b8', fontSize: '13px' }}>{l.ipAddress || '-'}</span>,
    },
    {
      key: 'actions', label: '',
      render: (l: any) => (
        <button onClick={() => toggleRow(l.id)} className="btn-secondary btn-sm">
          {expandedRow === l.id ? 'Thu gọn' : 'Chi tiết'}
        </button>
      ),
    },
  ];

  const expandedLog = expandedRow ? logs.find(l => l.id === expandedRow) : null;

  if (loading) {
    return (
      <div className="page-layout">
        <Sidebar />
        <main className="main-content">
          <PageHeader title="Lịch sử hoạt động" subtitle="Đang tải dữ liệu..." />
          <TableSkeleton rows={6} cols={8} />
        </main>
      </div>
    );
  }

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <PageHeader
          title="Lịch sử hoạt động"
          subtitle="Theo dõi tất cả các thay đổi trong hệ thống"
        />

        <div className="toolbar">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="search-input"
          />
          <select
            value={actionFilter}
            onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
            className="filter-select"
          >
            <option value="">Tất cả hành động</option>
            {ACTION_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <select
            value={entityFilter}
            onChange={(e) => { setEntityFilter(e.target.value); setPage(1); }}
            className="filter-select"
          >
            <option value="">Tất cả đối tượng</option>
            {ENTITY_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
            className="filter-select"
            style={{ maxWidth: '160px' }}
            placeholder="Từ ngày"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
            className="filter-select"
            style={{ maxWidth: '160px' }}
            placeholder="Đến ngày"
          />
          {hasActiveFilters && (
            <button onClick={clearFilters} className="btn-secondary">Xóa bộ lọc</button>
          )}
          {total > 0 && <span className="text-muted">{total} kết quả</span>}
          <button onClick={exportCsv} className="btn-secondary">Xuất CSV</button>
        </div>

        <DataTable columns={columns} data={logs} emptyMessage="Không tìm thấy lịch sử hoạt động" />

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

        {expandedLog && (
          <div style={{
            marginTop: '16px', background: 'white', borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '20px',
            border: '1px solid #e2e8f0',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Chi tiết thay đổi</h3>
              <button onClick={() => setExpandedRow(null)} className="btn-secondary btn-sm">Đóng</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#dc2626', marginBottom: '8px' }}>
                  Giá trị cũ
                </h4>
                <pre style={{
                  background: '#fef2f2', padding: '12px', borderRadius: '8px',
                  fontSize: '12px', overflow: 'auto', maxHeight: '300px',
                  fontFamily: 'monospace', lineHeight: 1.5, margin: 0,
                }}>
                  {JSON.stringify(expandedLog.oldValue || expandedLog.oldData || {}, null, 2)}
                </pre>
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#16a34a', marginBottom: '8px' }}>
                  Giá trị mới
                </h4>
                <pre style={{
                  background: '#f0fdf4', padding: '12px', borderRadius: '8px',
                  fontSize: '12px', overflow: 'auto', maxHeight: '300px',
                  fontFamily: 'monospace', lineHeight: 1.5, margin: 0,
                }}>
                  {JSON.stringify(expandedLog.newValue || expandedLog.newData || {}, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
