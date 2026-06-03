'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';
import { DetailSkeleton } from '@/components/LoadingSkeleton';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';
import { FormInput, FormActions } from '@/components/FormField';
import { getStore, getStoreStaff, addStoreStaff, updateStoreStaff, deleteStoreStaff } from '@/lib/api';

export default function StoreDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [store, setStore] = useState<any>(null);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [staffForm, setStaffForm] = useState({ fullName: '', email: '', phone: '', role: 'STAFF' });
  const [staffLoading, setStaffLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [storeData, staffData] = await Promise.all([
        getStore(id as string),
        getStoreStaff(id as string),
      ]);
      setStore(storeData);
      setStaff(Array.isArray(staffData) ? staffData : []);
    } catch { showToast('Failed to load store', 'error'); }
    setLoading(false);
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.push('/login'); return; }
    load();
  }, [id]);

  const openAddStaff = () => { setEditingStaff(null); setStaffForm({ fullName: '', email: '', phone: '', role: 'STAFF' }); setShowStaffModal(true); };
  const openEditStaff = (s: any) => {
    setEditingStaff(s);
    setStaffForm({ fullName: s.fullName || '', email: s.email || '', phone: s.phone || '', role: s.role || 'STAFF' });
    setShowStaffModal(true);
  };

  const handleDeleteStaff = async (staffId: string) => {
    if (!confirm('Remove this staff member?')) return;
    try {
      await deleteStoreStaff(staffId);
      showToast('Staff removed successfully', 'success');
      load();
    } catch { showToast('Failed to remove staff', 'error'); }
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStaffLoading(true);
    try {
      if (editingStaff) {
        await updateStoreStaff(editingStaff.id, staffForm);
        showToast('Staff updated successfully', 'success');
      } else {
        await addStoreStaff(id as string, staffForm);
        showToast('Staff added successfully', 'success');
      }
      setShowStaffModal(false);
      load();
    } catch { showToast('Operation failed', 'error'); }
    setStaffLoading(false);
  };

  const staffColumns = [
    { key: 'fullName', label: 'Full Name', render: (s: any) => <span className="font-medium">{s.fullName}</span> },
    { key: 'email', label: 'Email', render: (s: any) => <span>{s.email || '-'}</span> },
    { key: 'phone', label: 'Phone', render: (s: any) => <span>{s.phone || '-'}</span> },
    { key: 'role', label: 'Role', render: (s: any) => <span className="status-badge">{s.role}</span> },
    { key: 'actions', label: 'Actions', render: (s: any) => (
      <>
        <button onClick={() => openEditStaff(s)} className="btn-secondary btn-sm" style={{ marginRight: '8px' }}>Edit</button>
        <button onClick={() => handleDeleteStaff(s.id)} className="btn-danger btn-sm">Remove</button>
      </>
    )},
  ];

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><DetailSkeleton /></main></div>;
  if (!store) return <div className="page-layout"><Sidebar /><main className="main-content"><p>Store not found</p></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <button onClick={() => router.back()} className="btn-secondary">← Back</button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', margin: '24px 0' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700 }}>{store.name}</h1>
            <p style={{ color: '#64748b' }}>{store.code && `Code: ${store.code}`}</p>
          </div>
          <span className={`status-badge ${(store.status || 'ACTIVE').toLowerCase()}`}>{store.status || 'ACTIVE'}</span>
        </div>

        <div className="grid-4" style={{ gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Address', value: store.address || 'N/A', color: '#2563eb', bg: '#eff6ff' },
            { label: 'Phone', value: store.phone || 'N/A', color: '#7c3aed', bg: '#f5f3ff' },
            { label: 'Email', value: store.email || 'N/A', color: '#d97706', bg: '#fffbeb' },
            { label: 'Opening Hours', value: store.openingHours || 'N/A', color: '#16a34a', bg: '#f0fdf4' },
          ].map((stat, i) => (
            <div key={i} style={{ background: stat.bg, borderRadius: '12px', padding: '20px' }}>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>{stat.label}</p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Staff</h2>
            <button onClick={openAddStaff} className="btn-primary btn-sm">+ Add Staff</button>
          </div>
          <DataTable columns={staffColumns} data={staff} emptyMessage="No staff assigned" />
        </div>

        <div className="card">
          <h2 className="card-title">Store Details</h2>
          <table className="detail-table">
            <tbody>
              {[
                { label: 'ID', value: store.id },
                { label: 'Name', value: store.name },
                { label: 'Code', value: store.code || 'N/A' },
                { label: 'Address', value: store.address || 'N/A' },
                { label: 'Phone', value: store.phone || 'N/A' },
                { label: 'Email', value: store.email || 'N/A' },
                { label: 'Opening Hours', value: store.openingHours || 'N/A' },
                { label: 'Status', value: store.status },
                { label: 'Created At', value: new Date(store.createdAt).toLocaleString() },
                { label: 'Updated At', value: new Date(store.updatedAt).toLocaleString() },
              ].map((row, i) => (
                <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px', color: '#64748b' }}>{row.label}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#475569' }}>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal open={showStaffModal} title={editingStaff ? 'Edit Staff' : 'Add Staff'} onClose={() => setShowStaffModal(false)} width={440}>
          <form onSubmit={handleStaffSubmit}>
            <FormInput label="Full Name" value={staffForm.fullName} onChange={v => setStaffForm({ ...staffForm, fullName: v })} required />
            <div className="grid-2">
              <FormInput label="Email" type="email" value={staffForm.email} onChange={v => setStaffForm({ ...staffForm, email: v })} />
              <FormInput label="Phone" value={staffForm.phone} onChange={v => setStaffForm({ ...staffForm, phone: v })} />
            </div>
            <FormActions onCancel={() => setShowStaffModal(false)} loading={staffLoading} submitLabel={editingStaff ? 'Save' : 'Add'} />
          </form>
        </Modal>
      </main>
    </div>
  );
}
