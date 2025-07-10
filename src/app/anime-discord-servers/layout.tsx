import { ReactNode } from 'react';

export const metadata = {
  title: 'Best Anime Discord Servers 2025 | Join Top Anime Communities',
  description: 'Find the best anime Discord servers and communities. Join thousands of anime fans discussing One Piece, Naruto, Attack on Titan, and more. Free to join!',
  keywords: 'anime discord servers, anime discord, anime community, anime chat, anime roleplay, best anime servers, anime discussion, anime fans discord, anime server list, join anime discord, one piece discord, naruto discord, attack on titan discord, demon slayer discord, my hero academia discord, anime watch party, anime roleplay discord, nsfw anime discord, anime art discord, anime gaming discord',
  canonical: 'https://www.animediscord.com/anime-discord-servers',
  robots: 'index, follow',
  openGraph: {
    title: 'Best Anime Discord Servers 2025 | Join Top Anime Communities',
    description: 'Find the best anime Discord servers and communities. Join thousands of anime fans discussing your favorite series.',
    url: 'https://www.animediscord.com/anime-discord-servers',
    siteName: 'Anime Discord',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Anime Discord Servers 2025',
    description: 'Find the best anime Discord servers and communities. Join thousands of anime fans.',
  },
};

interface LayoutProps {
  children: ReactNode;
}

export default function AnimeDiscordServersLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
