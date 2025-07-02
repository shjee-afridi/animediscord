'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BumpDiscordServerPage() {
  const router = useRouter();

  // No automatic redirect - only manual button for users

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Bump Your Discord Server</h1>
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
        <h1>Bump Discord Server - Server Bumping Guide 2025</h1>
        <h2>How to Bump Your Discord Server for Better Visibility</h2>
        <p>Learn how to bump discord server effectively, increase server visibility, and grow your discord community through strategic server bumping techniques and discord server promotion methods.</p>
        
        <h2>Discord Server Bumping Strategies</h2>
        <p>Bump discord server, bump server, discord server bump, server bump, discord bump, server bumping, discord bumping, discord server bumping, server bumping techniques, discord bumping methods, server bump strategies, discord bump strategies, server bumping guide, discord bumping guide, server bump tips, discord bump tips, server bumping tools, discord bumping tools.</p>
        
        <h2>Server Visibility and Ranking</h2>
        <p>Discord server visibility, server visibility, discord visibility, discord server ranking, server ranking, discord ranking, discord server ratings, server ratings, discord ratings, discord server reviews, server reviews, discord reviews, discord server stats, server stats, discord stats, discord server metrics, server metrics, discord metrics, discord server analytics, server analytics, discord analytics.</p>
        
        <h2>Community Growth Through Bumping</h2>
        <p>Discord server growth, server growth, discord growth, discord community growth, server community growth, discord member growth, server member growth, discord engagement, server engagement, discord activity, server activity, discord participation, server participation, discord interaction, server interaction, discord communication, server communication.</p>
        
        <h2>Automated Bumping Solutions</h2>
        <p>Discord bump bots, server bump bots, discord bumping bots, server bumping automation, discord bump automation, server bump scheduling, discord bump scheduling, server bump reminders, discord bump reminders, automated server promotion, automated discord promotion, scheduled server bumping, timed discord bumping, regular server updates, consistent discord bumping.</p>
      </div>
    </div>
  );
}
