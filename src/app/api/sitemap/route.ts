import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const baseUrl = 'https://www.animediscord.com';
    
    // Fetch all servers
    const serversRes = await fetch(`${baseUrl}/api/servers`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!serversRes.ok) {
      throw new Error('Failed to fetch servers');
    }
    
    const servers = await serversRes.json();
    const serverList = Array.isArray(servers) ? servers : [];
    const currentDate = new Date().toISOString();
    
    // Generate sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/servers</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/add-server</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

    // Add server pages
    for (const server of serverList) {
      const lastmod = server.updatedAt ? new Date(server.updatedAt).toISOString() : currentDate;
      sitemap += `
  <url>
    <loc>${baseUrl}/server/${server.guildId}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }

    // Add category pages
    const categories = [
      'anime', 'gaming', 'art', 'music', 'community', 'roleplay', 
      'sfw', 'social', 'memes', 'study', 'tech', 'trading', 'lgbtq+', 'dating', 'events', 'streaming', 'bots', 'programming', 'language-learning', 'fitness', 'health', 'food', 'pets', 'travel', 'news', 'politics', 'education', 'comedy', 'movies', 'tv-shows', 'books', 'writing', 'photography', 'design', 'fashion', 'sports', 'cars', 'music-production', 'gaming-community', 'anime-community', 'art-community'
    ];
    
    for (const category of categories) {
      sitemap += `
  <url>
    <loc>${baseUrl}/category/${category}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`;
    }

    sitemap += `
</urlset>`;

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
