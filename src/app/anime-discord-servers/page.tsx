'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AnimeDiscordServersPage() {
  const router = useRouter();

  // No automatic redirect - only manual button for users

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Anime Discord Servers</h1>
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
        <h1>Anime Discord Servers - Best Anime Communities 2025</h1>
        <h2>Top Anime Discord Servers and Communities</h2>
        <p>Discover the best anime discord servers, join anime communities, find anime roleplay servers, and explore nsfw anime discord servers. Connect with fellow anime fans in the most active anime discord communities.</p>
        
        <h2>Anime Server Categories</h2>
        <p>Anime discord servers, anime discord, anime server, anime community, anime chat, anime social, anime friends, anime dating, anime roleplay, anime forum, anime group, anime network, anime platform, anime hub, anime center, anime portal, anime directory, anime list, anime database, anime registry, anime index, anime catalog, anime collection, anime gallery, anime showcase.</p>
        
        <h2>NSFW Anime Communities</h2>
        <p>Nsfw anime discord, nsfw anime servers, hentai discord servers, 18+ anime discord, adult anime discord, anime nsfw community, hentai community discord, anime adult content, nsfw anime roleplay, hentai roleplay discord, anime 18+ servers, adult anime chat, hentai chat discord, anime nsfw discussion, hentai discussion servers.</p>
        
        <h2>Anime Activities and Features</h2>
        <p>Anime discord events, anime server activities, anime community events, anime watch parties, anime discussion groups, anime trivia contests, anime art sharing, anime meme sharing, anime music sharing, anime recommendation sharing, anime review discussions, anime theory discussions, anime news discussions, anime release discussions.</p>
        
        <h2>Popular Anime Genres</h2>
        <p>Shounen anime discord, shoujo anime discord, seinen anime discord, josei anime discord, isekai anime discord, mecha anime discord, slice of life anime discord, romance anime discord, comedy anime discord, drama anime discord, action anime discord, adventure anime discord, fantasy anime discord, sci-fi anime discord, horror anime discord, thriller anime discord.</p>
      </div>
    </div>
  );
}
