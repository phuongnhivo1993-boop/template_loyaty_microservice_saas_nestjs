'use client';
import { useEffect, useCallback } from 'react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

const backdropStyle: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex',
  alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  animation: 'confirmModalFadeIn 0.2s ease',
};

const modalStyle: React.CSSProperties = {
  background: 'var(--bg-card, white)', borderRadius: '12px', padding: '32px', width: '420px',
  maxHeight: '80vh', overflow: 'auto',
};

export default function ConfirmModal({
  open, title, message, onConfirm, onCancel,
  confirmText = 'Confirm', cancelText = 'Cancel', danger = false,
}: ConfirmModalProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onCancel();
  }, [onCancel]);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <>
      <style>{`
        @keyframes confirmModalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      <div style={backdropStyle} onClick={onCancel}>
        <div style={modalStyle} onClick={e => e.stopPropagation()}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>{title}</h2>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px', lineHeight: 1.5 }}>{message}</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              onClick={onCancel}
              style={{
                padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px',
                background: 'var(--bg-card, white)', cursor: 'pointer', fontSize: '14px', fontWeight: 500,
                color: '#475569',
              }}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              style={{
                padding: '10px 20px', border: 'none', borderRadius: '8px',
                cursor: 'pointer', fontSize: '14px', fontWeight: 500,
                background: danger ? '#dc2626' : '#2563eb',
                color: 'white',
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
