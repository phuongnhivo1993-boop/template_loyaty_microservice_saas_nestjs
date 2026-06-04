'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { DetailSkeleton } from '@/components/LoadingSkeleton';
import { useToast } from '@/components/Toast';
import Modal from '@/components/Modal';
import { FormInput, FormSelect, FormActions } from '@/components/FormField';
import { getGiftCard, updateGiftCard } from '@/lib/api';

export default function GiftCardDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [form, setForm] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    getGiftCard(params.id)
      .then(data => setCard(data))
      .catch(() => showToast('Failed to load gift card', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) { router.push('/login'); return; }
    load();
  }, [params.id]);

  const openEdit = () => {
    if (!card) return;
    setForm({
      code: card.code || '',
      initialValue: card.initialValue?.toString() || '',
      type: card.type || 'PHYSICAL',
      expiryDate: card.expiryDate?.slice(0, 10) || '',
      status: card.status || 'ACTIVE',
    });
    setShowEditModal(true);
  };

  const handleDeactivate = async () => {
    if (!confirm('Deactivate this gift card?')) return;
    try {
      await updateGiftCard(params.id, { status: 'INACTIVE' });
      showToast('Gift card deactivated', 'success');
      load();
    } catch { showToast('Operation failed', 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const body = { ...form, initialValue: Number(form.initialValue), expiryDate: form.expiryDate || undefined };
      await updateGiftCard(params.id, body);
      showToast('Gift card updated', 'success');
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
        <button onClick={() => router.push('/gift-cards')} className="btn-secondary">← Back to Gift Cards</button>

        {card ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'monospace' }}>{card.code || card.id.slice(0, 8)}</h1>
                <p style={{ color: '#64748b', marginTop: '4px' }}>Type: {card.type}</p>
              </div>
              <span className="status-badge" style={{
                background: card.status === 'ACTIVE' ? '#dcfce7' : card.status === 'REDEEMED' ? '#f1f5f9' : '#fef2f2',
                color: card.status === 'ACTIVE' ? '#16a34a' : card.status === 'REDEEMED' ? '#94a3b8' : '#dc2626',
              }}>{card.status || 'ACTIVE'}</span>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <button onClick={openEdit} className="btn-primary">Edit Gift Card</button>
              <button onClick={handleDeactivate} className="btn-danger">Deactivate</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Card Details</h2>
                <div style={{ marginBottom: '12px' }}><strong>Code:</strong> <span style={{ fontFamily: 'monospace' }}>{card.code || '-'}</span></div>
                <div style={{ marginBottom: '12px' }}><strong>Type:</strong> {card.type}</div>
                <div style={{ marginBottom: '12px' }}><strong>Initial Value:</strong> {Number(card.initialValue || 0).toLocaleString()} VND</div>
                <div style={{ marginBottom: '12px' }}><strong>Balance:</strong> <span style={{ fontWeight: 600, color: Number(card.balance || 0) > 0 ? '#16a34a' : '#dc2626' }}>{Number(card.balance || 0).toLocaleString()} VND</span></div>
                <div style={{ marginBottom: '12px' }}><strong>Status:</strong> {card.status}</div>
                <div style={{ marginBottom: '12px' }}><strong>Expires At:</strong> {card.expiryDate ? new Date(card.expiryDate).toLocaleDateString() : '-'}</div>
              </div>
              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Assignment</h2>
                <div style={{ marginBottom: '12px' }}><strong>Assigned To:</strong> {card.assignedTo?.fullName || card.assignedTo?.email || card.memberId || 'Unassigned'}</div>
                <div style={{ marginBottom: '12px' }}><strong>Member ID:</strong> {card.memberId || '-'}</div>
              </div>
            </div>
          </>
        ) : (
          <p style={{ color: '#dc2626' }}>Gift card not found</p>
        )}

        <Modal open={showEditModal} title="Edit Gift Card" onClose={() => setShowEditModal(false)} width={520}>
          <form onSubmit={handleSubmit}>
            <FormInput label="Code" value={form.code} onChange={v => setForm({ ...form, code: v })} />
            <FormInput label="Initial Value (VND)" type="number" value={form.initialValue} onChange={v => setForm({ ...form, initialValue: v })} required />
            <FormSelect label="Type" value={form.type} onChange={v => setForm({ ...form, type: v })} options={[
              { value: 'PHYSICAL', label: 'Physical' },
              { value: 'DIGITAL', label: 'Digital' },
            ]} />
            <FormInput label="Expiry Date" type="date" value={form.expiryDate} onChange={v => setForm({ ...form, expiryDate: v })} />
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
