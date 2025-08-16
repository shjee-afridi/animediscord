import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Add Your Discord Server - List & Promote Your Server | Anime Discord',
  description: 'Add and promote your Discord server for free. Increase your server members, boost visibility, and grow your community. Join thousands of servers in our directory.',
  keywords: [
    'add discord server', 'promote discord server', 'list discord server', 'discord server promotion',
    'advertise discord server', 'discord server growth', 'increase discord members', 'discord server directory',
    'submit discord server', 'discord server marketing', 'grow discord server', 'discord server advertising'
  ],
  openGraph: {
    title: 'Add Your Discord Server - List & Promote Your Server',
    description: 'Add and promote your Discord server for free. Increase your server members, boost visibility, and grow your community.',
    url: '/add-server',
    type: 'website',
    images: [
      {
        url: '/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Add Discord Server',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Add Your Discord Server - List & Promote Your Server',
    description: 'Add and promote your Discord server for free. Increase your server members, boost visibility, and grow your community.',
    images: ['/icon-512x512.png'],
  },
  alternates: {
    canonical: '/add-server',
  },
};

interface LayoutProps {
  children: ReactNode;
}

export default function AddServerLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
