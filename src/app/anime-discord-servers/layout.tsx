import { ReactNode } from 'react';

export const metadata = {
  title: 'Best Anime Discord Servers 2025 - Join Top SFW Anime Communities | Anime Discord',
  description: 'Find the top anime Discord servers and communities. Join thousands of anime fans discussing your favorite series, sharing art, and making friends. Popular anime servers for One Piece, Naruto, Attack on Titan, Demon Slayer.',
  keywords: [
    'anime discord servers', 'best anime discord', 'anime community discord', 'anime servers 2025',
    'one piece discord', 'naruto discord', 'attack on titan discord', 'demon slayer discord',
    'anime roleplay discord', 'anime art discord', 'anime discussion discord', 'anime gaming discord',
    'anime watch parties', 'sfw anime discord', 'anime fans discord', 'manga discord'
  ],
  openGraph: {
    title: 'Best Anime Discord Servers 2025 - Join Top SFW Anime Communities',
    description: 'Find the top anime Discord servers and communities. Join thousands of anime fans discussing your favorite series, sharing art, and making friends.',
    url: '/anime-discord-servers',
    siteName: 'Anime Discord',
    type: 'website',
    images: [
      {
        url: '/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Anime Discord Servers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Anime Discord Servers 2025 - Join Top SFW Anime Communities',
    description: 'Find the top anime Discord servers and communities. Join thousands of anime fans discussing your favorite series, sharing art, and making friends.',
  },
  alternates: {
    canonical: '/anime-discord-servers',
  },
};

interface LayoutProps {
  children: ReactNode;
}

export default function AnimeDiscordServersLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
