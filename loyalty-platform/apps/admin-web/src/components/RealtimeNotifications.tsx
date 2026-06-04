'use client';

import { useToast } from './Toast';
import { useWebSocket } from '@/lib/useWebSocket';
import { useEffect, useState } from 'react';

export default function RealtimeNotifications() {
  const { showToast } = useToast();
  const { emit, connected, reconnecting } = useWebSocket({
    'order.created': (data: any) => {
      showToast(`🛒 New order: ${data.orderCode} — ${data.total?.toLocaleString()} VND`, 'info');
    },
    'order.status_changed': (data: any) => {
      showToast(`📦 Order ${data.orderCode}: ${data.status}`, 'info');
    },
    'points.earned': (data: any) => {
      showToast(`🪙 Earned ${data.amount} points`, 'success');
    },
    'coupon.applied': (data: any) => {
      showToast(`🏷️ Coupon ${data.couponCode} applied, discount: ${data.discount?.toLocaleString()} VND`, 'success');
    },
    'notification': (data: any) => {
      showToast(`🔔 ${data.title}: ${data.message}`, 'info');
    },
  });

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, [connected, reconnecting]);

  return (
    <>
      {!connected && visible && (
        <div style={{
          position: 'fixed', bottom: '80px', right: '20px', zIndex: 9999,
          background: reconnecting ? '#fef3c7' : '#fee2e2',
          color: reconnecting ? '#92400e' : '#991b1b',
          padding: '8px 16px', borderRadius: '8px', fontSize: '13px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: reconnecting ? '#f59e0b' : '#ef4444', display: 'inline-block' }} />
          {reconnecting ? 'Reconnecting...' : 'Disconnected'}
        </div>
      )}
    </>
  );
}
