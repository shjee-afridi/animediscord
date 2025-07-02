// src/app/home/page.tsx
import { Metadata } from 'next';
import HomeClient from '../HomeClient';

export const metadata: Metadata = {
  title: 'Anime Discord Home - Best SFW Anime Discord Servers',
  description: 'Welcome to the Anime Discord Home page. Discover top anime Discord servers with active SFW anime communities, roleplay, and exclusive content.',
  alternates: {
    canonical: 'https://animediscord.com/home'
  },
  openGraph: {
    title: 'Anime Discord Home - Best SFW Anime Discord Servers',
    description: 'Welcome to the Anime Discord Home page. Discover top anime Discord servers with active SFW anime communities, roleplay, and exclusive content.',
    url: 'https://animediscord.com/home',
    siteName: 'Anime Discord',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anime Discord Home - Best SFW Anime Discord Servers',
    description: 'Welcome to the Anime Discord Home page. Discover top anime Discord servers with active SFW anime communities, roleplay, and exclusive content.',
  },
};

export default function HomeWithCanonical() {
  return <HomeClient />;
}
