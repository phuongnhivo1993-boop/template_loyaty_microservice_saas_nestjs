'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MemberLayout from '../member-layout';
import { getReferrals } from '@/lib/api';
import { CardSkeleton } from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';

export default function ReferralsPage() {
  const router = useRouter();
  const [referrals, setReferrals] = useState<any[]>([]);
  const [refCode, setRefCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const loadData = () => {
    setError('');
    getReferrals()
      .then((res: any) => {
        const data = res?.data || res || {};
        setReferrals(data.referrals || []);
        setRefCode(data.referralCode || '');
      })
      .catch((e) => setError(e?.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    loadData();
  }, []);

  const handleCopy = () => {
    if (refCode) {
      navigator.clipboard.writeText(refCode).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    }
  };

  const shareLink = refCode ? `${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${refCode}` : '';

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
          <div className="header-title">🔗 Referrals</div>
          <div className="header-subtitle">Invite friends, earn rewards</div>
        </div>
      </div>

      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: 600, marginBottom: '8px' }}>Your Referral Code</div>
        <div className="referral-code" onClick={handleCopy}>
          {refCode || '------'}
          <button className="btn btn-sm btn-outline" style={{ marginLeft: '12px' }}>{copied ? '✅ Copied!' : '📋 Copy'}</button>
        </div>
        {shareLink && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', wordBreak: 'break-all' }}>{shareLink}</div>}
      </div>

      <div className="card">
        <div style={{ fontWeight: 600, marginBottom: '12px' }}>Your Referrals ({referrals.length})</div>
        {referrals.length === 0 ? (
          <EmptyState icon="👥" title="No referrals yet. Share your code!" action={{ label: 'Copy your code', onClick: () => { if (refCode) navigator.clipboard.writeText(refCode); }}} />
        ) : (
          referrals.map((r: any) => (
            <div key={r.id} className="tx-item">
              <div className="tx-left">
                <div className="tx-reason">{r.member?.fullName || r.memberId}</div>
                <div className="tx-date">{r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : ''}</div>
              </div>
              <div className="tx-amount" style={{ color: 'var(--success)' }}>{r.rewardEarned ? `+${r.rewardEarned}` : 'Joined'}</div>
            </div>
          ))
        )}
      </div>
    </MemberLayout>
  );
}
