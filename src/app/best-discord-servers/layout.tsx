import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Best Discord Servers - Top Server Rankings 2025 | Anime Discord',
  description: 'Discover the best Discord servers of 2025! Top-rated servers across gaming, anime, SFW communities, and more. Find popular Discord servers with active members.',
  keywords: [
    'best discord servers', 'top discord servers', 'popular discord servers', 'highest rated discord servers',
    'best discord communities', 'top server rankings', 'popular discord', 'best servers 2025',
    'discord server rankings', 'top rated servers', 'featured discord servers', 'trending discord servers'
  ],
  openGraph: {
    title: 'Best Discord Servers - Top Server Rankings 2025',
    description: 'Discover the best Discord servers of 2025! Top-rated servers across gaming, anime, SFW communities, and more.',
    url: '/best-discord-servers',
    type: 'website',
    images: [
      {
        url: '/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Best Discord Servers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Discord Servers - Top Server Rankings 2025',
    description: 'Discover the best Discord servers of 2025! Top-rated servers across gaming, anime, SFW communities, and more.',
    images: ['/icon-512x512.png'],
  },
  alternates: {
    canonical: '/best-discord-servers',
  },
};

interface LayoutProps {
  children: ReactNode;
}

export default function BestDiscordServersLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
