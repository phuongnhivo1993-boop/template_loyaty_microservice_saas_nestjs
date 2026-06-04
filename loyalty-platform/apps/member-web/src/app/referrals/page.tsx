'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MemberLayout from '../member-layout';
import { getReferrals } from '@/lib/api';

export default function ReferralsPage() {
  const router = useRouter();
  const [referrals, setReferrals] = useState<any[]>([]);
  const [refCode, setRefCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    getReferrals()
      .then((res: any) => {
        const data = res?.data || res || {};
        setReferrals(data.referrals || []);
        setRefCode(data.referralCode || '');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = () => {
    if (refCode) {
      navigator.clipboard.writeText(refCode).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    }
  };

  const shareLink = refCode ? `${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${refCode}` : '';

  if (loading) {
    return <MemberLayout><div className="card" style={{ textAlign: 'center', padding: '60px' }}>Loading...</div></MemberLayout>;
  }

  return (
    <MemberLayout>
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
          <div className="empty-state" style={{ padding: '20px 0' }}>
            <div className="empty-icon">👥</div>
            <div className="empty-text">No referrals yet. Share your code!</div>
          </div>
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
