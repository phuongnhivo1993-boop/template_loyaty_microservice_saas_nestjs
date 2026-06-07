import React from 'react';

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export default function Card({ children, style, className = '' }: CardProps) {
  return (
    <div
      className={`card ${className}`}
      style={{
        background: 'var(--bg-card, white)',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
