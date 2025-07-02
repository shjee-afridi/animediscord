// src/app/page.tsx
import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Best Anime Discord Servers - Top NSFW Anime Communities 2025',
  description: 'Discover the best anime Discord servers with active NSFW anime communities, roleplay, and exclusive content. Join thousands of members in premium 18+ Discord servers.',
  keywords: 'anime discord, nsfw anime discord, best anime server, 18+ anime community, anime roleplay, adult anime chat, exclusive anime content, discord nsfw, top anime server, anime chatroom',
  alternates: {
    canonical: 'https://animediscord.com'
  },
  openGraph: {
    title: 'Best Anime Discord Servers - Top NSFW Anime Communities 2025',
    description: 'Discover the best anime Discord servers with active NSFW anime communities, roleplay, and exclusive content. Join thousands of members in premium 18+ Discord servers.',
    url: 'https://animediscord.com',
    siteName: 'Anime Discord',
    type: 'website',
    images: [
      {
        url: '/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Anime Discord Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Anime Discord Servers - Top NSFW Anime Communities 2025',
    description: 'Discover the best anime Discord servers with active NSFW anime communities, roleplay, and exclusive content.',
  },
};

export default function Home() {
  return <HomeClient />;
}