'use client';

import { usePathname, useRouter } from 'next/navigation';

const menuItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Tenants', href: '/tenants', icon: '🏢' },
  { label: 'Members', href: '/members', icon: '👥' },
  { label: 'Campaigns', href: '/campaigns', icon: '📢' },
  { label: 'Rewards', href: '/rewards', icon: '🎁' },
  { label: 'Vouchers', href: '/vouchers', icon: '🎟️' },
  { label: 'Promotions', href: '/promotions', icon: '⚡' },
  { label: 'Notifications', href: '/notifications', icon: '🔔' },
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <aside style={{
      width: '260px',
      background: '#1e293b',
      color: '#94a3b8',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      zIndex: 50,
    }}>
      <div style={{
        padding: '24px',
        borderBottom: '1px solid #334155',
      }}>
        <h1 style={{
          color: 'white',
          fontSize: '20px',
          fontWeight: 700,
        }}>
          Loyalty Admin
        </h1>
      </div>

      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                border: 'none',
                borderRadius: '8px',
                background: isActive ? '#334155' : 'transparent',
                color: isActive ? '#3b82f6' : '#94a3b8',
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                fontSize: '15px',
                marginBottom: '4px',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: '16px 12px', borderTop: '1px solid #334155' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            border: 'none',
            borderRadius: '8px',
            background: 'transparent',
            color: '#ef4444',
            cursor: 'pointer',
            fontSize: '15px',
            textAlign: 'left',
          }}
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  );
}
