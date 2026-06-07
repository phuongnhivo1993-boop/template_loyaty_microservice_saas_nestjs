'use client';

import { useEffect, useCallback, useState, useRef, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [theme, setTheme] = useState('light');
  const [refreshing, setRefreshing] = useState(false);
  const touchStartY = useRef(0);

  const navItems = useMemo(() => [
    { label: t('nav.home'), href: '/dashboard', icon: '🏠' },
    { label: t('nav.wallet'), href: '/wallet', icon: '💰' },
    { label: t('nav.vouchers'), href: '/vouchers', icon: '🎟️' },
    { label: t('nav.orders'), href: '/orders', icon: '🛒' },
    { label: t('nav.rewards'), href: '/rewards', icon: '🎁' },
    { label: t('nav.giftCards'), href: '/gift-cards', icon: '🎴' },
    { label: t('nav.cashback'), href: '/cashback', icon: '💵' },
    { label: t('nav.membershipCard'), href: '/membership-card', icon: '💳' },
    { label: t('nav.badges'), href: '/badges', icon: '🏅' },
    { label: t('nav.missions'), href: '/missions', icon: '🎯' },
    { label: t('nav.referrals'), href: '/referrals', icon: '🔗' },
    { label: t('nav.tier'), href: '/tier-progress', icon: '📈' },
    { label: t('nav.notifications'), href: '/notifications', icon: '🔔' },
    { label: t('nav.feedback'), href: '/feedback', icon: '💬' },
    { label: t('nav.stores'), href: '/stores', icon: '🏪' },
    { label: t('nav.checkin'), href: '/checkin', icon: '✅' },
    { label: t('nav.kyc'), href: '/kyc', icon: '🪪' },
    { label: t('nav.settings'), href: '/settings', icon: '⚙️' },
    { label: t('nav.profile'), href: '/profile', icon: '👤' },
  ], [t]);

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
          {t('common.loading')}
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
