'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MemberLayout from '../member-layout';
import { getMyFeedback, submitFeedback } from '@/lib/api';
import { CardSkeleton } from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';

export default function FeedbackPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'submit' | 'history'>('submit');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFeedback = () => {
    setError('');
    getMyFeedback()
      .then((res: any) => setFeedbackList(res?.data || res || []))
      .catch((e) => setError(e?.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    loadFeedback();
  }, []);

  const handleSubmit = async () => {
    if (rating === 0) { setSubmitError('Please select a rating'); return; }
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);
    try {
      await submitFeedback({ rating, comment: comment.trim() || undefined });
      setSubmitSuccess(true);
      setRating(0);
      setComment('');
      loadFeedback();
    } catch (e: any) {
      setSubmitError(e?.message || 'Failed to submit feedback');
    }
    setSubmitting(false);
  };

  if (loading) {
    return <MemberLayout><CardSkeleton /></MemberLayout>;
  }

  return (
    <MemberLayout>
      {error && (
        <div className="card" style={{ background: 'var(--error-bg, #fef2f2)', color: 'var(--error, #dc2626)', border: '1px solid var(--error-border, #fecaca)', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
          ⚠️ {error}
          <button className="btn btn-sm btn-outline" style={{ marginLeft: '12px' }} onClick={loadFeedback}>Retry</button>
        </div>
      )}
      <div className="header">
        <div>
          <div className="header-title">💬 Feedback</div>
          <div className="header-subtitle">{feedbackList.length} submission{feedbackList.length !== 1 ? 's' : ''}</div>
        </div>
      </div>

      <div className="tab-bar">
        <button className={`tab ${tab === 'submit' ? 'active' : ''}`} onClick={() => setTab('submit')}>Submit Feedback</button>
        <button className={`tab ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>My Feedback</button>
      </div>

      {tab === 'submit' ? (
        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: '16px' }}>Rate your experience</div>

          {submitSuccess && (
            <div className="card" style={{ background: 'var(--success-bg, #f0fdf4)', borderColor: 'var(--success-border, #bbf7d0)', color: 'var(--success)', marginBottom: '12px' }}>
              ✅ Feedback submitted successfully!
            </div>
          )}

          {submitError && (
            <div style={{ color: 'var(--error)', fontSize: '14px', marginBottom: '12px' }}>
              ⚠️ {submitError}
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px', fontSize: '32px' }}>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                style={{
                  background: 'none', border: 'none', fontSize: '32px', cursor: 'pointer',
                  filter: star <= (hoverRating || rating) ? 'none' : 'grayscale(1)',
                  opacity: star <= (hoverRating || rating) ? 1 : 0.3,
                  transition: 'all 0.2s',
                }}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onTouchStart={() => setRating(star)}
              >
                ⭐
              </button>
            ))}
          </div>

          <textarea
            placeholder="Tell us more (optional)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            style={{
              width: '100%', padding: '12px 16px', border: '2px solid var(--border)',
              borderRadius: '10px', fontSize: '15px', outline: 'none', resize: 'vertical',
              fontFamily: 'inherit', background: 'var(--card)', color: 'var(--text)',
              marginBottom: '16px',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          />

          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      ) : (
        feedbackList.length === 0 ? (
          <EmptyState icon="💬" title="No feedback yet" action={{ label: 'Submit your first feedback', onClick: () => setTab('submit') }} />
        ) : (
          feedbackList.map((f: any) => (
            <div key={f.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} style={{ fontSize: '16px', filter: star <= f.rating ? 'none' : 'grayscale(1)', opacity: star <= f.rating ? 1 : 0.3 }}>
                      ⭐
                    </span>
                  ))}
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {new Date(f.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              {f.comment && (
                <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{f.comment}</div>
              )}
            </div>
          ))
        )
      )}
    </MemberLayout>
  );
}
