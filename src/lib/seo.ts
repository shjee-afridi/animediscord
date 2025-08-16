import { Metadata } from 'next';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  url?: string;
  image?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
  canonical?: string;
}

export function generateSEOMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    url,
    image = '/icon-512x512.png',
    type = 'website',
    noIndex = false,
    canonical
  } = config;

  const fullTitle = title.includes('Anime Discord') ? title : `${title} | Anime Discord`;
  const fullUrl = url ? `https://www.animediscord.com${url}` : 'https://www.animediscord.com';

  return {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords.join(', ') : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: 'Anime Discord',
      images: [
        {
          url: image,
          width: 512,
          height: 512,
          alt: title,
        },
      ],
      locale: 'en_US',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@animediscord',
    },
    robots: {
      index: !noIndex,
      follow: true,
    },
    alternates: canonical ? {
      canonical,
    } : undefined,
  };
}

export const commonKeywords = [
  'discord servers',
  'best discord servers',
  'discord server list',
  'discord directory',
  'discord communities',
  'join discord servers',
  'find discord servers',
  'discord server finder',
  'server directory',
  'discord hub'
];

export const animeKeywords = [
  'anime discord',
  'anime servers',
  'anime community',
  'sfw anime discord',
  'anime roleplay discord',
  'manga discord',
  'otaku discord',
  'weeb discord'
];

export const promotionKeywords = [
  'promote discord server',
  'discord server promotion',
  'advertise discord server',
  'grow discord server',
  'increase discord members',
  'discord server marketing',
  'boost discord server',
  'discord server advertising'
];
