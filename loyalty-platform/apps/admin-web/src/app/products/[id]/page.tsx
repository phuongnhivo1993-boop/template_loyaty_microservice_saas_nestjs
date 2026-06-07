'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';
import { DetailSkeleton } from '@/components/LoadingSkeleton';
import { getProduct, deleteProduct } from '@/lib/api';
import ConfirmModal from '@/components/ConfirmModal';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    getProduct(id as string).then(setProduct).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><DetailSkeleton /></main></div>;
  if (!product) return <div className="page-layout"><Sidebar /><main className="main-content"><p>Product not found</p></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <button onClick={() => router.push('/products')} className="btn-secondary" style={{ marginBottom: '16px' }}>← Back to Products</button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>{product.name}</h1>
            <p style={{ color: '#64748b', fontSize: '14px' }}>SKU: {product.sku || '—'}</p>
          </div>
          <span className={`status-badge ${(product.status || 'ACTIVE').toLowerCase()}`}>{product.status}</span>
        </div>
        <div className="grid-4" style={{ marginBottom: '32px' }}>
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '4px' }}>Price</p>
            <p style={{ fontSize: '20px', fontWeight: 700 }}>{product.price?.toLocaleString()} VND</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '4px' }}>Cost Price</p>
            <p style={{ fontSize: '20px', fontWeight: 700 }}>{product.costPrice ? `${product.costPrice.toLocaleString()} VND` : '—'}</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '4px' }}>Stock</p>
            <p style={{ fontSize: '20px', fontWeight: 700 }}>{product.stock} {product.unit || ''}</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '4px' }}>Category</p>
            <p style={{ fontSize: '20px', fontWeight: 700 }}>{product.category?.name || '—'}</p>
          </div>
        </div>
        {product.description && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Description</h3>
            <p style={{ color: '#475569' }}>{product.description}</p>
          </div>
        )}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => router.push('/products')} className="btn-primary">Edit</button>
          <button onClick={() => setShowConfirmDelete(true)} className="btn-danger">Delete</button>
        </div>
        <ConfirmModal open={showConfirmDelete} title="Delete Product" message="Delete this product?" onConfirm={async () => { setShowConfirmDelete(false); await deleteProduct(product.id); showToast('Product deleted', 'success'); router.push('/products'); }} onCancel={() => setShowConfirmDelete(false)} confirmText="Delete" />
      </main>
    </div>
  );
}
