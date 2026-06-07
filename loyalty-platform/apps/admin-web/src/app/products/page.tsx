'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import BulkActionBar from '@/components/BulkActionBar';
import Pagination from '@/components/Pagination';
import Modal from '@/components/Modal';
import { FormInput, FormSelect, FormTextarea, FormActions } from '@/components/FormField';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import { getProducts, createProduct, updateProduct, deleteProduct, getProductCategories, api, restoreItem } from '@/lib/api';
import { useConfirmDelete } from '@/hooks/useConfirmDelete';

interface ProductForm {
  name: string; slug: string; price: string; costPrice: string; stock: string; unit: string; sku: string; status: string; categoryId: string; description: string;
}

const emptyForm: ProductForm = { name: '', slug: '', price: '', costPrice: '', stock: '', unit: '', sku: '', status: 'ACTIVE', categoryId: '', description: '' };

export default function ProductsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { confirmDelete: confirmDeleteProduct, modal: deleteModal } = useConfirmDelete({
    title: 'Delete Product',
    message: 'Delete this product?',
    onConfirm: async () => {
      if (!deletingId) return;
      try { await deleteProduct(deletingId); showToast('Product deleted', 'success'); load(); }
      catch { showToast('Network error', 'error'); }
    },
  });

  const load = async () => {
    setLoading(true);
    try {
      const result = await getProducts({ page, limit, search: search || undefined, status: statusFilter !== 'ALL' ? statusFilter : undefined, includeDeleted: showDeleted || undefined });
      setProducts(result.data);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    load();
  }, [search, page, statusFilter, showDeleted]);

  const openCreate = async () => {
    setEditing(null); setForm(emptyForm);
    try { const cats = await getProductCategories({ page: 1, limit: 200 }); setCategories(cats.data); } catch { setCategories([]); }
    setShowModal(true);
  };

  const openEdit = async (p: any) => {
    setEditing(p);
    setForm({
      name: p.name, slug: p.slug || '', price: p.price?.toString() || '', costPrice: p.costPrice?.toString() || '',
      stock: p.stock?.toString() || '', unit: p.unit || '', sku: p.sku || '', status: p.status || 'ACTIVE',
      categoryId: p.categoryId || '', description: p.description || '',
    });
    try { const cats = await getProductCategories({ page: 1, limit: 200 }); setCategories(cats.data); } catch { setCategories([]); }
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    confirmDeleteProduct();
  };

  const handleRestore = async (id: string) => {
    try { await restoreItem('products', id); showToast('Product restored', 'success'); load(); }
    catch { showToast('Network error', 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = { ...form, price: Number(form.price), costPrice: form.costPrice ? Number(form.costPrice) : undefined, stock: Number(form.stock) };
      if (editing) { await updateProduct(editing.id, body); showToast('Product updated', 'success'); }
      else { await createProduct(body); showToast('Product created', 'success'); }
      setShowModal(false); load();
    } catch { showToast('Network error', 'error'); }
  };

  const exportCsv = async () => {
    const result = await getProducts({ page: 1, limit: 10000, search: search || undefined, status: statusFilter !== 'ALL' ? statusFilter : undefined });
    const data = result.data;
    const cols = ['name', 'sku', 'price', 'stock', 'unit', 'status'];
    const rows = data.map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
    const url = URL.createObjectURL(new Blob([[cols.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = 'products.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const columns = [
    { key: 'name', label: 'Name', render: (p: any) => <span style={{ fontWeight: 500 }}>{p.name}</span> },
    { key: 'sku', label: 'SKU', render: (p: any) => <span className="text-muted" style={{ fontSize: '13px' }}>{p.sku || '-'}</span> },
    { key: 'price', label: 'Price', render: (p: any) => <span>{p.price?.toLocaleString()} VND</span> },
    { key: 'stock', label: 'Stock', render: (p: any) => <span>{p.stock}</span> },
    { key: 'unit', label: 'Unit', render: (p: any) => <span className="text-muted">{p.unit || '-'}</span> },
    { key: 'category', label: 'Category', render: (p: any) => <span className="text-muted">{p.category?.name || '-'}</span> },
    { key: 'status', label: 'Status', render: (p: any) => (
      <span className={`status-badge ${(p.status || 'ACTIVE').toLowerCase()}`}>{p.status || 'ACTIVE'}</span>
    )},
    { key: 'actions', label: 'Actions', render: (p: any) => (
      <>
        <button onClick={() => router.push(`/products/${p.id}`)} className="btn-primary btn-sm" style={{ marginRight: '8px' }}>View</button>
        <button onClick={() => openEdit(p)} className="btn-secondary btn-sm" style={{ marginRight: '8px' }}>Edit</button>
        {p.deletedAt ? (
          <button onClick={() => handleRestore(p.id)} className="btn-secondary btn-sm" style={{ borderColor: '#16a34a', color: '#16a34a' }}>Restore</button>
        ) : (
          <button onClick={() => handleDelete(p.id)} className="btn-danger btn-sm">Delete</button>
        )}
      </>
    )},
  ];

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><TableSkeleton rows={6} cols={7} /></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <PageHeader title="Products" subtitle="Manage product catalog" actions={<button onClick={openCreate} className="btn-primary">+ New Product</button>} />
        <div className="toolbar">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="filter-select">
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <input type="text" placeholder="Search products..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="search-input" />
          <span style={{ color: '#64748b', fontSize: '14px' }}>{total > 0 ? `${total} results` : ''}</span>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer' }}>
            <input type="checkbox" checked={showDeleted} onChange={e => { setShowDeleted(e.target.checked); setPage(1); }} />
            Show deleted
          </label>
          <button onClick={exportCsv} className="btn-secondary">Export CSV</button>
        </div>
        <BulkActionBar selectedCount={selectedIds.length} onClear={() => setSelectedIds([])}
          onDelete={async () => {
            if (!confirm(`Delete ${selectedIds.length} products?`)) return;
            await api.post('/products/bulk/delete', { ids: selectedIds });
            showToast(`Deleted ${selectedIds.length} products`, 'success'); setSelectedIds([]); load();
          }}
          customActions={[
            { label: 'Activate', onClick: async () => {
              await api.post('/products/bulk/status', { ids: selectedIds, status: 'ACTIVE' });
              showToast(`Activated ${selectedIds.length} products`, 'success'); setSelectedIds([]); load();
            }, color: '#16a34a' },
            { label: 'Deactivate', onClick: async () => {
              await api.post('/products/bulk/status', { ids: selectedIds, status: 'INACTIVE' });
              showToast(`Deactivated ${selectedIds.length} products`, 'success'); setSelectedIds([]); load();
            }, color: '#d97706' },
          ]} />
        <DataTable columns={columns} data={products} emptyMessage="No products found" selectable selectedIds={selectedIds} onSelectionChange={setSelectedIds} />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        <Modal open={showModal} title={editing ? 'Edit Product' : 'New Product'} onClose={() => setShowModal(false)} width={560}>
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <FormInput label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
              <FormInput label="Slug" value={form.slug} onChange={v => setForm({ ...form, slug: v })} />
            </div>
            <div className="grid-2">
              <FormInput label="Price (VND)" type="number" value={form.price} onChange={v => setForm({ ...form, price: v })} required />
              <FormInput label="Cost Price (VND)" type="number" value={form.costPrice} onChange={v => setForm({ ...form, costPrice: v })} />
            </div>
            <div className="grid-2">
              <FormInput label="Stock" type="number" value={form.stock} onChange={v => setForm({ ...form, stock: v })} required />
              <FormInput label="Unit" value={form.unit} onChange={v => setForm({ ...form, unit: v })} placeholder="e.g. ly, cái, gói" />
            </div>
            <div className="grid-2">
              <FormInput label="SKU" value={form.sku} onChange={v => setForm({ ...form, sku: v })} />
              <FormSelect label="Category" value={form.categoryId} onChange={v => setForm({ ...form, categoryId: v })} options={[
                { value: '', label: '— No category —' },
                ...categories.map((c: any) => ({ value: c.id, label: c.name })),
              ]} />
            </div>
            <FormSelect label="Status" value={form.status} onChange={v => setForm({ ...form, status: v })} options={[
              { value: 'ACTIVE', label: 'Active' }, { value: 'INACTIVE', label: 'Inactive' },
            ]} />
            <FormTextarea label="Description" value={form.description} onChange={v => setForm({ ...form, description: v })} />
            <FormActions onCancel={() => setShowModal(false)} loading={false} submitLabel={editing ? 'Save' : 'Create'} />
          </form>
        </Modal>
        {deleteModal}
      </main>
    </div>
  );
}
