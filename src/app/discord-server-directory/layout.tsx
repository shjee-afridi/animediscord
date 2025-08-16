import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Discord Server Directory - Complete Server Listing Guide 2025 | Anime Discord',
  description: 'Complete Discord server directory with thousands of active servers. Find, join, and list Discord servers. Browse by categories like anime, gaming, SFW communities and more.',
  keywords: [
    'discord server directory', 'discord directory', 'list discord servers', 'find discord servers',
    'discord server list', 'server directory', 'discord server finder', 'browse discord servers',
    'discord server listings', 'server listings', 'discord communities', 'join discord servers'
  ],
  openGraph: {
    title: 'Discord Server Directory - Complete Server Listing Guide 2025',
    description: 'Complete Discord server directory with thousands of active servers. Find, join, and list Discord servers.',
    url: '/discord-server-directory',
    type: 'website',
    images: [
      {
        url: '/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Discord Server Directory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discord Server Directory - Complete Server Listing Guide 2025',
    description: 'Complete Discord server directory with thousands of active servers. Find, join, and list Discord servers.',
    images: ['/icon-512x512.png'],
  },
  alternates: {
    canonical: '/discord-server-directory',
  },
};

interface LayoutProps {
  children: ReactNode;
}

export default function DirectoryLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
