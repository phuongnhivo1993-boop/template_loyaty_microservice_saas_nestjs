'use client';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  actions?: ReactNode;
}

export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: 700 }}>{title}</h1>
        <p style={{ color: '#64748b' }}>{subtitle}</p>
      </div>
      {actions}
    </div>
  );
}
