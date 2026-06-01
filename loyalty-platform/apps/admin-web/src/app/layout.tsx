import type { Metadata } from 'next';
import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}
