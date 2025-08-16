import React from 'react';

interface StructuredDataProps {
  data: Record<string, any>;
}

export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Common structured data generators
export const generateWebsiteStructuredData = (url: string) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Anime Discord',
  url: url,
  description: 'Discover the best Discord servers! Browse anime, gaming, SFW communities and more.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${url}/search/{search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
});

export const generateOrganizationStructuredData = (url: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Anime Discord',
  url: url,
  description: 'The best Discord server directory with thousands of active communities.',
  logo: `${url}/icon-512x512.png`,
  sameAs: [],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: 'English',
  },
});

export const generateBreadcrumbStructuredData = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const generateWebPageStructuredData = (
  url: string,
  title: string,
  description: string,
  datePublished?: string,
  dateModified?: string
) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: title,
  description: description,
  url: url,
  isPartOf: {
    '@type': 'WebSite',
    name: 'Anime Discord',
    url: 'https://www.animediscord.com',
  },
  ...(datePublished && { datePublished }),
  ...(dateModified && { dateModified }),
  inLanguage: 'en-US',
  potentialAction: {
    '@type': 'ReadAction',
    target: url,
  },
});
