'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export default function Button({
  children, variant = 'primary', size = 'md',
  loading, disabled, style, ...props
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 600,
    borderRadius: '8px',
    cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
    opacity: (disabled || loading) ? 0.7 : 1,
    transition: 'all 0.2s',
    border: 'none',
    fontSize: size === 'sm' ? '13px' : size === 'lg' ? '16px' : '14px',
    padding: size === 'sm' ? '8px 16px' : size === 'lg' ? '14px 28px' : '10px 20px',
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: { background: 'var(--primary, #3b82f6)', color: 'white' },
    secondary: { background: 'var(--bg-secondary, #f1f5f9)', color: 'var(--text-primary, #1e293b)' },
    outline: { background: 'transparent', color: 'var(--primary, #3b82f6)', border: '2px solid var(--primary, #3b82f6)' },
    danger: { background: '#dc2626', color: 'white' },
  };

  return (
    <button
      style={{ ...baseStyle, ...variants[variant], ...style }}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />}
      {children}
    </button>
  );
}
