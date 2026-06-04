'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { DetailSkeleton } from '@/components/LoadingSkeleton';
import { useToast } from '@/components/Toast';
import Modal from '@/components/Modal';
import { FormInput, FormTextarea, FormActions } from '@/components/FormField';
import { getProductCategory, updateProductCategory, deleteProductCategory } from '@/lib/api';

export default function ProductCategoryDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [form, setForm] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    getProductCategory(params.id)
      .then(data => setCategory(data))
      .catch(() => showToast('Failed to load category', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    load();
  }, [params.id]);

  const openEdit = () => {
    if (!category) return;
    setForm({
      name: category.name,
      slug: category.slug || '',
      description: category.description || '',
      icon: category.icon || '',
      sortOrder: category.sortOrder?.toString() || '0',
    });
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this category?')) return;
    try {
      await deleteProductCategory(params.id);
      showToast('Category deleted', 'success');
      router.push('/product-categories');
    } catch (e: any) { showToast(e.message || 'Cannot delete category with products', 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const body = { ...form, sortOrder: Number(form.sortOrder) };
      await updateProductCategory(params.id, body);
      showToast('Category updated', 'success');
      setShowEditModal(false);
      load();
    } catch { showToast('Network error', 'error'); }
    setSubmitting(false);
  };

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><DetailSkeleton /></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <button onClick={() => router.push('/product-categories')} className="btn-secondary">← Back to Categories</button>

        {category ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 700 }}>{category.icon ? `${category.icon} ` : ''}{category.name}</h1>
                <p style={{ color: '#64748b', marginTop: '4px' }}>Slug: {category.slug || '-'}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <button onClick={openEdit} className="btn-primary">Edit Category</button>
              <button onClick={handleDelete} className="btn-danger">Delete Category</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Category Details</h2>
                <div style={{ marginBottom: '12px' }}><strong>Name:</strong> {category.name}</div>
                <div style={{ marginBottom: '12px' }}><strong>Slug:</strong> {category.slug || '-'}</div>
                <div style={{ marginBottom: '12px' }}><strong>Description:</strong> {category.description || '-'}</div>
                <div style={{ marginBottom: '12px' }}><strong>Icon:</strong> {category.icon || '-'}</div>
                <div style={{ marginBottom: '12px' }}><strong>Sort Order:</strong> {category.sortOrder ?? 0}</div>
              </div>
              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Products</h2>
                <div style={{ marginBottom: '12px' }}><strong>Product Count:</strong> {category._count?.products || 0}</div>
              </div>
            </div>
          </>
        ) : (
          <p style={{ color: '#dc2626' }}>Category not found</p>
        )}

        <Modal open={showEditModal} title="Edit Category" onClose={() => setShowEditModal(false)} width={480}>
          <form onSubmit={handleSubmit}>
            <FormInput label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
            <FormInput label="Slug" value={form.slug} onChange={v => setForm({ ...form, slug: v })} />
            <FormTextarea label="Description" value={form.description} onChange={v => setForm({ ...form, description: v })} />
            <div className="grid-2">
              <FormInput label="Icon (emoji)" value={form.icon} onChange={v => setForm({ ...form, icon: v })} />
              <FormInput label="Sort Order" type="number" value={form.sortOrder} onChange={v => setForm({ ...form, sortOrder: v })} />
            </div>
            <FormActions onCancel={() => setShowEditModal(false)} loading={submitting} submitLabel="Save" />
          </form>
        </Modal>
      </main>
    </div>
  );
}
