import { Metadata } from 'next';
import LoginClient from './LoginClient';

export const metadata: Metadata = {
  title: 'Login to Anime Discord - Access Premium SFW Communities',
  description: 'Login to your Anime Discord account to access premium SFW anime communities, manage your servers, and connect with thousands of members in exclusive 18+ Discord servers.',
  keywords: 'anime discord login, sfw anime login, adult discord access, premium server login, 18+ community access, discord authentication',
  alternates: {
    canonical: 'https://animediscord.com/login'
  },
  openGraph: {
    title: 'Login to Anime Discord - Access Premium SFW Communities',
    description: 'Login to your Anime Discord account to access premium SFW anime communities and exclusive content.',
    url: 'https://animediscord.com/login',
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
    title: 'Login to Anime Discord - Access Premium SFW Communities',
    description: 'Login to your Anime Discord account to access premium SFW anime communities.',
  },
};

export default function LoginPage() {
  return <LoginClient />;
}
