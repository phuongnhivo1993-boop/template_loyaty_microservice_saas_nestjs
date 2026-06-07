'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MemberLayout from '../member-layout';
import { getNotifications, markNotificationRead } from '@/lib/api';
import { CardSkeleton } from '@/components/LoadingSkeleton';

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = () => {
    setError('');
    getNotifications()
      .then((res: any) => setNotifications(res?.data || res || []))
      .catch((e) => setError(e?.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    loadData();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (e: any) {
      setError(e?.message || 'Failed to mark as read');
    }
  };

  if (loading) {
    return <MemberLayout><CardSkeleton /></MemberLayout>;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

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
          <div className="header-title">🔔 Notifications</div>
          <div className="header-subtitle">{unreadCount} unread</div>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔕</div>
          <div className="empty-text">No notifications yet</div>
        </div>
      ) : (
        notifications.map((n: any) => (
          <div
            key={n.id}
            className="card"
            style={{
              borderLeft: `4px solid ${n.read ? 'var(--border)' : 'var(--primary)'}`,
              opacity: n.read ? 0.75 : 1,
              cursor: n.read ? 'default' : 'pointer',
            }}
            onClick={() => !n.read && handleMarkRead(n.id)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: n.read ? 500 : 700, fontSize: '15px' }}>{n.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{n.message}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
                  {new Date(n.createdAt).toLocaleDateString('vi-VN', {
                    hour: '2-digit', minute: '2-digit',
                  })}
                </div>
              </div>
              {!n.read && (
                <span
                  style={{
                    width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)',
                    display: 'inline-block', flexShrink: 0, marginTop: 6,
                  }}
                />
              )}
            </div>
          </div>
        ))
      )}
    </MemberLayout>
  );
}
