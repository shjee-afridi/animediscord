'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BestDiscordServersPage() {
  const router = useRouter();

  // No automatic redirect - only manual button for users

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Best Discord Servers</h1>
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
        <h1>Best Discord Servers - Top Server Rankings 2025</h1>
        <h2>Discover the Best Discord Servers of 2025</h2>
        <p>Find the best discord servers, top discord servers, and most popular discord communities. Explore our curated list of the highest rated discord servers across all categories and genres.</p>
        
        <h2>Top Rated Discord Servers</h2>
        <p>Best discord servers, top discord servers, popular discord servers, trending discord servers, featured discord servers, recommended discord servers, highest rated discord servers, most popular discord servers, award winning discord servers, premium discord servers, elite discord servers, exclusive discord servers, verified discord servers, official discord servers, partnered discord servers.</p>
        
        <h2>Server Categories and Rankings</h2>
        <p>Best gaming discord servers, top anime discord servers, popular music discord servers, trending art discord servers, featured programming discord servers, recommended study discord servers, highest rated meme discord servers, most popular community discord servers, best social discord servers, top roleplay discord servers, popular nsfw discord servers, trending 18+ discord servers, featured adult discord servers, recommended hentai discord servers.</p>
        
        <h2>Server Quality Metrics</h2>
        <p>Discord server ratings, server ratings, discord ratings, discord server reviews, server reviews, discord reviews, discord server rankings, server rankings, discord rankings, discord server stats, server stats, discord stats, discord server metrics, server metrics, discord metrics, discord server analytics, server analytics, discord analytics, discord server scores, server scores, discord scores.</p>
        
        <h2>Community Excellence</h2>
        <p>Discord server quality, server quality, discord quality, discord community excellence, server community excellence, discord member satisfaction, server member satisfaction, discord engagement levels, server engagement levels, discord activity rates, server activity rates, discord participation metrics, server participation metrics, discord interaction quality, server interaction quality.</p>
      </div>
    </div>
  );
}
