'use client';

import { useEffect, useState } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
}

let toastId = 0;
const listeners: Set<(msg: ToastMessage) => void> = new Set();

export function showToast(message: string, type: ToastType = 'info') {
  const msg: ToastMessage = { id: ++toastId, type, message };
  listeners.forEach(fn => fn(msg));
}

export default function Toast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handler = (msg: ToastMessage) => {
      setToasts(prev => [...prev, msg]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== msg.id));
      }, 3000);
    };
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, []);

  const colors: Record<ToastType, { bg: string; border: string; text: string }> = {
    success: { bg: '#f0fdf4', border: '#86efac', text: '#16a34a' },
    error: { bg: '#fef2f2', border: '#fecaca', text: '#dc2626' },
    info: { bg: '#eff6ff', border: '#bfdbfe', text: '#2563eb' },
  };

  return (
    <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: colors[t.type].bg,
          border: `1px solid ${colors[t.type].border}`,
          color: colors[t.type].text,
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          maxWidth: '360px',
          animation: 'slideIn 0.3s ease-out',
        }}>
          {t.message}
        </div>
      ))}
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </div>
  );
}
