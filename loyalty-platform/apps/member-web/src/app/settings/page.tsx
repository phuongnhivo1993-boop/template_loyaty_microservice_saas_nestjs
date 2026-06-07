'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MemberLayout from '../member-layout';

const menuItems = [
  { label: 'Profile', href: '/profile', icon: '👤' },
  { label: 'Change Password', href: '/profile', icon: '🔑' },
  { label: 'Membership Card', href: '/membership-card', icon: '💳' },
  { label: 'Tier Progress', href: '/tier-progress', icon: '📈' },
  { label: 'Notifications', href: '/notifications', icon: '🔔' },
  { label: 'KYC Verification', href: '/kyc', icon: '🪪' },
  { label: 'Cashback', href: '/cashback', icon: '💵' },
  { label: 'Gift Cards', href: '/gift-cards', icon: '🎴' },
  { label: 'Rewards', href: '/rewards', icon: '🎁' },
];

export default function SettingsPage() {
  const router = useRouter();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored) setTheme(stored);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setTheme(next);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <MemberLayout>
      <div className="header">
        <div>
          <div className="header-title">⚙️ Settings</div>
          <div className="header-subtitle">Manage your account</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '12px' }}>
        <div style={{ fontWeight: 600, marginBottom: '12px' }}>Quick Links</div>
        {menuItems.map(item => (
          <div
            key={item.href}
            className="tx-item"
            style={{ cursor: 'pointer' }}
            onClick={() => router.push(item.href)}
          >
            <div className="tx-left">
              <div className="tx-reason">{item.icon} {item.label}</div>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>→</span>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600 }}>{theme === 'dark' ? '🌙' : '☀️'} Dark Mode</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{theme === 'dark' ? 'Disable' : 'Enable'} dark mode</div>
          </div>
          <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px' }}>
            <input
              type="checkbox"
              checked={theme === 'dark'}
              onChange={toggleTheme}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: 'absolute', cursor: 'pointer', inset: 0,
              background: theme === 'dark' ? 'var(--primary, #6366f1)' : '#ccc',
              borderRadius: '26px', transition: '0.3s',
            }}>
              <span style={{
                position: 'absolute', content: '', height: '20px', width: '20px',
                left: theme === 'dark' ? '26px' : '3px', bottom: '3px',
                background: 'white', borderRadius: '50%', transition: '0.3s',
              }} />
            </span>
          </label>
        </div>
      </div>

      <button
        className="btn btn-outline"
        onClick={handleLogout}
        style={{ borderColor: 'var(--error)', color: 'var(--error)', width: '100%', marginBottom: '12px' }}
      >
        🚪 Logout
      </button>

      <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', padding: '12px' }}>
        Member App v1.0.0
      </div>
    </MemberLayout>
  );
}
