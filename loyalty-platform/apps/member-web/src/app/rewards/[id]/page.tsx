'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MemberLayout from '@/app/member-layout';
import { getReward, redeemReward } from '@/lib/api';
import { CardSkeleton } from '@/components/LoadingSkeleton';
import { showToast } from '@/components/Toast';

export default function RewardDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [reward, setReward] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [redeeming, setRedeeming] = useState(false);

  const loadData = () => {
    setError('');
    getReward(id as string)
      .then((r: any) => setReward(r?.data || r))
      .catch((e) => setError(e?.message || 'Failed to load reward'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    loadData();
  }, [id]);

  const handleRedeem = async () => {
    if (!reward) return;
    setRedeeming(true);
    try {
      await redeemReward(reward.id, quantity);
      showToast('Reward redeemed successfully!', 'success');
      loadData();
    } catch (e: any) {
      showToast(e?.message || 'Failed to redeem reward', 'error');
    } finally {
      setRedeeming(false);
    }
  };

  if (loading) {
    return <MemberLayout><CardSkeleton /></MemberLayout>;
  }

  if (error) {
    return (
      <MemberLayout>
        <div className="card" style={{ background: 'var(--error-bg, #fef2f2)', color: 'var(--error, #dc2626)', border: '1px solid var(--error-border, #fecaca)', padding: '16px', borderRadius: '8px' }}>
          ⚠️ {error}
          <button className="btn btn-sm btn-outline" style={{ marginLeft: '12px' }} onClick={loadData}>Retry</button>
        </div>
      </MemberLayout>
    );
  }

  if (!reward) {
    return (
      <MemberLayout>
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-text">Reward not found</div>
        </div>
      </MemberLayout>
    );
  }

  return (
    <MemberLayout>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <button className="btn btn-sm btn-outline" onClick={() => router.push('/rewards')}>← Back</button>
      </div>

      <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
        <div style={{ height: 200, background: 'var(--bg-secondary, #f1f5f9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>
          {reward.imageUrl ? <img src={reward.imageUrl} alt={reward.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🎁'}
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ fontWeight: 700, fontSize: '20px', marginBottom: '4px' }}>{reward.name}</div>
          <span className="badge" style={{ background: 'var(--badge-bg, #f5f3ff)', color: 'var(--badge-color, #7c3aed)' }}>{reward.type}</span>

          <p style={{ fontSize: '14px', color: 'var(--text-secondary, #64748b)', marginTop: '16px', lineHeight: 1.6 }}>
            {reward.description || 'No description available.'}
          </p>

          <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
            <div className="card" style={{ flex: 1, textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary)' }}>🪙 {reward.pointsRequired?.toLocaleString()}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Points Required</div>
            </div>
            <div className="card" style={{ flex: 1, textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: reward.stock > 0 ? 'var(--success)' : 'var(--error)' }}>
                {reward.stock ?? '∞'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Stock</div>
            </div>
          </div>

          {(reward.stock === undefined || reward.stock > 0) && (
            <div style={{ marginTop: '20px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Quantity</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span style={{ fontSize: '18px', fontWeight: 700, minWidth: '40px', textAlign: 'center' }}>{quantity}</span>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => setQuantity(q => q + 1)}
                  disabled={reward.stock !== undefined && quantity >= reward.stock}
                >
                  +
                </button>
              </div>
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={handleRedeem}
                disabled={redeeming}
              >
                {redeeming ? 'Redeeming...' : `Redeem for ${(reward.pointsRequired * quantity).toLocaleString()} points`}
              </button>
            </div>
          )}

          {reward.stock === 0 && (
            <div style={{ textAlign: 'center', padding: '16px', marginTop: '16px', background: 'var(--error-bg, #fef2f2)', borderRadius: '8px', color: 'var(--error, #dc2626)', fontSize: '14px' }}>
              Out of stock
            </div>
          )}
        </div>
      </div>
    </MemberLayout>
  );
}
