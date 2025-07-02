'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DiscordServerDirectoryPage() {
  const router = useRouter();

  // No automatic redirect - only manual button for users

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Discord Server Directory</h1>
        <p className="text-lg mb-6">
          This page contains SEO optimized content. Click below to visit our main directory.
        </p>
        <button 
          onClick={() => router.push('/')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Go to Home Page
        </button>
      </div>
      
      <div style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}>
        <h1>Discord Server Directory - Complete Server Listing Guide 2025</h1>
        <h2>Find and List Discord Servers in Our Directory</h2>
        <p>Discover the ultimate discord server directory with thousands of servers. Find discord servers, search discord servers, and explore the best discord server listings. List your server in our comprehensive discord directory.</p>
        
        <h2>Discord Server Directory Features</h2>
        <p>Discord server directory, server directory, discord directory, discord server list, server list, list discord server, list server, discord server listings, server listings, discord listings, discord server database, server database, discord database, discord server registry, server registry, discord registry, discord server index, server index, discord index, discord server catalog, server catalog, discord catalog.</p>
        
        <h2>Server Discovery and Search</h2>
        <p>Find discord server, search discord server, discover discord server, join discord server, discord server finder, server finder, discord server search, server search, discord server discovery, server discovery, discord discovery, browse discord servers, explore discord servers, locate discord servers, identify discord servers, recognize discord servers, spot discord servers, detect discord servers.</p>
        
        <h2>Server Categories and Types</h2>
        <p>Discord server categories, server categories, discord categories, gaming discord servers, anime discord servers, music discord servers, art discord servers, programming discord servers, study discord servers, meme discord servers, community discord servers, social discord servers, roleplay discord servers, nsfw discord servers, 18+ discord servers, adult discord servers, hentai discord servers.</p>
        
        <h2>Directory Management and Organization</h2>
        <p>Discord server collection, server collection, discord collection, discord server gallery, server gallery, discord gallery, discord server showcase, server showcase, discord showcase, discord server hub, server hub, discord hub, discord server center, server center, discord center, discord server portal, server portal, discord portal, discord server platform, server platform, discord platform, discord server network, server network, discord network.</p>
      </div>
    </div>
  );
}
