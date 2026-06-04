'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { DetailSkeleton } from '@/components/LoadingSkeleton';
import { useToast } from '@/components/Toast';
import Modal from '@/components/Modal';
import { FormInput, FormSelect, FormTextarea, FormActions } from '@/components/FormField';
import { getCashbackConfig, updateCashbackConfig, deleteCashbackConfig } from '@/lib/api';

export default function CashbackDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [form, setForm] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    getCashbackConfig(params.id)
      .then(data => setConfig(data))
      .catch(() => showToast('Failed to load config', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) { router.push('/login'); return; }
    load();
  }, [params.id]);

  const openEdit = () => {
    if (!config) return;
    setForm({
      name: config.name,
      description: config.description || '',
      rate: config.rate?.toString() || '',
      minAmount: config.minAmount?.toString() || '',
      maxAmount: config.maxAmount?.toString() || '',
      minPointsBalance: config.minPointsBalance?.toString() || '',
      startDate: config.startDate ? config.startDate.slice(0, 10) : '',
      endDate: config.endDate ? config.endDate.slice(0, 10) : '',
      status: config.status || 'ACTIVE',
    });
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this cashback config?')) return;
    try {
      await deleteCashbackConfig(params.id);
      showToast('Cashback config deleted', 'success');
      router.push('/cashback');
    } catch { showToast('Failed to delete', 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const body = {
        ...form,
        rate: Number(form.rate),
        minAmount: form.minAmount ? Number(form.minAmount) : undefined,
        maxAmount: form.maxAmount ? Number(form.maxAmount) : undefined,
        minPointsBalance: form.minPointsBalance ? Number(form.minPointsBalance) : undefined,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
      };
      await updateCashbackConfig(params.id, body);
      showToast('Cashback config updated', 'success');
      setShowEditModal(false);
      load();
    } catch { showToast('Operation failed', 'error'); }
    setSubmitting(false);
  };

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><DetailSkeleton /></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <button onClick={() => router.push('/cashback')} className="btn-secondary">← Back to Cashback Configs</button>

        {config ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 700 }}>{config.name}</h1>
                <p style={{ color: '#64748b', marginTop: '4px' }}>{config.description || 'No description'}</p>
              </div>
              <span className="status-badge" style={{
                background: config.status === 'ACTIVE' ? '#dcfce7' : '#fef2f2',
                color: config.status === 'ACTIVE' ? '#16a34a' : '#dc2626',
              }}>{config.status || 'ACTIVE'}</span>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <button onClick={openEdit} className="btn-primary">Edit Config</button>
              <button onClick={handleDelete} className="btn-danger">Delete Config</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Configuration</h2>
                <div style={{ marginBottom: '12px' }}><strong>Rate:</strong> <span style={{ fontWeight: 600, color: '#2563eb' }}>{config.rate}%</span></div>
                <div style={{ marginBottom: '12px' }}><strong>Min Amount:</strong> {config.minAmount != null ? `${Number(config.minAmount).toLocaleString()} VND` : '-'}</div>
                <div style={{ marginBottom: '12px' }}><strong>Max Amount:</strong> {config.maxAmount != null ? `${Number(config.maxAmount).toLocaleString()} VND` : '-'}</div>
                <div style={{ marginBottom: '12px' }}><strong>Min Points Balance:</strong> {config.minPointsBalance != null ? Number(config.minPointsBalance).toLocaleString() : '-'}</div>
              </div>
              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Schedule</h2>
                <div style={{ marginBottom: '12px' }}><strong>Start Date:</strong> {config.startDate ? new Date(config.startDate).toLocaleDateString() : '-'}</div>
                <div style={{ marginBottom: '12px' }}><strong>End Date:</strong> {config.endDate ? new Date(config.endDate).toLocaleDateString() : '-'}</div>
              </div>
            </div>
          </>
        ) : (
          <p style={{ color: '#dc2626' }}>Cashback config not found</p>
        )}

        <Modal open={showEditModal} title="Edit Cashback Config" onClose={() => setShowEditModal(false)} width={520}>
          <form onSubmit={handleSubmit}>
            <FormInput label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
            <FormTextarea label="Description" value={form.description} onChange={v => setForm({ ...form, description: v })} />
            <FormInput label="Cashback Rate (%)" type="number" value={form.rate} onChange={v => setForm({ ...form, rate: v })} required />
            <div className="grid-2">
              <FormInput label="Min Amount (VND)" type="number" value={form.minAmount} onChange={v => setForm({ ...form, minAmount: v })} />
              <FormInput label="Max Amount (VND)" type="number" value={form.maxAmount} onChange={v => setForm({ ...form, maxAmount: v })} />
            </div>
            <FormInput label="Min Points Balance" type="number" value={form.minPointsBalance} onChange={v => setForm({ ...form, minPointsBalance: v })} />
            <div className="grid-2">
              <FormInput label="Start Date" type="date" value={form.startDate} onChange={v => setForm({ ...form, startDate: v })} />
              <FormInput label="End Date" type="date" value={form.endDate} onChange={v => setForm({ ...form, endDate: v })} />
            </div>
            <FormSelect label="Status" value={form.status} onChange={v => setForm({ ...form, status: v })} options={[
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
            ]} />
            <FormActions onCancel={() => setShowEditModal(false)} loading={submitting} submitLabel="Save" />
          </form>
        </Modal>
      </main>
    </div>
  );
}
