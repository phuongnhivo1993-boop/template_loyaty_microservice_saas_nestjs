'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

interface UserForm {
  email: string; fullName: string; phone: string; role: string;
}

const emptyForm: UserForm = { email: '', fullName: '', phone: '', role: 'MEMBER' };

const roles = ['HOST', 'ADMIN', 'STAFF', 'MEMBER'];

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set('search', search);
      const res = await fetch(`/api/users?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      setUsers(Array.isArray(result) ? result : result.data || []);
      setTotalPages(result.totalPages || 1);
      setTotal(result.total || 0);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    load();
  }, [search, page]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (u: any) => {
    setEditing(u);
    setForm({ email: u.email, fullName: u.fullName || '', phone: u.phone || '', role: u.role });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    await fetch(`/api/users/${id}`, { method: 'DELETE', headers });
    load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editing ? `/api/users/${editing.id}` : '/api/users';
    const method = editing ? 'PUT' : 'POST';
    await fetch(url, { method, headers, body: JSON.stringify(form) });
    setShowModal(false);
    load();
  };

  const modal = showModal && (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }} onClick={() => setShowModal(false)}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '32px', width: '480px', maxHeight: '80vh', overflow: 'auto' }}
        onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>{editing ? 'Edit User' : 'New User'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Full Name</label>
            <input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Phone</label>
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Role</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}>
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button type="button" onClick={() => setShowModal(false)}
              style={{ padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer' }}>Cancel</button>
            <button type="submit"
              style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
              {editing ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (loading) return <div style={{ display: 'flex', minHeight: '100vh' }}><Sidebar /><main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>Loading...</main></div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700 }}>Users</h1>
            <p style={{ color: '#64748b' }}>Manage system users</p>
          </div>
          <button onClick={openCreate} style={{
            padding: '10px 20px', background: '#2563eb', color: 'white',
            border: 'none', borderRadius: '8px', fontWeight: 500, cursor: 'pointer',
          }}>+ New User</button>
        </div>

        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="text" placeholder="Search..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ padding: '10px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', flex: 1, maxWidth: '360px' }}
          />
          <span style={{ color: '#64748b', fontSize: '14px' }}>{total > 0 ? `${total} results` : ''}</span>
          <button onClick={async () => {
            const params = new URLSearchParams({ page: '1', limit: '10000' });
            if (search) params.set('search', search);
            const res = await fetch(`/api/users?${params}`, { headers: { Authorization: `Bearer ${token}` } });
            const result = await res.json();
            const data = Array.isArray(result) ? result : result.data || [];
            const cols = ['email', 'fullName', 'phone', 'role'];
            const header = cols.join(',');
            const rows = data.map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
            const csv = [header, ...rows].join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = 'users.csv'; a.click(); URL.revokeObjectURL(url);
          }} style={{ padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Export CSV</button>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Email</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Full Name</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Phone</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Role</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No users found</td></tr>
              ) : users.map((u: any) => (
                <tr key={u.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>{u.email}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{u.fullName}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{u.phone}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600,
                      background: u.role === 'HOST' ? '#e0e7ff' : u.role === 'ADMIN' ? '#dcfce7' : u.role === 'STAFF' ? '#fef9c3' : '#f1f5f9',
                      color: u.role === 'HOST' ? '#4338ca' : u.role === 'ADMIN' ? '#16a34a' : u.role === 'STAFF' ? '#a16207' : '#64748b',
                    }}>{u.role}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => openEdit(u)} style={{ marginRight: '8px', padding: '6px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '13px' }}>Edit</button>
                    <button onClick={() => handleDelete(u.id)} style={{ padding: '6px 14px', border: '1px solid #fca5a5', borderRadius: '6px', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
              style={{ padding: '8px 16px', border: '1px solid #cbd5e1', borderRadius: '6px', background: page <= 1 ? '#f1f5f9' : 'white', cursor: page <= 1 ? 'not-allowed' : 'pointer', color: page <= 1 ? '#94a3b8' : '#475569', fontWeight: 500 }}>Previous</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const start = Math.max(1, Math.min(page - 2, totalPages - 4));
              const p = start + i;
              if (p > totalPages) return null;
              return (
                <button key={p} onClick={() => setPage(p)}
                  style={{ padding: '8px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', background: p === page ? '#2563eb' : 'white', color: p === page ? 'white' : '#475569', cursor: 'pointer', fontWeight: 600 }}>{p}</button>
              );
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
              style={{ padding: '8px 16px', border: '1px solid #cbd5e1', borderRadius: '6px', background: page >= totalPages ? '#f1f5f9' : 'white', cursor: page >= totalPages ? 'not-allowed' : 'pointer', color: page >= totalPages ? '#94a3b8' : '#475569', fontWeight: 500 }}>Next</button>
          </div>
        )}
        {modal}
      </main>
    </div>
  );
}
