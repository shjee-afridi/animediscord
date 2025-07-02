'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FindDiscordServersPage() {
  const router = useRouter();

  // No automatic redirect - only manual button for users

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Find Discord Servers</h1>
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
        <h1>Find Discord Servers - Ultimate Server Discovery Guide 2025</h1>
        <h2>How to Find the Best Discord Servers</h2>
        <p>Learn how to find discord servers, search discord servers, discover new communities, and join the best discord servers. Explore our comprehensive guide to discord server discovery and server finding techniques.</p>
        
        <h2>Discord Server Discovery Methods</h2>
        <p>Find discord server, search discord server, discover discord server, join discord server, discord server finder, server finder, discord server search, server search, discord server discovery, server discovery, discord discovery, locate discord server, identify discord server, recognize discord server, spot discord server, detect discord server, uncover discord server, reveal discord server, expose discord server.</p>
        
        <h2>Server Search Techniques</h2>
        <p>Discord server searching, server searching, discord searching, discord server browsing, server browsing, discord browsing, discord server surfing, server surfing, discord surfing, discord server navigating, server navigating, discord navigating, discord server exploring, server exploring, discord exploring, discord server investigation, server investigation, discord investigation.</p>
        
        <h2>Community Discovery</h2>
        <p>Discord community discovery, server community discovery, discord community finding, server community finding, discord community search, server community search, discord community exploration, server community exploration, discord community investigation, server community investigation, discord community browsing, server community browsing, discord community navigation, server community navigation.</p>
        
        <h2>Server Types and Categories</h2>
        <p>Best discord servers, top discord servers, popular discord servers, trending discord servers, featured discord servers, new discord servers, active discord servers, growing discord servers, public discord servers, open discord servers, free discord servers, verified discord servers, official discord servers, partnered discord servers, community discord servers, social discord servers, gaming discord servers, anime discord servers, music discord servers, art discord servers.</p>
      </div>
    </div>
  );
}
