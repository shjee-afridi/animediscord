import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'User Profile - Manage Account & Server Reviews | Anime Discord',
  description: 'View your user profile, manage your account settings, see your server reviews and favorites. Access your personal Discord server dashboard.',
  keywords: [
    'discord user profile', 'account settings', 'server reviews', 'user dashboard',
    'discord profile management', 'my servers', 'user settings', 'discord account'
  ],
  openGraph: {
    title: 'User Profile - Manage Account & Server Reviews',
    description: 'View your user profile, manage your account settings, see your server reviews and favorites.',
    url: '/profile',
    type: 'website',
    images: [
      {
        url: '/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'User Profile',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'User Profile - Manage Account & Server Reviews',
    description: 'View your user profile, manage your account settings, see your server reviews and favorites.',
    images: ['/icon-512x512.png'],
  },
  alternates: {
    canonical: '/profile',
  },
  robots: {
    index: false,
    follow: true,
  },
};

interface LayoutProps {
  children: ReactNode;
}

export default function ProfileLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
