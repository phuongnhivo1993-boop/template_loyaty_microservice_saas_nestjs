'use client';

import { useState } from 'react';
import { useToast } from '@/components/Toast';
import ConfirmModal from '@/components/ConfirmModal';

export interface BulkAction {
  label: string;
  icon?: string;
  variant?: 'primary' | 'danger' | 'warning';
  confirmMessage?: string;
  onClick: (ids: string[]) => Promise<void>;
}

interface BulkActionsToolbarProps {
  selectedIds: string[];
  onClear: () => void;
  actions: BulkAction[];
  onSuccess?: () => void;
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary: { background: '#2563eb', color: 'white', border: 'none' },
  danger: { background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5' },
  warning: { background: '#fef9c3', color: '#a16207', border: '1px solid #fde68a' },
};

export default function BulkActionsToolbar({ selectedIds, onClear, actions, onSuccess }: BulkActionsToolbarProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState<BulkAction | null>(null);

  if (selectedIds.length === 0) return null;

  const handleAction = (action: BulkAction) => {
    if (action.confirmMessage) {
      setConfirmAction(action);
      return;
    }
    executeAction(action);
  };

  const executeAction = async (action: BulkAction) => {
    setLoading(true);
    try {
      await action.onClick(selectedIds);
      showToast(`Đã thực hiện "${action.label}" cho ${selectedIds.length} mục`, 'success');
      onClear();
      onSuccess?.();
    } catch {
      showToast('Lỗi mạng', 'error');
    }
    setLoading(false);
    setConfirmAction(null);
  };

  return (
    <>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px',
        background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px',
        marginBottom: '16px',
      }}>
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e40af' }}>
          Đã chọn {selectedIds.length} mục
        </span>
        {actions.map((action, i) => {
          const vs = variantStyles[action.variant || 'primary'];
          return (
            <button
              key={i}
              onClick={() => handleAction(action)}
              disabled={loading}
              style={{
                padding: '6px 16px', borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '13px', fontWeight: 500,
                opacity: loading ? 0.6 : 1,
                display: 'flex', alignItems: 'center', gap: '4px',
                ...vs,
              }}
            >
              {loading ? 'Đang xử lý...' : <>{action.icon && <span>{action.icon}</span>}{action.label}</>}
            </button>
          );
        })}
        <button
          onClick={onClear}
          style={{
            padding: '6px 16px', border: 'none', borderRadius: '6px',
            background: 'transparent', cursor: 'pointer', fontSize: '13px',
            color: '#64748b', marginLeft: 'auto',
          }}
        >
          Bỏ chọn
        </button>
      </div>

      {confirmAction && (
        <ConfirmModal
          open
          title={confirmAction.confirmMessage || 'Xác nhận'}
          message={`Bạn có chắc chắn muốn "${confirmAction.label.toLowerCase()}" cho ${selectedIds.length} mục đã chọn? Hành động này không thể hoàn tác.`}
          onConfirm={() => executeAction(confirmAction)}
          onCancel={() => setConfirmAction(null)}
          confirmText="Xác nhận"
          cancelText="Hủy"
          danger={confirmAction.variant === 'danger'}
        />
      )}
    </>
  );
}
