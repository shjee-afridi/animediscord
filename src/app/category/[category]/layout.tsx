import { Metadata } from 'next';
import { ReactNode } from 'react';

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const categoryName = decodeURIComponent(params.category);
  const capitalizedCategory = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  
  return {
    title: `${capitalizedCategory} Discord Servers - Find Best ${capitalizedCategory} Communities | Anime Discord`,
    description: `Discover the best ${categoryName} Discord servers and communities. Join active ${categoryName} servers, connect with like-minded people, and explore ${categoryName} content.`,
    keywords: [
      `${categoryName} discord servers`, `best ${categoryName} discord`, `${categoryName} community discord`,
      `${categoryName} servers`, `discord ${categoryName}`, `${categoryName} discord list`,
      `join ${categoryName} discord`, `${categoryName} discord directory`, `${categoryName} chat discord`
    ],
    openGraph: {
      title: `${capitalizedCategory} Discord Servers - Find Best ${capitalizedCategory} Communities`,
      description: `Discover the best ${categoryName} Discord servers and communities. Join active ${categoryName} servers and connect with like-minded people.`,
      url: `/category/${params.category}`,
      type: 'website',
      images: [
        {
          url: '/icon-512x512.png',
          width: 512,
          height: 512,
          alt: `${capitalizedCategory} Discord Servers`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${capitalizedCategory} Discord Servers - Find Best ${capitalizedCategory} Communities`,
      description: `Discover the best ${categoryName} Discord servers and communities. Join active ${categoryName} servers and connect with like-minded people.`,
      images: ['/icon-512x512.png'],
    },
    alternates: {
      canonical: `/category/${params.category}`,
    },
  };
}

interface LayoutProps {
  children: ReactNode;
}

export default function CategoryLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
