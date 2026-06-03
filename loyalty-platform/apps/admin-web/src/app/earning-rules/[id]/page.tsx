'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { DetailSkeleton } from '@/components/LoadingSkeleton';
import { useToast } from '@/components/Toast';

export default function EarningRuleDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [rule, setRule] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/earning-rules/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      setRule(result.data ?? result);
    } catch { showToast('Failed to load rule', 'error'); }
    setLoading(false);
  };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    load();
  }, [id]);

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><DetailSkeleton /></main></div>;
  if (!rule) return <div className="page-layout"><Sidebar /><main className="main-content"><p>Rule not found</p></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <button onClick={() => router.back()} className="btn-secondary">← Back</button>
        <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '16px 0' }}>{rule.name}</h1>
        <p className="text-muted" style={{ marginBottom: '24px' }}>{rule.description || 'No description'}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          {[
            { label: 'Points Per Unit', value: `x${rule.pointsPerUnit}`, color: '#2563eb', bg: '#eff6ff' },
            { label: 'Category', value: rule.category || 'All', color: '#7c3aed', bg: '#f5f3ff' },
            { label: 'Status', value: rule.status, color: rule.status === 'ACTIVE' ? '#16a34a' : '#64748b', bg: rule.status === 'ACTIVE' ? '#f0fdf4' : '#f8fafc' },
            { label: 'Min Amount', value: rule.minAmount ? `${rule.minAmount.toLocaleString()} VND` : 'No min', color: '#475569', bg: '#f8fafc' },
            { label: 'Max Amount', value: rule.maxAmount ? `${rule.maxAmount.toLocaleString()} VND` : 'No max', color: '#475569', bg: '#f8fafc' },
            { label: 'Created', value: new Date(rule.createdAt).toLocaleDateString('vi-VN'), color: '#475569', bg: '#f8fafc' },
          ].map((stat, i) => (
            <div key={i} style={{ background: stat.bg, borderRadius: '12px', padding: '20px' }}>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>{stat.label}</p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
