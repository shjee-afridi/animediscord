import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { guildId: string } }): Promise<Metadata> {
  try {
    const res = await fetch(`https://www.animediscord.com/api/servers/${params.guildId}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!res.ok) {
      return {
        title: 'Server Details - Anime Discord',
        description: 'View detailed information about this Discord server.',
        robots: { index: false, follow: true },
      };
    }
    
    const server = await res.json();
    const serverName = server.name || 'Discord Server';
    const serverDescription = server.short_description || server.description || 'A Discord server community';
    
    return {
      title: `Edit ${serverName} - Server Details | Anime Discord`,
      description: `Edit and manage details for ${serverName}. Update server information, description, categories, and settings.`,
      robots: { index: false, follow: true },
      alternates: {
        canonical: `/server/${params.guildId}/details`,
      },
    };
  } catch (error) {
    return {
      title: 'Server Details - Anime Discord',
      description: 'View detailed information about this Discord server.',
      robots: { index: false, follow: true },
    };
  }
}

export default function ServerDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
