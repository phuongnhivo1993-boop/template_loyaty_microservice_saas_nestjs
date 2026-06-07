'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MemberLayout from '../member-layout';
import { getProfile, uploadFile } from '@/lib/api';
import { CardSkeleton } from '@/components/LoadingSkeleton';

export default function KycPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ fullName: '', idNumber: '' });
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadData = () => {
    setError('');
    getProfile()
      .then((p: any) => {
        setProfile(p);
        setForm({ fullName: p.fullName || '', idNumber: '' });
      })
      .catch((e) => setError(e?.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    loadData();
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.idNumber.trim()) e.idNumber = 'ID number is required';
    else if (form.idNumber.trim().length < 6) e.idNumber = 'ID number must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setMessage('');
    try {
      let frontUrl = '';
      let backUrl = '';
      if (frontFile) {
        const res = await uploadFile(frontFile);
        frontUrl = res.url || res;
      }
      if (backFile) {
        const res = await uploadFile(backFile);
        backUrl = res.url || res;
      }
      const res = await fetch('/api/kyc/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          fullName: form.fullName,
          idNumber: form.idNumber,
          frontImage: frontUrl,
          backImage: backUrl,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Submission failed');
      setMessage('KYC submitted successfully! Pending verification.');
      loadData();
    } catch (err: any) {
      setMessage(err.message || 'Failed to submit KYC');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <MemberLayout><CardSkeleton /></MemberLayout>;
  }

  const isVerified = profile?.kycVerified;

  return (
    <MemberLayout>
      {error && (
        <div className="card" style={{ background: 'var(--error-bg, #fef2f2)', color: 'var(--error, #dc2626)', border: '1px solid var(--error-border, #fecaca)', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
          ⚠️ {error}
          <button className="btn btn-sm btn-outline" style={{ marginLeft: '12px' }} onClick={loadData}>Retry</button>
        </div>
      )}
      <div className="header">
        <div>
          <div className="header-title">🪪 KYC Verification</div>
          <div className="header-subtitle">Know Your Customer</div>
        </div>
      </div>

      {isVerified ? (
        <div className="card" style={{ textAlign: 'center', border: '2px solid var(--success, #10b981)' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
          <div style={{ fontWeight: 700, fontSize: '18px', color: 'var(--success, #10b981)' }}>Verified</div>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Your identity has been verified.
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="card">
            <div style={{ fontWeight: 600, marginBottom: '16px' }}>Identity Verification</div>

            <div className="field" style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Full Name (as on ID) <span style={{ color: 'var(--error)' }}>*</span></label>
              <input value={form.fullName} onChange={e => { setForm({ ...form, fullName: e.target.value }); if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' })); }} placeholder="Enter your full legal name" style={{ borderColor: errors.fullName ? 'var(--error)' : undefined }} />
              {errors.fullName && <div style={{ color: 'var(--error)', fontSize: '12px', marginTop: '4px' }}>{errors.fullName}</div>}
            </div>

            <div className="field" style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>ID Number <span style={{ color: 'var(--error)' }}>*</span></label>
              <input value={form.idNumber} onChange={e => { setForm({ ...form, idNumber: e.target.value }); if (errors.idNumber) setErrors(prev => ({ ...prev, idNumber: '' })); }} placeholder="Enter your ID number" style={{ borderColor: errors.idNumber ? 'var(--error)' : undefined }} />
              {errors.idNumber && <div style={{ color: 'var(--error)', fontSize: '12px', marginTop: '4px' }}>{errors.idNumber}</div>}
            </div>

            <div className="field" style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Front of ID</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setFrontFile(e.target.files?.[0] || null)}
                style={{ padding: '8px', fontSize: '14px' }}
              />
              {frontFile && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{frontFile.name}</div>}
            </div>

            <div className="field" style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Back of ID</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setBackFile(e.target.files?.[0] || null)}
                style={{ padding: '8px', fontSize: '14px' }}
              />
              {backFile && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{backFile.name}</div>}
            </div>

            {message && (
              <div style={{ fontSize: '14px', color: message.includes('successfully') ? 'var(--success)' : 'var(--error)', marginBottom: '8px', padding: '8px', background: message.includes('successfully') ? 'var(--success-bg, #dcfce7)' : 'var(--error-bg, #fef2f2)', borderRadius: '6px' }}>
                {message}
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%' }}>
              {submitting ? 'Submitting...' : 'Submit KYC'}
            </button>
          </div>
        </form>
      )}
    </MemberLayout>
  );
}
