'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { label: 'Home', href: '/dashboard', icon: '🏠' },
  { label: 'Wallet', href: '/wallet', icon: '💰' },
  { label: 'Vouchers', href: '/vouchers', icon: '🎟️' },
  { label: 'Orders', href: '/orders', icon: '🛒' },
  { label: 'Rewards', href: '/rewards', icon: '🎁' },
  { label: 'Gift Cards', href: '/gift-cards', icon: '🎴' },
  { label: 'Cashback', href: '/cashback', icon: '💵' },
  { label: 'Membership Card', href: '/membership-card', icon: '💳' },
  { label: 'Badges', href: '/badges', icon: '🏅' },
  { label: 'Missions', href: '/missions', icon: '🎯' },
  { label: 'Referrals', href: '/referrals', icon: '🔗' },
  { label: 'Tier', href: '/tier-progress', icon: '📈' },
  { label: 'Notifications', href: '/notifications', icon: '🔔' },
  { label: 'Feedback', href: '/feedback', icon: '💬' },
  { label: 'Stores', href: '/stores', icon: '🏪' },
  { label: 'Check-in', href: '/checkin', icon: '✅' },
  { label: 'KYC', href: '/kyc', icon: '🪪' },
  { label: 'Settings', href: '/settings', icon: '⚙️' },
  { label: 'Profile', href: '/profile', icon: '👤' },
];

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [theme, setTheme] = useState('light');
  const [refreshing, setRefreshing] = useState(false);
  const touchStartY = useRef(0);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
      router.push('/login');
    }
  }, [router]);

  const handleNav = useCallback((href: string) => {
    router.push(href);
  }, [router]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchEndY - touchStartY.current;
    if (deltaY > 100 && window.scrollY <= 0 && !refreshing) {
      setRefreshing(true);
      window.location.reload();
    }
  }, [refreshing]);

  const toggleTheme = () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setTheme(next);
  };

  return (
    <div className="container" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {refreshing && (
        <div style={{ textAlign: 'center', padding: '16px', fontSize: '14px', color: 'var(--primary)' }}>
          Refreshing...
        </div>
      )}
      <button
        onClick={toggleTheme}
        style={{
          position: 'fixed', top: 12, right: 12, zIndex: 100,
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: '50%', width: 36, height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, cursor: 'pointer',
        }}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
      <div className="content">
        {children}
      </div>
      <nav className="nav-bottom">
        {navItems.map(item => (
          <button
            key={item.href}
            onClick={() => handleNav(item.href)}
            className={`nav-item ${pathname === item.href || pathname.startsWith(item.href + '/') ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
