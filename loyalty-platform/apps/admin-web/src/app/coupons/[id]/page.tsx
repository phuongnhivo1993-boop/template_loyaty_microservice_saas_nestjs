'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { DetailSkeleton } from '@/components/LoadingSkeleton';
import { useToast } from '@/components/Toast';
import Modal from '@/components/Modal';
import { FormInput, FormSelect, FormActions } from '@/components/FormField';
import { api } from '@/lib/api';

export default function CouponDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [coupon, setCoupon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    api.get(`/coupons/${params.id}`)
      .then(data => { setCoupon(data); setEditing(data); })
      .catch(() => showToast('Failed to load coupon', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.push('/login'); return; }
    load();
  }, [params.id]);

  const openEdit = () => {
    if (!coupon) return;
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value?.toString() || '',
      minAmount: coupon.minAmount?.toString() || '',
      maxDiscount: coupon.maxDiscount?.toString() || '',
      maxUsage: coupon.maxUsage?.toString() || '',
      maxUsagePerMember: (coupon.maxUsagePerMember ?? 1).toString(),
      description: coupon.description || '',
      startDate: coupon.startDate ? coupon.startDate.slice(0, 16) : '',
      endDate: coupon.endDate ? coupon.endDate.slice(0, 16) : '',
      status: coupon.status,
    });
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this coupon?')) return;
    try {
      await api.delete(`/coupons/${params.id}`);
      showToast('Coupon deleted', 'success');
      router.push('/coupons');
    } catch { showToast('Failed to delete', 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data: any = {
        code: form.code, type: form.type, value: Number(form.value),
        minAmount: form.minAmount ? Number(form.minAmount) : undefined,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
        maxUsage: form.maxUsage ? Number(form.maxUsage) : undefined,
        maxUsagePerMember: Number(form.maxUsagePerMember),
        description: form.description || undefined,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        status: form.status,
      };
      await api.update(`/coupons/${params.id}`, data);
      showToast('Coupon updated', 'success');
      setShowEditModal(false);
      load();
    } catch (err: any) { showToast(err.message || 'Error', 'error'); }
    setSubmitting(false);
  };

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><DetailSkeleton /></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <button onClick={() => router.push('/coupons')} className="btn-secondary">← Back to Coupons</button>

        {coupon ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'monospace' }}>{coupon.code}</h1>
                <p style={{ color: '#64748b', marginTop: '4px' }}>{coupon.description || 'No description'}</p>
              </div>
              <span className="status-badge" style={{
                background: coupon.status === 'ACTIVE' ? '#dcfce7' : coupon.status === 'EXPIRED' ? '#f1f5f9' : '#fef2f2',
                color: coupon.status === 'ACTIVE' ? '#16a34a' : coupon.status === 'EXPIRED' ? '#94a3b8' : '#dc2626',
              }}>{coupon.status}</span>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <button onClick={openEdit} className="btn-primary">Edit Coupon</button>
              <button onClick={handleDelete} className="btn-danger">Delete Coupon</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Details</h2>
                <div style={{ marginBottom: '12px' }}><strong>Type:</strong> {coupon.type}</div>
                <div style={{ marginBottom: '12px' }}><strong>Value:</strong> {coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : `${Number(coupon.value).toLocaleString()} VND`}</div>
                <div style={{ marginBottom: '12px' }}><strong>Min Amount:</strong> {coupon.minAmount ? `${Number(coupon.minAmount).toLocaleString()} VND` : '-'}</div>
                <div style={{ marginBottom: '12px' }}><strong>Max Discount:</strong> {coupon.maxDiscount ? `${Number(coupon.maxDiscount).toLocaleString()} VND` : '-'}</div>
                <div style={{ marginBottom: '12px' }}><strong>Start Date:</strong> {coupon.startDate ? new Date(coupon.startDate).toLocaleString() : '-'}</div>
                <div style={{ marginBottom: '12px' }}><strong>End Date:</strong> {coupon.endDate ? new Date(coupon.endDate).toLocaleString() : '-'}</div>
              </div>
              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Usage Stats</h2>
                <div style={{ marginBottom: '12px' }}><strong>Max Usage:</strong> {coupon.maxUsage ?? 'Unlimited'}</div>
                <div style={{ marginBottom: '12px' }}><strong>Used Count:</strong> {coupon.usedCount || 0}</div>
                <div style={{ marginBottom: '12px' }}><strong>Max Usage Per Member:</strong> {coupon.maxUsagePerMember ?? 1}</div>
                <div style={{ marginBottom: '12px' }}><strong>Total Discount Given:</strong> {coupon.totalDiscountGiven != null ? `${Number(coupon.totalDiscountGiven).toLocaleString()} VND` : '-'}</div>
              </div>
            </div>
          </>
        ) : (
          <p style={{ color: '#dc2626' }}>Coupon not found</p>
        )}

        <Modal open={showEditModal} title="Edit Coupon" onClose={() => setShowEditModal(false)}>
          <form onSubmit={handleSubmit}>
            <FormInput label="Coupon Code" value={form.code} onChange={(v: string) => setForm({ ...form, code: v })} required placeholder="e.g. SUMMER20" />
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <FormSelect label="Type" value={form.type} onChange={(v: string) => setForm({ ...form, type: v })} options={[
                  { value: 'PERCENTAGE', label: 'Percentage (%)' },
                  { value: 'FIXED', label: 'Fixed Amount (VND)' },
                ]} />
              </div>
              <div style={{ flex: 1 }}>
                <FormInput label={form.type === 'PERCENTAGE' ? 'Value (%)' : 'Value (VND)'} type="number" value={form.value} onChange={(v: string) => setForm({ ...form, value: v })} required />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <FormInput label="Min Amount (VND)" type="number" value={form.minAmount} onChange={(v: string) => setForm({ ...form, minAmount: v })} />
              </div>
              <div style={{ flex: 1 }}>
                {form.type === 'PERCENTAGE' && (
                  <FormInput label="Max Discount (VND)" type="number" value={form.maxDiscount} onChange={(v: string) => setForm({ ...form, maxDiscount: v })} />
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <FormInput label="Max Uses" type="number" value={form.maxUsage} onChange={(v: string) => setForm({ ...form, maxUsage: v })} />
              </div>
              <div style={{ flex: 1 }}>
                <FormInput label="Max/Member" type="number" value={form.maxUsagePerMember} onChange={(v: string) => setForm({ ...form, maxUsagePerMember: v })} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <FormInput label="Start Date" type="datetime-local" value={form.startDate} onChange={(v: string) => setForm({ ...form, startDate: v })} />
              </div>
              <div style={{ flex: 1 }}>
                <FormInput label="End Date" type="datetime-local" value={form.endDate} onChange={(v: string) => setForm({ ...form, endDate: v })} />
              </div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label className="form-label">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="form-input" rows={2} />
            </div>
            <FormActions onCancel={() => setShowEditModal(false)} loading={submitting} submitLabel="Update" />
          </form>
        </Modal>
      </main>
    </div>
  );
}
