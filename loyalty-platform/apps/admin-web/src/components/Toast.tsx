'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  showToast: (message: string, type?: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = nextId++;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const removeToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  const colors = {
    success: { bg: '#dcfce7', text: '#16a34a', border: '#bbf7d0' },
    error: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
    info: { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {toasts.map(t => (
          <div
            key={t.id}
            onClick={() => removeToast(t.id)}
            style={{
              padding: '12px 20px',
              borderRadius: '10px',
              background: colors[t.type].bg,
              color: colors[t.type].text,
              border: `1px solid ${colors[t.type].border}`,
              fontWeight: 500,
              fontSize: '14px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              maxWidth: '400px',
              animation: 'slideIn 0.3s ease',
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </ToastContext.Provider>
  );
}
