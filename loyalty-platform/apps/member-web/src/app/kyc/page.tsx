'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import MemberLayout from '../member-layout';
import { getProfile, uploadFile } from '@/lib/api';
import { CardSkeleton } from '@/components/LoadingSkeleton';

export default function KycPage() {
  const { t } = useTranslation();
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
    if (!form.fullName.trim()) e.fullName = t('kyc.fullNameRequired');
    if (!form.idNumber.trim()) e.idNumber = t('kyc.idNumberRequired');
    else if (form.idNumber.trim().length < 6) e.idNumber = t('kyc.idNumberMinLength');
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
      setMessage(t('kyc.kycSubmitted'));
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
          <button className="btn btn-sm btn-outline" style={{ marginLeft: '12px' }} onClick={loadData}>{t('common.retry')}</button>
        </div>
      )}
      <div className="header">
        <div>
          <div className="header-title">{t('kyc.title')}</div>
          <div className="header-subtitle">{t('kyc.knowYourCustomer')}</div>
        </div>
      </div>

      {isVerified ? (
        <div className="card" style={{ textAlign: 'center', border: '2px solid var(--success, #10b981)' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
          <div style={{ fontWeight: 700, fontSize: '18px', color: 'var(--success, #10b981)' }}>{t('kyc.verifiedTitle')}</div>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {t('kyc.verified')}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="card">
            <div style={{ fontWeight: 600, marginBottom: '16px' }}>{t('kyc.identityVerification')}</div>

            <div className="field" style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>{t('kyc.fullName')} <span style={{ color: 'var(--error)' }}>*</span></label>
              <input value={form.fullName} onChange={e => { setForm({ ...form, fullName: e.target.value }); if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' })); }} placeholder={t('kyc.enterFullName')} style={{ borderColor: errors.fullName ? 'var(--error)' : undefined }} />
              {errors.fullName && <div style={{ color: 'var(--error)', fontSize: '12px', marginTop: '4px' }}>{errors.fullName}</div>}
            </div>

            <div className="field" style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>{t('kyc.idNumber')} <span style={{ color: 'var(--error)' }}>*</span></label>
              <input value={form.idNumber} onChange={e => { setForm({ ...form, idNumber: e.target.value }); if (errors.idNumber) setErrors(prev => ({ ...prev, idNumber: '' })); }} placeholder={t('kyc.enterIdNumber')} style={{ borderColor: errors.idNumber ? 'var(--error)' : undefined }} />
              {errors.idNumber && <div style={{ color: 'var(--error)', fontSize: '12px', marginTop: '4px' }}>{errors.idNumber}</div>}
            </div>

            <div className="field" style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>{t('kyc.frontOfId')}</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setFrontFile(e.target.files?.[0] || null)}
                style={{ padding: '8px', fontSize: '14px' }}
              />
              {frontFile && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{frontFile.name}</div>}
            </div>

            <div className="field" style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>{t('kyc.backOfId')}</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setBackFile(e.target.files?.[0] || null)}
                style={{ padding: '8px', fontSize: '14px' }}
              />
              {backFile && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{backFile.name}</div>}
            </div>

            {message && (
              <div style={{ fontSize: '14px', color: message.includes('successfully') || message.includes('thành công') ? 'var(--success)' : 'var(--error)', marginBottom: '8px', padding: '8px', background: message.includes('successfully') || message.includes('thành công') ? 'var(--success-bg, #dcfce7)' : 'var(--error-bg, #fef2f2)', borderRadius: '6px' }}>
                {message}
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%' }}>
              {submitting ? t('kyc.submitting') : t('kyc.submitKyc')}
            </button>
          </div>
        </form>
      )}
    </MemberLayout>
  );
}
