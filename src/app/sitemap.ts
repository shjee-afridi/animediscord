import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.animediscord.com'
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/home`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/servers`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/add-server`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/manage-servers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ]
  // SEO Landing Pages - High priority for crawlers
  const seoPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/promote-discord-server`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/advertise-discord-server`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bump-discord-server`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/discord-server-directory`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/find-discord-servers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/discord-server-marketing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/best-discord-servers`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/discord-server-list`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/anime-discord-servers`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  // Fetch all servers for dynamic sitemap generation
  let serverPages: MetadataRoute.Sitemap = []
  
  try {
    const res = await fetch(`${baseUrl}/api/servers`, {
      next: { revalidate: 3600 } // Revalidate every hour
    })
    
    if (res.ok) {
      const servers = await res.json()
      
      serverPages = servers.map((server: any) => ({
        url: `${baseUrl}/server/${server.guildId}`,
        lastModified: server.updatedAt ? new Date(server.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    }
  } catch (error) {
    console.error('Error fetching servers for sitemap:', error)
  }

  // Fetch categories for category pages
  let categoryPages: MetadataRoute.Sitemap = []
  
  try {
    // Add category pages based on your categories
    const categories = [
      'anime', 'gaming', 'art', 'music', 'community', 'roleplay', 
      'sfw', 'social', 'memes', 'study', 'tech', 'trading', 'lgbtq+', 'dating', 'events', 'streaming', 'bots', 'programming', 'language-learning', 'fitness', 'health', 'food', 'pets', 'travel', 'news', 'politics', 'education', 'comedy', 'movies', 'tv-shows', 'books', 'writing', 'photography', 'design', 'fashion', 'sports', 'cars', 'music-production', 'gaming-community', 'anime-community', 'art-community'
    ]
    
    categoryPages = categories.map(category => ({
      url: `${baseUrl}/category/${category}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error generating category pages for sitemap:', error)
  }

  return [...staticPages, ...serverPages, ...categoryPages]
}
