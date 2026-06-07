'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import Pagination from '@/components/Pagination';
import Modal from '@/components/Modal';
import { FormInput, FormTextarea, FormActions } from '@/components/FormField';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import { getProductCategories, createProductCategory, updateProductCategory, deleteProductCategory, duplicateEntity, api } from '@/lib/api';
import BulkActionsToolbar from '@/components/BulkActionsToolbar';
import type { BulkAction } from '@/components/BulkActionsToolbar';
import { useConfirmDelete } from '@/hooks/useConfirmDelete';

interface CategoryForm { name: string; slug: string; description: string; icon: string; sortOrder: string }

const emptyForm: CategoryForm = { name: '', slug: '', description: '', icon: '', sortOrder: '0' };

export default function ProductCategoriesPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { confirmDelete: confirmDeleteCategory, modal: deleteModal } = useConfirmDelete({
    title: 'Delete Category',
    message: 'Delete this category?',
    onConfirm: async () => {
      if (!deletingId) return;
      try { await deleteProductCategory(deletingId); showToast('Category deleted', 'success'); load(); }
      catch (e: any) { showToast(e.message || 'Cannot delete category with products', 'error'); }
    },
  });

  const load = async () => {
    setLoading(true);
    try {
      const result = await getProductCategories({ page, limit, search: search || undefined });
      setCategories(result.data);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    load();
  }, [search, page]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (c: any) => {
    setEditing(c);
    setForm({ name: c.name, slug: c.slug || '', description: c.description || '', icon: c.icon || '', sortOrder: c.sortOrder?.toString() || '0' });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    confirmDeleteCategory();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = { ...form, sortOrder: Number(form.sortOrder) };
      if (editing) { await updateProductCategory(editing.id, body); showToast('Category updated', 'success'); }
      else { await createProductCategory(body); showToast('Category created', 'success'); }
      setShowModal(false); load();
    } catch { showToast('Network error', 'error'); }
  };

  const columns = [
    { key: 'name', label: 'Name', render: (c: any) => <span style={{ fontWeight: 500 }}>{c.icon ? `${c.icon} ` : ''}{c.name}</span> },
    { key: 'slug', label: 'Slug', render: (c: any) => <span className="text-muted" style={{ fontSize: '13px' }}>{c.slug}</span> },
    { key: 'products', label: 'Products', render: (c: any) => <span>{c._count?.products || 0}</span> },
    { key: 'sortOrder', label: 'Order', render: (c: any) => <span className="text-muted">{c.sortOrder}</span> },
    { key: 'actions', label: 'Actions', render: (c: any) => (
      <>
        <button onClick={async () => { try { await duplicateEntity('product-categories', c.id); showToast('Duplicated', 'success'); load(); } catch { showToast('Network error', 'error'); }}} className="btn-secondary btn-sm" style={{ marginRight: '8px' }}>📋</button>
        <button onClick={() => openEdit(c)} className="btn-secondary btn-sm" style={{ marginRight: '8px' }}>Edit</button>
        <button onClick={() => handleDelete(c.id)} className="btn-danger btn-sm">Delete</button>
      </>
    )},
  ];

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><TableSkeleton rows={6} cols={5} /></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <PageHeader title="Product Categories" subtitle="Organize products into categories" actions={<button onClick={openCreate} className="btn-primary">+ New Category</button>} />
        <div className="toolbar">
          <input type="text" placeholder="Search categories..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="search-input" />
          <span style={{ color: '#64748b', fontSize: '14px' }}>{total > 0 ? `${total} results` : ''}</span>
        </div>
        <BulkActionsToolbar
          selectedIds={selectedIds}
          onClear={() => setSelectedIds([])}
          onSuccess={load}
          actions={[
            {
              label: 'Xóa', variant: 'danger', icon: '🗑️',
              confirmMessage: 'Xóa categories',
              onClick: async (ids) => { for (const id of ids) await deleteProductCategory(id); },
            },
          ]} />
        <DataTable columns={columns} data={categories} emptyMessage="No categories found" selectable selectedIds={selectedIds} onSelectionChange={setSelectedIds} />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        <Modal open={showModal} title={editing ? 'Edit Category' : 'New Category'} onClose={() => setShowModal(false)} width={480}>
          <form onSubmit={handleSubmit}>
            <FormInput label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
            <FormInput label="Slug" value={form.slug} onChange={v => setForm({ ...form, slug: v })} />
            <FormTextarea label="Description" value={form.description} onChange={v => setForm({ ...form, description: v })} />
            <div className="grid-2">
              <FormInput label="Icon (emoji)" value={form.icon} onChange={v => setForm({ ...form, icon: v })} />
              <FormInput label="Sort Order" type="number" value={form.sortOrder} onChange={v => setForm({ ...form, sortOrder: v })} />
            </div>
            <FormActions onCancel={() => setShowModal(false)} loading={false} submitLabel={editing ? 'Save' : 'Create'} />
          </form>
        </Modal>
        {deleteModal}
      </main>
    </div>
  );
}
