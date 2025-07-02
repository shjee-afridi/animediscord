'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdvertiseDiscordServerPage() {
  const router = useRouter();

  // No automatic redirect - only manual button for users

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Advertise Your Discord Server</h1>
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
        <h1>Advertise Discord Server - Complete Server Advertising Guide 2025</h1>
        <h2>How to Advertise Your Discord Server for Maximum Growth</h2>
        <p>Discover the best methods to advertise discord server, promote discord server, and grow your discord community. Learn effective discord server advertising strategies, server marketing techniques, and promotional methods.</p>
        
        <h2>Discord Server Advertising Strategies</h2>
        <p>Advertise discord server, advertise server, discord server advertising, server advertising, discord advertising, server promotion, discord promotion, server marketing, discord marketing, discord server promotion, promote discord server, promote server, discord server marketing, server growth, discord growth, discord boost, server boost, discord visibility, server visibility, discord exposure, server exposure, discord traffic, server traffic.</p>
        
        <h2>Effective Server Advertising Methods</h2>
        <p>Discord server directory, server directory, discord directory, discord server list, server list, list discord server, list server, discord server listings, server listings, discord server database, server database, discord database, discord server registry, server registry, discord registry, discord server index, server index, discord index, discord server catalog, server catalog, discord catalog.</p>
        
        <h2>Advanced Advertising Techniques</h2>
        <p>Discord server advertising campaigns, server advertising methods, discord advertising strategies, server promotional techniques, discord marketing campaigns, server advertising tools, discord promotional methods, server marketing strategies, discord advertising platforms, server promotional campaigns, discord marketing tools, server advertising guides, discord promotional strategies, server marketing methods, discord advertising techniques, server promotional tools.</p>
        
        <h2>Server Marketing and Promotion</h2>
        <p>Discord server publicizing, server publicizing, discord publicizing, discord server popularizing, server popularizing, discord popularizing, discord server endorsing, server endorsing, discord endorsing, discord server recommending, server recommending, discord recommending, discord server suggesting, server suggesting, discord suggesting, discord server advocating, server advocating, discord advocating, discord server supporting, server supporting, discord supporting.</p>
      </div>
    </div>
  );
}
