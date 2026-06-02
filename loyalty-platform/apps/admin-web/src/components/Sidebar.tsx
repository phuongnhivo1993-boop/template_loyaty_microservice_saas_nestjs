'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const menuItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Tenants', href: '/tenants', icon: '🏢' },
  { label: 'Members', href: '/members', icon: '👥' },
  { label: 'Campaigns', href: '/campaigns', icon: '📢' },
  { label: 'Rewards', href: '/rewards', icon: '🎁' },
  { label: 'Vouchers', href: '/vouchers', icon: '🎟️' },
  { label: 'Member Vouchers', href: '/member-vouchers', icon: '🎫' },
  { label: 'Promotions', href: '/promotions', icon: '⚡' },
  { label: 'Notifications', href: '/notifications', icon: '🔔' },
  { label: '  Broadcast', href: '/notifications/broadcast', icon: '📣' },
  { label: 'Tiers', href: '/tiers', icon: '🥇' },
  { label: 'Users', href: '/users', icon: '👤' },
  { label: 'Referrals', href: '/referrals', icon: '🔗' },
  { label: 'Badges', href: '/badges', icon: '🏅' },
  { label: 'Missions', href: '/missions', icon: '🎯' },
  { label: 'Point Transactions', href: '/point-transactions', icon: '💳' },
  { label: 'Audit Log', href: '/audit-log', icon: '📋' },
  { label: 'Settings', href: '/settings', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

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

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
              >
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="sidebar-logout">
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
