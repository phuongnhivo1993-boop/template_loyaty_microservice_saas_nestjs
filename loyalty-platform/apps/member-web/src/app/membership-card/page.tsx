'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MemberLayout from '../member-layout';
import { getProfile, getWallet } from '@/lib/api';
import { CardSkeleton } from '@/components/LoadingSkeleton';

const tierColors: Record<string, string> = {
  BRONZE: '#cd7f32',
  SILVER: '#c0c0c0',
  GOLD: '#ffd700',
  PLATINUM: '#e5e4e2',
  DIAMOND: '#b9f2ff',
};

function generateQR(value: string) {
  const blocks = value.padEnd(64, ' ').split('').map(() => Math.random() > 0.5 ? '██' : '  ');
  const rows: string[][] = [];
  for (let i = 0; i < 8; i++) {
    rows.push(blocks.slice(i * 8, (i + 1) * 8));
  }
  return rows.map(r => r.join('')).join('\n');
}

export default function MembershipCardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = () => {
    setError('');
    Promise.all([
      getProfile().then(setProfile).catch(() => {}),
      getWallet().then(setWallet).catch(() => {}),
    ]).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    loadData();
  }, []);

  if (loading) {
    return <MemberLayout><CardSkeleton /></MemberLayout>;
  }

  const memberId = profile?.id || profile?.memberId || 'N/A';
  const tierName = profile?.tier?.name || 'MEMBER';
  const tierColor = tierColors[tierName.toUpperCase()] || '#6366f1';

  return (
    <MemberLayout>
      {error && (
        <div className="card" style={{ background: 'var(--error-bg, #fef2f2)', color: 'var(--error, #dc2626)', border: '1px solid var(--error-border, #fecaca)', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
          ⚠️ {error}
          <button className="btn btn-sm btn-outline" style={{ marginLeft: '12px' }} onClick={loadData}>Retry</button>
        </div>
      )}
      <div className="header">
        <div>
          <div className="header-title">💳 Membership Card</div>
          <div className="header-subtitle">Your digital membership card</div>
        </div>
      </div>

      <div
        className="card"
        style={{
          background: `linear-gradient(135deg, ${tierColor}22, ${tierColor}44)`,
          border: `2px solid ${tierColor}`,
          borderRadius: '16px',
          padding: '24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: -20, right: -20, fontSize: '80px', opacity: 0.1 }}>🏆</div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Member ID</div>
            <div style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '16px' }}>{memberId}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Tier</div>
            <div style={{ fontWeight: 700, color: tierColor, fontSize: '18px' }}>{tierName}</div>
          </div>
        </div>

        <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>{profile?.fullName || 'Member'}</div>

        <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Points</div>
            <div style={{ fontWeight: 700, fontSize: '18px' }}>🪙 {(wallet?.availablePoints ?? profile?.availablePoints ?? 0).toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Lifetime Points</div>
            <div style={{ fontWeight: 700, fontSize: '18px' }}>🏆 {(wallet?.totalEarned ?? 0).toLocaleString()}</div>
          </div>
        </div>

        <div
          style={{
            marginTop: '20px',
            padding: '16px',
            background: 'white',
            borderRadius: '12px',
            textAlign: 'center',
            fontFamily: 'monospace',
            fontSize: '10px',
            lineHeight: '1.4',
            letterSpacing: '0',
            color: '#1e293b',
            border: '1px dashed #cbd5e1',
            whiteSpace: 'pre',
            overflow: 'hidden',
          }}
        >
          {generateQR(memberId)}
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px', fontFamily: 'sans-serif' }}>
            Show to staff to scan
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '16px' }}>
        <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '12px' }}>📖 How to use</div>
        <ol style={{ fontSize: '14px', color: 'var(--text-secondary, #64748b)', lineHeight: 1.8, paddingLeft: '20px' }}>
          <li>Show this membership card at participating stores</li>
          <li>Staff will scan the QR code to identify you</li>
          <li>Earn points on every purchase automatically</li>
          <li>Redeem rewards and vouchers with your points</li>
          <li>Track your tier progress to unlock more benefits</li>
        </ol>
      </div>
    </MemberLayout>
  );
}
