import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Loyalty Member',
  description: 'Member Loyalty Portal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
