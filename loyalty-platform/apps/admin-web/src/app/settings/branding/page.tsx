'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';
import PageHeader from '@/components/PageHeader';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import { getTenantSettings, updateTenantSettings } from '@/lib/api';

export default function BrandingSettingsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tenantId, setTenantId] = useState<string>('');
  const [brandName, setBrandName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#2563eb');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoPreview, setLogoPreview] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    const payload = JSON.parse(atob(token.split('.')[1]));
    setTenantId(payload.tenantId || '');
  }, [router]);

  const loadSettings = useCallback(async () => {
    if (!tenantId) return;
    setLoading(true);
    try {
      const res = await getTenantSettings(tenantId);
      const theme = res?.theme || {};
      setBrandName(theme.brandName || '');
      setPrimaryColor(theme.primaryColor || '#2563eb');
      setLogoUrl(theme.logoUrl || '');
      setLogoPreview(theme.logoUrl || '');
    } catch {
      showToast('Failed to load branding settings', 'error');
    }
    setLoading(false);
  }, [tenantId, showToast]);

  useEffect(() => { if (tenantId) loadSettings(); }, [tenantId, loadSettings]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast('Logo must be under 2MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setLogoPreview(dataUrl);
      setLogoUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateTenantSettings(tenantId, {
        theme: { brandName, primaryColor, logoUrl },
      });
      showToast('Branding settings saved successfully', 'success');
      document.documentElement.style.setProperty('--primary', primaryColor);
    } catch {
      showToast('Failed to save branding settings', 'error');
    }
    setSaving(false);
  };

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><TableSkeleton rows={5} cols={5} /></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <PageHeader title="Branding" subtitle="Customize your tenant brand appearance" />

        <div style={{ maxWidth: '600px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                Brand Name
              </label>
              <input
                type="text"
                value={brandName}
                onChange={e => setBrandName(e.target.value)}
                placeholder="Enter your brand name"
                style={{
                  width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1',
                  borderRadius: '8px', fontSize: '14px', outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                Logo
              </label>
              <div
                style={{
                  width: '100%', minHeight: '120px', border: '2px dashed #cbd5e1',
                  borderRadius: '8px', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', padding: '16px',
                  cursor: 'pointer', background: logoPreview ? '#f8fafc' : 'transparent',
                }}
                onClick={() => document.getElementById('logo-upload')?.click()}
              >
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'contain' }}
                  />
                ) : (
                  <>
                    <span style={{ fontSize: '32px', marginBottom: '8px' }}>📁</span>
                    <span style={{ fontSize: '14px', color: '#64748b' }}>
                      Click to upload logo (PNG/JPG, max 2MB)
                    </span>
                  </>
                )}
              </div>
              <input
                id="logo-upload"
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleLogoUpload}
                style={{ display: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                Primary Color
              </label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={e => setPrimaryColor(e.target.value)}
                  style={{ width: '48px', height: '48px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={e => setPrimaryColor(e.target.value)}
                  style={{
                    flex: 1, padding: '10px 12px', border: '1px solid #cbd5e1',
                    borderRadius: '8px', fontSize: '14px', fontFamily: 'monospace', outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                Preview
              </label>
              <div
                style={{
                  padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                }}
              >
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px',
                  }}
                >
                  {logoPreview && (
                    <img src={logoPreview} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                  )}
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>
                    {brandName || 'Your Brand Name'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    style={{
                      padding: '8px 20px', background: primaryColor, color: '#fff',
                      border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'default',
                    }}
                  >
                    Primary Button
                  </button>
                  <div
                    style={{
                      padding: '8px 16px', border: `1px solid ${primaryColor}`, color: primaryColor,
                      borderRadius: '6px', fontSize: '13px', fontWeight: 600,
                    }}
                  >
                    Outlined
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '15px' }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
