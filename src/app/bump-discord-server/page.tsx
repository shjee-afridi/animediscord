import { redirect } from 'next/navigation';
import { Metadata } from 'next';

// Server component that immediately redirects
export default function BumpDiscordServerRedirect() {
  redirect('/promote-discord-server');
}

export const metadata: Metadata = {
  title: 'Redirecting - Bump Discord Server',
  description: 'This page has been moved. Redirecting to our comprehensive server promotion guide.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: 'https://www.animediscord.com/promote-discord-server'
  },
};
