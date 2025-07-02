'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DiscordServerMarketingPage() {
  const router = useRouter();

  // No automatic redirect - only manual button for users

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Discord Server Marketing</h1>
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
        <h1>Discord Server Marketing - Complete Marketing Guide 2025</h1>
        <h2>Master Discord Server Marketing Strategies</h2>
        <p>Learn advanced discord server marketing techniques, server promotion strategies, and community growth methods. Discover how to market your discord server effectively and build a thriving community.</p>
        
        <h2>Discord Marketing Fundamentals</h2>
        <p>Discord server marketing, server marketing, discord marketing, discord promotion, server promotion, discord advertising, server advertising, discord growth, server growth, discord boost, server boost, discord visibility, server visibility, discord exposure, server exposure, discord traffic, server traffic, discord engagement, server engagement, discord community marketing, server community marketing.</p>
        
        <h2>Advanced Marketing Strategies</h2>
        <p>Discord marketing strategies, server marketing strategies, discord promotional strategies, server promotional strategies, discord advertising strategies, server advertising strategies, discord growth strategies, server growth strategies, discord marketing campaigns, server marketing campaigns, discord promotional campaigns, server promotional campaigns, discord advertising campaigns, server advertising campaigns.</p>
        
        <h2>Content Marketing for Discord</h2>
        <p>Discord content marketing, server content marketing, discord content strategy, server content strategy, discord content creation, server content creation, discord content promotion, server content promotion, discord content distribution, server content distribution, discord content sharing, server content sharing, discord content engagement, server content engagement.</p>
        
        <h2>Social Media Integration</h2>
        <p>Discord social media marketing, server social media marketing, discord cross-platform promotion, server cross-platform promotion, discord external promotion, server external promotion, discord multi-channel marketing, server multi-channel marketing, discord integrated marketing, server integrated marketing, discord omnichannel approach, server omnichannel approach.</p>
      </div>
    </div>
  );
}
