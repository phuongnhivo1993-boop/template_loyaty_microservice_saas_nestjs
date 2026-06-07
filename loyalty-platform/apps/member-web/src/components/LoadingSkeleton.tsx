'use client';

function Skeleton({ width, height, style }: { width?: string | number; height?: string | number; style?: React.CSSProperties }) {
  return (
    <div
      className="skeleton"
      style={{
        width: width || '100%',
        height: height || 20,
        borderRadius: 8,
        background: 'linear-gradient(90deg, var(--bg-secondary, #e2e8f0) 25%, var(--skeleton-shimmer, #f1f5f9) 50%, var(--bg-secondary, #e2e8f0) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        ...style,
      }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="card" style={{ padding: 24 }}>
      <Skeleton width="60%" height={24} style={{ marginBottom: 16 }} />
      <Skeleton height={16} style={{ marginBottom: 8 }} />
      <Skeleton width="80%" height={16} style={{ marginBottom: 8 }} />
      <Skeleton width="40%" height={16} />
    </div>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card" style={{ padding: '0 20px' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 0',
            borderBottom: i < rows - 1 ? '1px solid var(--border, #e2e8f0)' : 'none',
          }}
        >
          <div style={{ flex: 1 }}>
            <Skeleton width="50%" height={16} style={{ marginBottom: 6 }} />
            <Skeleton width="30%" height={12} />
          </div>
          <Skeleton width={60} height={16} />
        </div>
      ))}
    </div>
  );
}

export { Skeleton };
export default Skeleton;
