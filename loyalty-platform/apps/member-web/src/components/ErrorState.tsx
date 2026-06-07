'use client';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div style={{
      background: 'var(--error-bg, #fef2f2)',
      color: 'var(--error, #dc2626)',
      padding: '16px 20px',
      borderRadius: '8px',
      border: '1px solid var(--error-border, #fecaca)',
      margin: '16px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      fontSize: '14px',
    }}>
      <span>{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            background: '#dc2626',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '13px',
            flexShrink: 0,
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
}
