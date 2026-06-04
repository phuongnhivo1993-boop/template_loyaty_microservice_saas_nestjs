'use client';

import { useEffect, useState, useRef } from 'react';
import { getTenants } from '@/lib/api';

interface Tenant {
  id: string;
  name: string;
  domain: string;
  status: string;
}

export default function TenantSwitcher({
  currentTenantId,
  onSwitch,
}: {
  currentTenantId?: string;
  onSwitch: (tenantId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = tenants.find(t => t.id === currentTenantId);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getTenants({ page: 1, limit: 100, search: search || undefined })
      .then(r => setTenants(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open, search]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '8px 12px', background: '#1e293b', border: '1px solid #334155',
          borderRadius: '6px', color: '#e2e8f0', cursor: 'pointer', textAlign: 'left', fontSize: '13px',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}
      >
        <span>🏢</span>
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {current?.name || 'Select Tenant'}
        </span>
        <span>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px',
            background: '#1e293b', border: '1px solid #334155', borderRadius: '8px',
            maxHeight: '300px', overflow: 'auto', zIndex: 1000,
          }}
        >
          <div style={{ padding: '8px' }}>
            <input
              type="text"
              placeholder="Search tenants..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '6px 8px', background: '#0f172a', border: '1px solid #334155',
                borderRadius: '4px', color: '#e2e8f0', fontSize: '12px', outline: 'none',
              }}
              autoFocus
            />
          </div>

          {loading ? (
            <div style={{ padding: '12px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
              Loading...
            </div>
          ) : tenants.length === 0 ? (
            <div style={{ padding: '12px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
              No tenants found
            </div>
          ) : (
            tenants.map(t => (
              <button
                key={t.id}
                onClick={() => { onSwitch(t.id); setOpen(false); }}
                style={{
                  width: '100%', padding: '8px 12px', background: t.id === currentTenantId ? '#334155' : 'transparent',
                  border: 'none', color: '#e2e8f0', cursor: 'pointer', textAlign: 'left', fontSize: '13px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#334155')}
                onMouseLeave={e => (e.currentTarget.style.background = t.id === currentTenantId ? '#334155' : 'transparent')}
              >
                <span style={{ opacity: t.id === currentTenantId ? 1 : 0.5 }}>🏢</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{t.name}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{t.domain}</div>
                </div>
                {t.id === currentTenantId && <span style={{ color: '#22c55e', fontSize: '12px' }}>✓</span>}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
