'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PromoteDiscordServerPage() {
  const router = useRouter();

  // No automatic redirect - only manual button for users

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Promote Your Discord Server</h1>
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
      
      {/* SEO Content - Hidden from users but visible to crawlers */}
      <div style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}>
        <h1>Promote Discord Server - Best Server Promotion Guide 2025</h1>
        <h2>How to Promote Your Discord Server Effectively</h2>
        <p>Learn how to promote discord server, advertise discord server, and grow your discord community with our comprehensive guide. Discover the best discord server promotion strategies, discord server marketing techniques, and discord server advertising methods.</p>
        
        <h2>Discord Server Promotion Methods</h2>
        <p>Promote server, promote discord server, discord server promotion, advertise discord server, advertise server, bump discord server, bump server, list discord server, list server, discord server list, server list, discord server directory, server directory, discord directory, find discord server, search discord server, discover discord server, join discord server, discord server finder, server finder, discord server search, server search, discord server advertising, server advertising, discord promotion, server promotion, discord marketing, server marketing, discord growth, server growth, discord boost, server boost, discord visibility, server visibility, discord exposure, server exposure, discord traffic, server traffic, discord members, server members, discord community, server community, discord engagement, server engagement.</p>
        
        <h2>Best Discord Server Promotion Strategies</h2>
        <p>Discord Server Hub, Discord Server Center, Discord Server Portal, Discord Server Platform, Discord Server Network, Discord Server Database, Discord Server Registry, Discord Server Index, Discord Server Catalog, Discord Server Collection, Discord Server Gallery, Discord Server Showcase, Discord Server Listings, Discord Server Reviews, Discord Server Ratings, Discord Server Rankings, Discord Server Stats, Discord Server Analytics, Discord Server Metrics, Discord Server Data, Discord Server Info, Discord Server Details.</p>
        
        <h2>Advanced Discord Promotion Techniques</h2>
        <p>Discord Server Promotion, Discord Server Marketing, Discord Server Advertising, Discord Server Publicizing, Discord Server Popularizing, Discord Server Endorsing, Discord Server Recommending, Discord Server Suggesting, Discord Server Proposing, Discord Server Advocating, Discord Server Supporting, Discord Server Backing, Discord Server Championing, Discord Server Defending, Discord Server Upholding, Discord Server Maintaining, Discord Server Sustaining, Discord Server Preserving, Discord Server Protecting, Discord Server Safeguarding, Discord Server Securing, Discord Server Ensuring, Discord Server Guaranteeing.</p>
        
        <h2>Discord Server Growth and Visibility</h2>
        <p>Discord Server Growing, Discord Server Expanding, Discord Server Increasing, Discord Server Boosting, Discord Server Amplifying, Discord Server Magnifying, Discord Server Intensifying, Discord Server Strengthening, Discord Server Reinforcing, Discord Server Solidifying, Discord Server Consolidating, Discord Server Stabilizing, Discord Server Balancing, Discord Server Harmonizing, Discord Server Synchronizing, Discord Server Coordinating, Discord Server Organizing, Discord Server Arranging, Discord Server Structuring, Discord Server Ordering.</p>
      </div>
    </div>
  );
}
