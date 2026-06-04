'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';
import Modal from '@/components/Modal';
import { FormSelect, FormActions } from '@/components/FormField';
import { DetailSkeleton } from '@/components/LoadingSkeleton';
import { getOrder, updateOrderStatus, getOrderTimeline } from '@/lib/api';

const statusColors: Record<string, string> = {
  PENDING: '#f59e0b', CONFIRMED: '#3b82f6', PROCESSING: '#8b5cf6',
  SHIPPED: '#06b6d4', DELIVERED: '#10b981', CANCELLED: '#ef4444', REFUNDED: '#f97316',
};

const statusTransitions: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED', 'CANCELLED'],
  DELIVERED: ['REFUNDED'],
  CANCELLED: ['REFUNDED'],
  REFUNDED: [],
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [timeline, setTimeline] = useState<any>(null);

  const load = () => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    getOrder(id as string).then((data) => { setOrder(data); setNewStatus(''); }).catch(() => {}).finally(() => setLoading(false));
    getOrderTimeline(id as string).then(setTimeline).catch(() => {});
  };

  useEffect(() => { load(); }, [id]);

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateOrderStatus(id as string, { status: newStatus });
      showToast(`Order status updated to ${newStatus}`, 'success');
      setShowStatusModal(false); load();
    } catch { showToast('Failed to update status', 'error'); }
    setSubmitting(false);
  };

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><DetailSkeleton /></main></div>;
  if (!order) return <div className="page-layout"><Sidebar /><main className="main-content"><p>Order not found</p></main></div>;

  const nextStatuses = statusTransitions[order.status] || [];

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <button onClick={() => router.push('/orders')} className="btn-secondary" style={{ marginBottom: '16px' }}>← Back to Orders</button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px', fontFamily: 'monospace' }}>{order.orderCode}</h1>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Created {new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ padding: '6px 14px', borderRadius: '14px', fontSize: '13px', fontWeight: 600, background: `${statusColors[order.status] || '#94a3b8'}20`, color: statusColors[order.status] || '#64748b' }}>{order.status}</span>
            {nextStatuses.length > 0 && (
              <button onClick={() => setShowStatusModal(true)} className="btn-primary">Update Status</button>
            )}
          </div>
        </div>

        <div className="grid-4" style={{ marginBottom: '32px' }}>
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '4px' }}>Subtotal</p>
            <p style={{ fontSize: '20px', fontWeight: 700 }}>{order.subtotal?.toLocaleString()} VND</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '4px' }}>Discount</p>
            <p style={{ fontSize: '20px', fontWeight: 700 }}>{order.discount > 0 ? `-${order.discount.toLocaleString()} VND` : '—'}</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '4px' }}>Total</p>
            <p style={{ fontSize: '20px', fontWeight: 700, color: '#2563eb' }}>{order.total?.toLocaleString()} VND</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '4px' }}>Points Earned</p>
            <p style={{ fontSize: '20px', fontWeight: 700 }}>🪙 {order.pointsEarned || 0}</p>
          </div>
        </div>

        <div className="grid-3" style={{ marginBottom: '32px' }}>
          {order.paymentMethod && (
            <div>
              <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '2px' }}>Payment Method</p>
              <p style={{ fontWeight: 500 }}>{order.paymentMethod}</p>
            </div>
          )}
          {order.couponCode && (
            <div>
              <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '2px' }}>Coupon</p>
              <p style={{ fontWeight: 500 }}>{order.couponCode}</p>
            </div>
          )}
          {order.member && (
            <div>
              <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '2px' }}>Member</p>
              <p style={{ fontWeight: 500 }}>{order.member.name || order.member.email || order.memberId}</p>
            </div>
          )}
        </div>

        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Order Items ({order.items?.length || 0})</h3>
        <div style={{ background: '#f8fafc', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Product</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Qty</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Price</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item: any, idx: number) => (
                <tr key={item.id || idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px 16px' }}>{item.product?.name || item.productId}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>{item.quantity}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>{(item.price || 0).toLocaleString()} VND</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600 }}>{((item.price || 0) * item.quantity).toLocaleString()} VND</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {order.notes && (
          <div style={{ marginTop: '24px', padding: '16px', background: '#fffbeb', borderRadius: '10px' }}>
            <p style={{ color: '#92400e', fontWeight: 500, marginBottom: '4px' }}>Notes</p>
            <p style={{ color: '#78350f', fontSize: '14px' }}>{order.notes}</p>
          </div>
        )}

        <div style={{ marginTop: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Status Timeline</h3>
          <div style={{ position: 'relative', paddingLeft: '24px' }}>
            {timeline?.history?.length > 0 ? (
              timeline.history.map((entry: any, idx: number) => (
                <div key={idx} style={{ position: 'relative', paddingBottom: '16px', borderLeft: '2px solid #e2e8f0', paddingLeft: '20px', marginLeft: '-12px' }}>
                  <div style={{ position: 'absolute', left: '-7px', top: '0', width: '12px', height: '12px', borderRadius: '50%', background: statusColors[entry.to] || '#94a3b8' }} />
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>
                    <span style={{ color: statusColors[entry.from] || '#94a3b8' }}>{entry.from}</span>
                    <span style={{ margin: '0 8px' }}>→</span>
                    <span style={{ color: statusColors[entry.to] || '#94a3b8' }}>{entry.to}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{new Date(entry.timestamp).toLocaleString()}</div>
                </div>
              ))
            ) : (
              <div style={{ color: '#64748b', fontSize: '14px', padding: '20px 0' }}>No status changes recorded</div>
            )}
          </div>
        </div>

        <Modal open={showStatusModal} title="Update Order Status" onClose={() => setShowStatusModal(false)} width={400}>
          <form onSubmit={handleStatusUpdate}>
            <FormSelect label="New Status" value={newStatus} onChange={setNewStatus} options={nextStatuses.map((s: string) => ({ value: s, label: s }))} required />
            <FormActions onCancel={() => setShowStatusModal(false)} loading={submitting} submitLabel="Update" />
          </form>
        </Modal>
      </main>
    </div>
  );
}
