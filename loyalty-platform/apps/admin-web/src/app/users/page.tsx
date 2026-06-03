'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import Pagination from '@/components/Pagination';
import Modal from '@/components/Modal';
import ImportModal from '@/components/ImportModal';
import { FormInput, FormSelect, FormTextarea, FormActions } from '@/components/FormField';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import { getUsers, createUser, updateUser, deleteUser } from '@/lib/api';

interface UserForm {
  email: string; fullName: string; phone: string; role: string;
}

const emptyForm: UserForm = { email: '', fullName: '', phone: '', role: 'MEMBER' };

const roles = ['HOST', 'ADMIN', 'STAFF', 'MEMBER'];

export default function UsersPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;
  const [showImport, setShowImport] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const result = await getUsers({ page, limit, search: search || undefined, role: roleFilter !== 'ALL' ? roleFilter : undefined });
      setUsers(result.data);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) { router.push('/login'); return; }
    load();
  }, [search, page, roleFilter]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (u: any) => {
    setEditing(u);
    setForm({ email: u.email, fullName: u.fullName || '', phone: u.phone || '', role: u.role });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      showToast('User deleted successfully', 'success');
      load();
    } catch { showToast('Network error', 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateUser(editing.id, form);
      } else {
        await createUser(form);
      }
      showToast(editing ? 'User updated successfully' : 'User created successfully', 'success');
      setShowModal(false);
      load();
    } catch { showToast('Network error', 'error'); }
  };

  const exportCsv = async () => {
    const result = await getUsers({ page: 1, limit: 10000, search: search || undefined });
    const data = result.data;
    const cols = ['email', 'fullName', 'phone', 'role'];
    const rows = data.map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
    const url = URL.createObjectURL(new Blob([[cols.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = 'users.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const columns = [
    { key: 'email', label: 'Email', render: (u: any) => <span className="font-medium">{u.email}</span> },
    { key: 'fullName', label: 'Full Name', render: (u: any) => <span className="text-muted">{u.fullName}</span> },
    { key: 'phone', label: 'Phone', render: (u: any) => <span className="text-muted">{u.phone}</span> },
    { key: 'role', label: 'Role', render: (u: any) => (
      <span className={`status-badge ${u.role === 'HOST' ? 'host' : u.role === 'ADMIN' ? 'active' : u.role === 'STAFF' ? 'staff' : ''}`}>{u.role}</span>
    )},
    { key: 'actions', label: 'Actions', render: (u: any) => (
      <>
        <button onClick={() => router.push(`/users/${u.id}`)} className="btn-primary btn-sm" style={{ marginRight: '8px' }}>View</button>
        <button onClick={() => openEdit(u)} className="btn-secondary btn-sm" style={{ marginRight: '8px' }}>Edit</button>
        <button onClick={() => handleDelete(u.id)} className="btn-danger btn-sm">Delete</button>
      </>
    )},
  ];

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><TableSkeleton rows={5} cols={5} /></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <PageHeader
          title="Users"
          subtitle="Manage system users"
          actions={<button onClick={openCreate} className="btn-primary">+ New User</button>}
        />

        <div className="toolbar">
          <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="filter-select">
            <option value="ALL">All Roles</option>
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <input type="text" placeholder="Search..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="search-input" />
          <span className="text-muted">{total > 0 ? `${total} results` : ''}</span>
          <button onClick={() => setShowImport(true)} className="btn-secondary">Import CSV</button>
          <button onClick={exportCsv} className="btn-secondary">Export CSV</button>
        </div>

        <DataTable columns={columns} data={users} emptyMessage="No users found" />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

        <Modal open={showModal} title={editing ? 'Edit User' : 'New User'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <FormInput label="Email" value={form.email} onChange={e => setForm({ ...form, email: e })} required type="email" />
            <FormInput label="Full Name" value={form.fullName} onChange={e => setForm({ ...form, fullName: e })} required />
            <FormInput label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e })} />
            <FormSelect label="Role" value={form.role} onChange={e => setForm({ ...form, role: e })} options={roles.map(r => ({ value: r, label: r }))} />
            <FormActions onCancel={() => setShowModal(false)} loading={false} submitLabel={editing ? 'Save' : 'Create'} />
          </form>
        </Modal>
        <ImportModal open={showImport} onClose={() => setShowImport(false)} entity="users" entityLabel="users" onImportComplete={load} />
      </main>
    </div>
  );
}
