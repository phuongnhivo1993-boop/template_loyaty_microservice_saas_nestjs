'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { label: 'Home', href: '/dashboard', icon: '🏠' },
  { label: 'Wallet', href: '/wallet', icon: '💰' },
  { label: 'Vouchers', href: '/vouchers', icon: '🎟️' },
  { label: 'Orders', href: '/orders', icon: '🛒' },
  { label: 'Profile', href: '/profile', icon: '👤' },
];

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [refreshing, setRefreshing] = useState(false);
  const touchStartY = useRef(0);

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

  return (
    <div className="container" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {refreshing && (
        <div style={{ textAlign: 'center', padding: '16px', fontSize: '14px', color: 'var(--primary)' }}>
          Refreshing...
        </div>
      )}
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
