import { redirect } from 'next/navigation';
import { Metadata } from 'next';

// Server component that immediately redirects
export default function FindDiscordServersRedirect() {
  redirect('/discord-server-directory');
}

export const metadata: Metadata = {
  title: 'Redirecting - Find Discord Servers',
  description: 'This page has been moved. Redirecting to our comprehensive Discord server directory.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: 'https://www.animediscord.com/discord-server-directory'
  },
};
