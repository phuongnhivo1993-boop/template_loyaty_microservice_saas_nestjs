'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import MemberLayout from '../member-layout';
import { getMyVouchers, redeemVoucher } from '@/lib/api';
import { CardSkeleton } from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import { showToast } from '@/components/Toast';

export default function VouchersPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const loadData = () => {
    setError('');
    getMyVouchers()
      .then((res: any) => setVouchers(res?.data || res || []))
      .catch((e) => setError(e?.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    loadData();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return vouchers;
    const q = search.toLowerCase();
    return vouchers.filter(v =>
      (v.voucher?.code || v.code || '').toLowerCase().includes(q) ||
      (v.voucher?.type || v.type || '').toLowerCase().includes(q) ||
      (v.voucher?.description || v.description || '').toLowerCase().includes(q)
    );
  }, [vouchers, search]);

  if (loading) {
    return <MemberLayout><CardSkeleton /></MemberLayout>;
  }

  return (
    <MemberLayout>
      {error && (
        <div className="card" style={{ background: 'var(--error-bg, #fef2f2)', color: 'var(--error, #dc2626)', border: '1px solid var(--error-border, #fecaca)', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
          ⚠️ {error}
          <button className="btn btn-sm btn-outline" style={{ marginLeft: '12px' }} onClick={loadData}>{t('common.retry')}</button>
        </div>
      )}
      <div className="header">
        <div>
          <div className="header-title">{t('vouchers.title')}</div>
          <div className="header-subtitle">{filtered.length} {t('vouchers.title').toLowerCase()}</div>
        </div>
      </div>

      <input
        type="text"
        placeholder={t('vouchers.search')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '12px' }}
      />

      {filtered.length === 0 ? (
        <EmptyState icon="🎫" title={search ? t('vouchers.noVouchersMatch') : t('vouchers.noVouchersYet')} />
      ) : (
        filtered.map((v: any) => (
          <div key={v.id} className="card" style={{ borderLeft: `4px solid ${v.redeemed ? 'var(--text-muted)' : 'var(--primary)'}`, cursor: 'pointer' }} onClick={() => router.push(`/vouchers/${v.id}`)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '16px' }}>{v.voucher?.code || v.code}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{v.voucher?.type || v.type} • {v.voucher?.value || v.value}</div>
              </div>
              <span className="badge" style={{
                background: v.redeemed ? 'var(--bg-secondary, #f1f5f9)' : 'var(--success-bg, #dcfce7)',
                color: v.redeemed ? 'var(--text-muted)' : 'var(--success)',
              }}>
                {v.redeemed ? 'Used' : 'Active'}
              </span>
            </div>
            {v.qrCode && (
              <div style={{ marginTop: '12px', textAlign: 'center', padding: '16px', background: 'var(--bg-secondary, #f8fafc)', borderRadius: '12px', border: '1px dashed var(--border, #cbd5e1)' }}>
                <div style={{
                  display: 'inline-block', padding: '12px', background: 'var(--bg-card, white)', borderRadius: '8px',
                  fontFamily: 'monospace', fontSize: '11px', lineHeight: '1.6', letterSpacing: '1px',
                  color: 'var(--text-primary, #1e293b)', border: '1px solid var(--border, #e2e8f0)',
                }}>
                  {v.qrCode.replace(/.{8}/g, '$& ').trim().split(' ').map((chunk: string, i: number) => (
                    <div key={i}>{chunk}</div>
                  ))}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
                  Show this QR code at checkout
                </div>
              </div>
            )}
            {!v.redeemed && (
              <button
                className="btn btn-primary btn-sm"
                style={{ marginTop: 12, width: '100%' }}
                onClick={async () => {
                  if (typeof window !== 'undefined' && !window.confirm('Use this voucher now?')) return;
                  try {
                    await redeemVoucher(v.id);
                    showToast('Voucher redeemed successfully!', 'success');
                    loadData();
                  } catch (e: any) {
                    showToast(e?.message || 'Failed to redeem voucher', 'error');
                  }
                }}
              >
                Use Now
              </button>
            )}
          </div>
        ))
      )}
    </MemberLayout>
  );
}
