'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MemberLayout from '@/app/member-layout';
import { getVoucher, redeemVoucher } from '@/lib/api';
import { CardSkeleton } from '@/components/LoadingSkeleton';
import { showToast } from '@/components/Toast';

export default function VoucherDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [voucher, setVoucher] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = () => {
    setError('');
    getVoucher(params.id as string)
      .then((res: any) => setVoucher(res?.data || res))
      .catch((e) => setError(e?.message || 'Failed to load voucher'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    loadData();
  }, []);

  if (loading) {
    return <MemberLayout><CardSkeleton /></MemberLayout>;
  }

  if (error) {
    return (
      <MemberLayout>
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <p style={{ color: 'var(--error)', marginBottom: '16px' }}>{error}</p>
          <button className="btn btn-primary" onClick={loadData}>Retry</button>
        </div>
      </MemberLayout>
    );
  }

  const v = voucher?.voucher || voucher || {};
  const isRedeemed = voucher?.redeemed;

  return (
    <MemberLayout>
      <div className="header">
        <div>
          <div className="header-title">🎟️ Voucher Details</div>
          <div className="header-subtitle">{v.code}</div>
        </div>
        <button className="btn btn-outline" onClick={() => router.push('/vouchers')}>Back</button>
      </div>

      <div className="card" style={{ borderLeft: `4px solid ${isRedeemed ? 'var(--text-muted)' : 'var(--primary)'}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '18px', fontFamily: 'monospace', letterSpacing: '2px' }}>{v.code}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{v.type}</div>
          </div>
          <span className="badge" style={{
            background: isRedeemed ? 'var(--bg-secondary, #f1f5f9)' : 'var(--success-bg, #dcfce7)',
            color: isRedeemed ? 'var(--text-muted)' : 'var(--success)',
          }}>
            {isRedeemed ? 'Used' : 'Active'}
          </span>
        </div>

        <div className="grid-2" style={{ marginBottom: '16px' }}>
          <div className="card" style={{ padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Value</div>
            <div style={{ fontWeight: 700, fontSize: '20px', color: 'var(--primary)' }}>{v.value?.toLocaleString()}</div>
          </div>
          <div className="card" style={{ padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Status</div>
            <div style={{ fontWeight: 700, fontSize: '16px' }}>{isRedeemed ? 'Redeemed' : 'Available'}</div>
          </div>
        </div>

        {v.description && (
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            {v.description}
          </div>
        )}

        {v.expiresAt && (
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Expires: {new Date(v.expiresAt).toLocaleDateString('vi-VN')}
          </div>
        )}

        {voucher?.qrCode && (
          <div style={{ textAlign: 'center', padding: '16px', background: 'var(--bg-secondary, #f8fafc)', borderRadius: '12px', border: '1px dashed var(--border, #cbd5e1)', marginBottom: '16px' }}>
            <div style={{
              display: 'inline-block', padding: '12px', background: 'var(--bg-card, white)', borderRadius: '8px',
              fontFamily: 'monospace', fontSize: '11px', lineHeight: '1.6', letterSpacing: '1px',
              color: 'var(--text-primary, #1e293b)', border: '1px solid var(--border, #e2e8f0)',
            }}>
              {voucher.qrCode.replace(/.{8}/g, '$& ').trim().split(' ').map((chunk: string, i: number) => (
                <div key={i}>{chunk}</div>
              ))}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
              Show this QR code at checkout
            </div>
          </div>
        )}

        {!isRedeemed && (
          <button
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={async () => {
              if (typeof window !== 'undefined' && !window.confirm('Use this voucher now?')) return;
              try {
                await redeemVoucher(voucher.id);
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
    </MemberLayout>
  );
}
