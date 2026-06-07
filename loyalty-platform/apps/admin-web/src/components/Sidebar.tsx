'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import TenantSwitcher from './TenantSwitcher';

const menuGroups = [
  {
    label: null,
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    ],
  },
  {
    label: 'Hệ thống',
    items: [
      { label: 'Tenants', href: '/tenants', icon: '🏢' },
      { label: 'Users', href: '/users', icon: '👤' },
    ],
  },
  {
    label: 'Thành viên',
    items: [
      { label: 'Members', href: '/members', icon: '👥' },
      { label: 'Tiers', href: '/tiers', icon: '🥇' },
      { label: 'Earning Rules', href: '/earning-rules', icon: '💰' },
      { label: 'Point Transactions', href: '/point-transactions', icon: '💳' },
      { label: 'Referrals', href: '/referrals', icon: '🔗' },
    ],
  },
  {
    label: 'Chiến dịch & Ưu đãi',
    items: [
      { label: 'Campaigns', href: '/campaigns', icon: '📢' },
      { label: 'Rewards', href: '/rewards', icon: '🎁' },
      { label: 'Vouchers', href: '/vouchers', icon: '🎟️' },
      { label: 'Member Vouchers', href: '/member-vouchers', icon: '🎫' },
      { label: 'Promotions', href: '/promotions', icon: '⚡' },
      { label: 'Coupons', href: '/coupons', icon: '🏷️' },
    ],
  },
  {
    label: 'Tương tác',
    items: [
      { label: 'Badges', href: '/badges', icon: '🏅' },
      { label: 'Missions', href: '/missions', icon: '🎯' },
      { label: 'Notifications', href: '/notifications', icon: '🔔' },
      { label: 'Broadcast', href: '/notifications/broadcast', icon: '📣' },
      { label: 'Feedback', href: '/feedback', icon: '💬' },
    ],
  },
  {
    label: 'Kinh doanh',
    items: [
      { label: 'Products', href: '/products', icon: '📦' },
      { label: 'Product Categories', href: '/product-categories', icon: '📂' },
      { label: 'Orders', href: '/orders', icon: '🛒' },
      { label: 'Stores', href: '/stores', icon: '🏪' },
      { label: 'Cashback', href: '/cashback', icon: '💵' },
      { label: 'Gift Cards', href: '/gift-cards', icon: '💳' },
      { label: 'Partner Brands', href: '/partner-brands', icon: '🤝' },
    ],
  },
  {
    label: 'Phân tích',
    items: [
      { label: 'Member Segmentation', href: '/member-segmentation', icon: '🎯' },
      { label: 'Voucher Analytics', href: '/voucher-analytics', icon: '📊' },
      { label: 'Check-in Analytics', href: '/checkin-analytics', icon: '📅' },
    ],
  },
  {
    label: 'Hạ tầng',
    items: [
      { label: 'Webhooks', href: '/webhooks', icon: '🔗' },
      { label: 'Audit Log', href: '/audit-log', icon: '📋' },
      { label: 'Settings', href: '/settings', icon: '⚙️' },
      { label: 'Branding', href: '/settings/branding', icon: '🎨' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tenantId, setTenantId] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setTenantId(payload.tenantId || '');
      setRole(payload.role || '');
    } catch {}
  }, []);

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(current);
  }, []);

  const handleTenantSwitch = (newTenantId: string) => {
    localStorage.setItem('activeTenantId', newTenantId);
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const navigate = (href: string) => {
    router.push(href);
    setMobileOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="sidebar-toggle"
        aria-label="Toggle sidebar"
      >
        <span>{mobileOpen ? '✕' : '☰'}</span>
      </button>

      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`sidebar ${mobileOpen ? 'sidebar-mobile-open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-title">Loyalty Admin</h1>
        </div>

        {role === 'HOST' && (
          <div style={{ padding: '8px 12px' }}>
            <TenantSwitcher
              currentTenantId={tenantId}
              onSwitch={handleTenantSwitch}
            />
          </div>
        )}

        <nav className="sidebar-nav">
          {menuGroups.map((group) => (
            <div key={group.label ?? 'main'}>
              {group.label && <div className="sidebar-section-label">{group.label}</div>}
              {group.items.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <button
                    key={item.href}
                    onClick={() => navigate(item.href)}
                    className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
                    aria-label={item.label}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span style={{ fontSize: '18px' }}>{item.icon}</span>
                    {item.label}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            onClick={() => {
              const html = document.documentElement;
              const current = html.getAttribute('data-theme');
              const next = current === 'dark' ? 'light' : 'dark';
              html.setAttribute('data-theme', next);
              localStorage.setItem('theme', next);
              setTheme(next);
            }}
            className="sidebar-logout"
            style={{ color: '#94a3b8', marginBottom: '4px' }}
          >
            <span>{theme === 'dark' ? '☀️' : '🌙'}</span> {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button onClick={handleLogout} className="sidebar-logout">
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
