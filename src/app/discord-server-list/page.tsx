import { redirect } from 'next/navigation';
import { Metadata } from 'next';

// Server component that immediately redirects
export default function DiscordServerListRedirect() {
  redirect('/discord-server-directory');
}

export const metadata: Metadata = {
  title: 'Redirecting - Discord Server List',
  description: 'This page has been moved. Redirecting to our comprehensive Discord server directory.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: 'https://www.animediscord.com/discord-server-directory'
  },
};
