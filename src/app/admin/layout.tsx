import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Admin Panel - Server Management | Anime Discord',
  description: 'Admin panel for managing Discord servers, user accounts, and site administration. Access restricted to authorized administrators.',
  robots: {
    index: false,
    follow: false,
  },
};

interface LayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
