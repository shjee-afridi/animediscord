import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Dashboard - Manage Your Discord Servers | Anime Discord',
  description: 'Manage your Discord servers, track performance, edit server details, and monitor server statistics. Complete dashboard for Discord server owners.',
  keywords: [
    'discord server dashboard', 'manage discord server', 'discord server analytics', 'server management',
    'discord server stats', 'server administration', 'discord server tools', 'server owner dashboard'
  ],
  openGraph: {
    title: 'Dashboard - Manage Your Discord Servers',
    description: 'Manage your Discord servers, track performance, edit server details, and monitor server statistics.',
    url: '/dashboard',
    type: 'website',
    images: [
      {
        url: '/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Discord Server Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dashboard - Manage Your Discord Servers',
    description: 'Manage your Discord servers, track performance, edit server details, and monitor server statistics.',
    images: ['/icon-512x512.png'],
  },
  alternates: {
    canonical: '/dashboard',
  },
  robots: {
    index: false,
    follow: true,
  },
};

interface LayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
