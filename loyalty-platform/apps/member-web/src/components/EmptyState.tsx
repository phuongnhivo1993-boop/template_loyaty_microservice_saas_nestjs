interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state" style={{
      textAlign: 'center',
      padding: '40px 20px',
    }}>
      <div className="empty-icon" style={{ fontSize: '48px', marginBottom: '12px' }}>{icon}</div>
      <div className="empty-text" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary, #1e293b)', marginBottom: '4px' }}>{title}</div>
      {description && <p style={{ fontSize: '14px', color: 'var(--text-secondary, #64748b)', marginTop: '4px' }}>{description}</p>}
      {action && (
        <button onClick={action.onClick} className="btn-primary" style={{ marginTop: '16px', padding: '10px 24px' }}>
          {action.label}
        </button>
      )}
    </div>
  );
}
