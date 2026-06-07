'use client';
import { useState } from 'react';
import ConfirmModal from '@/components/ConfirmModal';

interface UseConfirmDeleteOptions {
  title?: string;
  message?: string;
  onConfirm: () => void;
}

export function useConfirmDelete({ title = 'Confirm Delete', message = 'Are you sure you want to delete this item?', onConfirm }: UseConfirmDeleteOptions) {
  const [isOpen, setIsOpen] = useState(false);

  const confirmDelete = () => setIsOpen(true);

  const modal = isOpen ? (
    <ConfirmModal
      open={true}
      title={title}
      message={message}
      onConfirm={() => { onConfirm(); setIsOpen(false); }}
      onCancel={() => setIsOpen(false)}
      danger
    />
  ) : null;

  return { confirmDelete, modal };
}
