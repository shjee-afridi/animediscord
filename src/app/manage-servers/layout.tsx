// src/app/manage-servers/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Discord Servers - Anime Discord Dashboard',
  description: 'Manage your Discord servers on Anime Discord. Add, edit, and promote your SFW anime Discord servers to reach more members.',
  alternates: {
    canonical: 'https://animediscord.com/manage-servers'
  },
  openGraph: {
    title: 'Manage Discord Servers - Anime Discord Dashboard',
    description: 'Manage your Discord servers on Anime Discord. Add, edit, and promote your SFW anime Discord servers to reach more members.',
    url: 'https://animediscord.com/manage-servers',
    siteName: 'Anime Discord',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Manage Discord Servers - Anime Discord Dashboard',
    description: 'Manage your Discord servers on Anime Discord. Add, edit, and promote your SFW anime Discord servers to reach more members.',
  },
  robots: {
    index: false, // This is a user dashboard, should not be indexed
    follow: true
  }
};

export default function ManageServersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
