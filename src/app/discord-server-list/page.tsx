'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DiscordServerListPage() {
  const router = useRouter();

  // No automatic redirect - only manual button for users

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Discord Server List</h1>
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
        <h1>Discord Server List - Complete Server Listing 2025</h1>
        <h2>Comprehensive Discord Server List and Database</h2>
        <p>Browse our extensive discord server list featuring thousands of servers. List your discord server, find new communities, and explore the most comprehensive discord server database available.</p>
        
        <h2>Server Listing Features</h2>
        <p>Discord server list, server list, list discord server, list server, discord server listings, server listings, discord listings, discord server database, server database, discord database, discord server registry, server registry, discord registry, discord server directory, server directory, discord directory, discord server index, server index, discord index, discord server catalog, server catalog, discord catalog.</p>
        
        <h2>List Management and Organization</h2>
        <p>Discord server collection, server collection, discord collection, discord server gallery, server gallery, discord gallery, discord server showcase, server showcase, discord showcase, discord server compilation, server compilation, discord compilation, discord server aggregation, server aggregation, discord aggregation, discord server curation, server curation, discord curation.</p>
        
        <h2>Server Discovery Through Lists</h2>
        <p>Browse discord servers, explore discord servers, discover discord servers through lists, find discord servers in lists, search discord server lists, navigate discord server lists, filter discord server lists, sort discord server lists, categorize discord server lists, organize discord server lists, manage discord server lists, maintain discord server lists.</p>
        
        <h2>Listing Benefits and Features</h2>
        <p>Discord server visibility through listing, server exposure via lists, discord promotion through listing, server marketing via lists, discord advertising through listing, server growth via lists, discord traffic through listing, server members via lists, discord engagement through listing, server activity via lists, discord popularity through listing, server recognition via lists.</p>
      </div>
    </div>
  );
}
