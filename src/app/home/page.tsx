// src/app/home/page.tsx
import { Metadata } from 'next';
import HomeRedirectClient from './HomeRedirectClient';

export const metadata: Metadata = {
  title: 'Page Moved - Anime Discord',
  description: 'This page has been moved to prevent duplicate content. Click to visit our main homepage and discover the best anime Discord servers.',
  alternates: {
    canonical: 'https://www.animediscord.com/'
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'Page Moved - Anime Discord',
    description: 'This page has been moved to prevent duplicate content. Visit our main homepage to discover anime Discord servers.',
    url: 'https://www.animediscord.com/',
    siteName: 'Anime Discord',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Page Moved - Anime Discord',
    description: 'This page has been moved to prevent duplicate content. Visit our main homepage.',
  },
};

export default function HomeRedirectPage() {
  return <HomeRedirectClient />;
}
