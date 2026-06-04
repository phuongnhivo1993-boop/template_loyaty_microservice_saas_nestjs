import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/Toast';
import RealtimeNotifications from '@/components/RealtimeNotifications';

export const metadata: Metadata = {
  title: 'Loyalty Platform - Admin',
  description: 'Loyalty Platform Administration Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <ToastProvider>
          {children}
          <RealtimeNotifications />
        </ToastProvider>
      </body>
    </html>
  );
}
