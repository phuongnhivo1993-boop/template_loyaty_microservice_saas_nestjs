'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { DetailSkeleton } from '@/components/LoadingSkeleton';
import { useToast } from '@/components/Toast';
import { getFeedback, updateFeedback, deleteFeedback } from '@/lib/api';

const ratingColors: Record<number, string> = {
  1: '#dc2626', 2: '#ea580c', 3: '#d97706', 4: '#16a34a', 5: '#2563eb',
};

export default function FeedbackDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    getFeedback(params.id)
      .then(data => setFeedback(data))
      .catch(() => showToast('Failed to load feedback', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) { router.push('/login'); return; }
    load();
  }, [params.id]);

  const handleApprove = async () => {
    try {
      await updateFeedback(params.id, { status: 'APPROVED' });
      showToast('Feedback approved', 'success');
      load();
    } catch { showToast('Operation failed', 'error'); }
  };

  const handleHide = async () => {
    try {
      await updateFeedback(params.id, { status: 'HIDDEN' });
      showToast('Feedback hidden', 'success');
      load();
    } catch { showToast('Operation failed', 'error'); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this feedback permanently?')) return;
    try {
      await deleteFeedback(params.id);
      showToast('Feedback deleted', 'success');
      router.push('/feedback');
    } catch { showToast('Failed to delete', 'error'); }
  };

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><DetailSkeleton /></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <button onClick={() => router.push('/feedback')} className="btn-secondary">← Back to Feedback</button>

        {feedback ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 700 }}>
                  Feedback from {feedback.memberName || feedback.memberId?.slice(0, 8) || 'Unknown'}
                </h1>
                <p style={{ color: '#64748b', marginTop: '4px' }}>
                  {feedback.entityType} — {feedback.entityId?.slice(0, 8) || ''}
                </p>
              </div>
              <span className={`status-badge ${(feedback.status || 'PENDING').toLowerCase()}`}>{feedback.status || 'PENDING'}</span>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              {(feedback.status === 'PENDING' || feedback.status === 'HIDDEN') && (
                <button onClick={handleApprove} className="btn-primary">Approve</button>
              )}
              {feedback.status !== 'HIDDEN' && (
                <button onClick={handleHide} className="btn-secondary">Hide</button>
              )}
              <button onClick={handleDelete} className="btn-danger">Delete</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Feedback Details</h2>
                <div style={{ marginBottom: '12px' }}><strong>Rating:</strong>{' '}
                  <span style={{ fontSize: '24px', color: ratingColors[feedback.rating] || '#64748b', fontWeight: 700 }}>
                    {'★'.repeat(feedback.rating)}{'☆'.repeat(5 - (feedback.rating || 0))}
                  </span>
                </div>
                <div style={{ marginBottom: '12px' }}><strong>Content:</strong></div>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {feedback.content || '-'}
                </div>
              </div>
              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Entity Info</h2>
                <div style={{ marginBottom: '12px' }}><strong>Member:</strong> {feedback.memberName || feedback.memberEmail || feedback.memberId || '-'}</div>
                <div style={{ marginBottom: '12px' }}><strong>Entity Type:</strong> {feedback.entityType || '-'}</div>
                <div style={{ marginBottom: '12px' }}><strong>Entity ID:</strong> {feedback.entityId || '-'}</div>
                <div style={{ marginBottom: '12px' }}><strong>Status:</strong> {feedback.status || 'PENDING'}</div>
                <div style={{ marginBottom: '12px' }}><strong>Created At:</strong> {feedback.createdAt ? new Date(feedback.createdAt).toLocaleString() : '-'}</div>
              </div>
            </div>
          </>
        ) : (
          <p style={{ color: '#dc2626' }}>Feedback not found</p>
        )}
      </main>
    </div>
  );
}
