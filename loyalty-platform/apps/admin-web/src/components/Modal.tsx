'use client';
import { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  width?: number;
}

export default function Modal({ open, title, onClose, children, width = 480 }: ModalProps) {
  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }} onClick={onClose}>
      <div style={{
        background: 'white', borderRadius: '12px', padding: '32px', width: `${width}px`,
        maxHeight: '80vh', overflow: 'auto',
      }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>{title}</h2>
        {children}
      </div>
    </div>
  );
}
