'use client';

import { useEffect, useCallback, useState, useRef, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [theme, setTheme] = useState('light');
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const mainNavItems = navItems.slice(0, 5);
  const moreNavItems = navItems.slice(5);

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
    setSidebarOpen(false);
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
    <div className="member-layout" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {refreshing && (
        <div style={{ textAlign: 'center', padding: '16px', fontSize: '14px', color: 'var(--primary)' }}>
          {t('common.loading')}
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="desktop-sidebar">
        <div className="sidebar-header">
          <span className="sidebar-logo">⭐</span>
          <span className="sidebar-brand">{t('nav.home')}</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.href}
              onClick={() => handleNav(item.href)}
              className={`sidebar-item ${pathname === item.href || pathname.startsWith(item.href + '/') ? 'active' : ''}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button onClick={toggleTheme} className="sidebar-item" aria-label="Toggle theme">
            <span className="sidebar-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span className="sidebar-label">{theme === 'dark' ? t('nav.lightMode', 'Light Mode') : t('nav.darkMode', 'Dark Mode')}</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Mobile sidebar (drawer) */}
      <aside className={`mobile-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-logo">⭐</span>
          <span className="sidebar-brand">{t('nav.home')}</span>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.href}
              onClick={() => handleNav(item.href)}
              className={`sidebar-item ${pathname === item.href || pathname.startsWith(item.href + '/') ? 'active' : ''}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Desktop floating theme toggle */}
      <button
        onClick={toggleTheme}
        className="theme-toggle-desktop"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      {/* Main content area */}
      <div className="main-content">
        {/* Mobile top bar */}
        <div className="mobile-topbar">
          <button className="hamburger" onClick={() => setSidebarOpen(true)} aria-label="Menu">
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
          <button
            onClick={toggleTheme}
            className="theme-toggle-mobile"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
        <div className="content">
          {children}
        </div>
      </div>

      {/* Mobile bottom nav (5 main items only) */}
      <nav className="nav-bottom">
        {mainNavItems.map(item => (
          <button
            key={item.href}
            onClick={() => handleNav(item.href)}
            className={`nav-item ${pathname === item.href || pathname.startsWith(item.href + '/') ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
        <button
          onClick={() => setSidebarOpen(true)}
          className={`nav-item ${sidebarOpen ? 'active' : ''}`}
        >
          <span className="nav-icon">📋</span>
          {t('nav.more', 'More')}
        </button>
      </nav>
    </div>
  );
}
