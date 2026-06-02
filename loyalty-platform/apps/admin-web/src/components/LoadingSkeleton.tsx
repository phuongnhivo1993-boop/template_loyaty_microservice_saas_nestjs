'use client';

const shimmer = `
@keyframes shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}`;

const skeletonBase: React.CSSProperties = {
  background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
  backgroundSize: '200px 100%',
  borderRadius: '6px',
  animation: 'shimmer 1.5s ease-in-out infinite',
};

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
}

export function Skeleton({ width = '100%', height = 16, style }: SkeletonProps) {
  return (
    <>
      <style>{shimmer}</style>
      <div style={{ ...skeletonBase, width, height, ...style }} />
    </>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div style={{ background: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <style>{shimmer}</style>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{ display: 'flex', gap: '16px', padding: '12px 0', borderBottom: r < rows - 1 ? '1px solid #f1f5f9' : 'none' }}>
          {r === 0 && Array.from({ length: cols }).map((_, c) => (
            <div key={c} style={{ flex: 1 }}><Skeleton height={14} /></div>
          ))}
          {r > 0 && Array.from({ length: cols }).map((_, c) => (
            <div key={c} style={{ flex: 1 }}><Skeleton height={14} width={c === 0 ? '60%' : '80%'} /></div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <style>{shimmer}</style>
      <Skeleton height={32} width="40%" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
            <Skeleton height={12} width="50%" style={{ marginBottom: '8px' }} />
            <Skeleton height={24} width="70%" />
          </div>
        ))}
      </div>
    </div>
  );
}
