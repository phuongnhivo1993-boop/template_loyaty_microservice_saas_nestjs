'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';
import { DetailSkeleton } from '@/components/LoadingSkeleton';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';
import { FormInput, FormSelect, FormTextarea, FormActions } from '@/components/FormField';
import { getPartnerBrand, getPartnerBrandRewards, createPartnerReward, updatePartnerReward, deletePartnerReward } from '@/lib/api';

interface RewardForm {
  name: string; description: string; pointsRequired: string; type: string; status: string;
}

const emptyRewardForm: RewardForm = { name: '', description: '', pointsRequired: '', type: 'DISCOUNT', status: 'ACTIVE' };

export default function PartnerBrandDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [brand, setBrand] = useState<any>(null);
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [editingReward, setEditingReward] = useState<any>(null);
  const [rewardForm, setRewardForm] = useState<RewardForm>(emptyRewardForm);
  const [rewardSubmitting, setRewardSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [brandData, rewardsData] = await Promise.all([
        getPartnerBrand(id as string),
        getPartnerBrandRewards(id as string),
      ]);
      setBrand(brandData);
      setRewards(Array.isArray(rewardsData) ? rewardsData : []);
    } catch { showToast('Failed to load brand', 'error'); }
    setLoading(false);
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.push('/login'); return; }
    load();
  }, [id]);

  const openAddReward = () => { setEditingReward(null); setRewardForm(emptyRewardForm); setShowRewardModal(true); };
  const openEditReward = (r: any) => {
    setEditingReward(r);
    setRewardForm({
      name: r.name, description: r.description || '', pointsRequired: r.pointsRequired?.toString() || '',
      type: r.type || 'DISCOUNT', status: r.status || 'ACTIVE',
    });
    setShowRewardModal(true);
  };

  const handleDeleteReward = async (rewardId: string) => {
    if (!confirm('Delete this partner reward?')) return;
    try {
      await deletePartnerReward(rewardId);
      showToast('Partner reward deleted successfully', 'success');
      load();
    } catch { showToast('Failed to delete reward', 'error'); }
  };

  const handleRewardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRewardSubmitting(true);
    try {
      const body = { ...rewardForm, pointsRequired: Number(rewardForm.pointsRequired) };
      if (editingReward) {
        await updatePartnerReward(editingReward.id, body);
        showToast('Reward updated successfully', 'success');
      } else {
        await createPartnerReward(id as string, body);
        showToast('Reward created successfully', 'success');
      }
      setShowRewardModal(false);
      load();
    } catch { showToast('Operation failed', 'error'); }
    setRewardSubmitting(false);
  };

  const rewardColumns = [
    { key: 'name', label: 'Name', render: (r: any) => <span className="font-medium">{r.name}</span> },
    { key: 'description', label: 'Description', render: (r: any) => <span className="text-muted">{r.description || '-'}</span> },
    { key: 'pointsRequired', label: 'Points Required', render: (r: any) => <span style={{ fontWeight: 600, color: '#2563eb' }}>{r.pointsRequired?.toLocaleString()} pts</span> },
    { key: 'type', label: 'Type', render: (r: any) => <span className="status-badge">{r.type}</span> },
    { key: 'status', label: 'Status', render: (r: any) => (
      <span className={`status-badge ${(r.status || 'ACTIVE').toLowerCase()}`}>{r.status || 'ACTIVE'}</span>
    )},
    { key: 'actions', label: 'Actions', render: (r: any) => (
      <>
        <button onClick={() => openEditReward(r)} className="btn-secondary btn-sm" style={{ marginRight: '8px' }}>Edit</button>
        <button onClick={() => handleDeleteReward(r.id)} className="btn-danger btn-sm">Delete</button>
      </>
    )},
  ];

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><DetailSkeleton /></main></div>;
  if (!brand) return <div className="page-layout"><Sidebar /><main className="main-content"><p>Brand not found</p></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <button onClick={() => router.back()} className="btn-secondary">← Back</button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', margin: '24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {brand.logoUrl && <img src={brand.logoUrl} alt="" style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover' }} />}
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 700 }}>{brand.name}</h1>
              <p style={{ color: '#64748b' }}>{brand.code && `Code: ${brand.code}`}</p>
            </div>
          </div>
          <span className={`status-badge ${(brand.status || 'ACTIVE').toLowerCase()}`}>{brand.status || 'ACTIVE'}</span>
        </div>

        <div className="grid-3" style={{ gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Description', value: brand.description || 'N/A', color: '#2563eb', bg: '#eff6ff' },
            { label: 'Website', value: brand.website || 'N/A', color: '#7c3aed', bg: '#f5f3ff' },
            { label: 'Rewards Count', value: rewards.length.toString(), color: '#16a34a', bg: '#f0fdf4' },
          ].map((stat, i) => (
            <div key={i} style={{ background: stat.bg, borderRadius: '12px', padding: '20px' }}>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>{stat.label}</p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Partner Rewards</h2>
            <button onClick={openAddReward} className="btn-primary btn-sm">+ Add Reward</button>
          </div>
          <DataTable columns={rewardColumns} data={rewards} emptyMessage="No rewards configured" />
        </div>

        <div className="card">
          <h2 className="card-title">Brand Details</h2>
          <table className="detail-table">
            <tbody>
              {[
                { label: 'ID', value: brand.id },
                { label: 'Name', value: brand.name },
                { label: 'Code', value: brand.code || 'N/A' },
                { label: 'Description', value: brand.description || 'N/A' },
                { label: 'Website', value: brand.website || 'N/A' },
                { label: 'Status', value: brand.status },
                { label: 'Created At', value: new Date(brand.createdAt).toLocaleString() },
                { label: 'Updated At', value: new Date(brand.updatedAt).toLocaleString() },
              ].map((row, i) => (
                <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px', color: '#64748b' }}>{row.label}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#475569' }}>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal open={showRewardModal} title={editingReward ? 'Edit Partner Reward' : 'Add Partner Reward'} onClose={() => setShowRewardModal(false)} width={480}>
          <form onSubmit={handleRewardSubmit}>
            <FormInput label="Reward Name" value={rewardForm.name} onChange={v => setRewardForm({ ...rewardForm, name: v })} required />
            <FormTextarea label="Description" value={rewardForm.description} onChange={v => setRewardForm({ ...rewardForm, description: v })} />
            <FormInput label="Points Required" type="number" value={rewardForm.pointsRequired} onChange={v => setRewardForm({ ...rewardForm, pointsRequired: v })} required />
            <FormSelect label="Type" value={rewardForm.type} onChange={v => setRewardForm({ ...rewardForm, type: v })} options={[
              { value: 'DISCOUNT', label: 'Discount' },
              { value: 'PHYSICAL', label: 'Physical' },
              { value: 'DIGITAL', label: 'Digital' },
              { value: 'VOUCHER', label: 'Voucher' },
            ]} />
            <FormSelect label="Status" value={rewardForm.status} onChange={v => setRewardForm({ ...rewardForm, status: v })} options={[
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
            ]} />
            <FormActions onCancel={() => setShowRewardModal(false)} loading={rewardSubmitting} submitLabel={editingReward ? 'Save' : 'Create'} />
          </form>
        </Modal>
      </main>
    </div>
  );
}
