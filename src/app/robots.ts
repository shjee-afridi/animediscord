import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/dashboard',
          '/manage-servers',
          '/profile',
          '/server/*/details',  // Block server edit pages
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/anime-discord-servers',
          '/best-discord-servers',
          '/discord-server-directory',
          '/promote-discord-server',
          '/advertise-discord-server',
          '/bump-discord-server',
          '/find-discord-servers',
          '/discord-server-marketing',
          '/discord-server-list',
          '/leaderboards',
          '/reviews',
          '/partners-promotions',
          '/top-anime-server',
          '/terms',
          '/privacy',
          '/login',
          '/home',
          '/add-server',
          '/category/',
          '/server/',
          '/search/',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard',
          '/manage-servers',
          '/profile',
          '/server/*/details',
        ],
      },
    ],
    sitemap: 'https://www.animediscord.com/sitemap.xml',
  }
}
