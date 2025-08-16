import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Data Protection & User Privacy | Anime Discord',
  description: 'Read our privacy policy to understand how we collect, use, and protect your personal information. Learn about data handling, cookies, and user rights.',
  keywords: [
    'privacy policy', 'data protection', 'user privacy', 'personal information',
    'data handling', 'cookies policy', 'user rights', 'data security'
  ],
  openGraph: {
    title: 'Privacy Policy - Data Protection & User Privacy',
    description: 'Read our privacy policy to understand how we collect, use, and protect your personal information.',
    url: '/privacy',
    type: 'website',
  },
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
