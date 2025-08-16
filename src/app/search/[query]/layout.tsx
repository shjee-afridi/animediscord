import { Metadata } from 'next';
import { ReactNode } from 'react';

export async function generateMetadata({ params }: { params: { query: string } }): Promise<Metadata> {
  const searchQuery = decodeURIComponent(params.query);
  
  return {
    title: `Search Results for "${searchQuery}" - Discord Server Search | Anime Discord`,
    description: `Search results for "${searchQuery}" Discord servers. Find the best Discord communities matching your interests. Discover servers, join communities, and connect with people.`,
    keywords: [
      `${searchQuery} discord servers`, `search discord servers`, `find ${searchQuery} discord`,
      `${searchQuery} community discord`, `discord server search`, `${searchQuery} servers`,
      `search discord communities`, `find discord servers`, `discord directory search`
    ],
    openGraph: {
      title: `Search Results for "${searchQuery}" - Discord Server Search`,
      description: `Search results for "${searchQuery}" Discord servers. Find the best Discord communities matching your interests.`,
      url: `/search/${params.query}`,
      type: 'website',
      images: [
        {
          url: '/icon-512x512.png',
          width: 512,
          height: 512,
          alt: `Search Discord Servers for ${searchQuery}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Search Results for "${searchQuery}" - Discord Server Search`,
      description: `Search results for "${searchQuery}" Discord servers. Find the best Discord communities matching your interests.`,
      images: ['/icon-512x512.png'],
    },
    alternates: {
      canonical: `/search/${params.query}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

interface LayoutProps {
  children: ReactNode;
}

export default function SearchLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
