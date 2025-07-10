// src/app/terms/page.tsx
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Dynamically import the client component
const TermsClient = dynamic(() => import('./TermsClient'), {
  loading: () => <div className="min-h-screen bg-neutral-950 text-white pt-14 flex items-center justify-center">Loading...</div>
});

export const metadata: Metadata = {
  title: 'Terms of Service - Anime Discord',
  description: 'Terms of Service, licensing, and copyright information for Anime Discord server directory.',
  keywords: 'terms of service, license, copyright, legal, Anime Discord',
  openGraph: {
    title: 'Terms of Service - Anime Discord',
    description: 'Terms of Service, licensing, and copyright information for Anime Discord server directory.',
    url: 'https://www.animediscord.com/terms',
    type: 'website',
  },
};

export default function TermsPage() {
  return <TermsClient />;
}
