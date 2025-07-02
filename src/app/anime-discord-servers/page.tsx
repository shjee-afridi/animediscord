'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AnimeDiscordServersPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Visible content for users */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Best Anime Discord Servers 2025</h1>
        <p className="text-lg mb-6 text-gray-600">
          Find the top anime Discord servers and communities. Join thousands of anime fans discussing your favorite series, sharing art, and making friends.
        </p>
        <button 
          onClick={() => router.push('/')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg"
        >
          Browse All Discord Servers →
        </button>
      </div>

      {/* Visible anime categories for users and SEO */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">🔥 Popular Anime</h3>
          <p className="text-gray-600">One Piece, Naruto, Attack on Titan, Demon Slayer, My Hero Academia servers</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">🎭 Anime Roleplay</h3>
          <p className="text-gray-600">Join roleplay servers for your favorite anime characters and stories</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">🎨 Anime Art & Creators</h3>
          <p className="text-gray-600">Share and discover amazing anime artwork and connect with artists</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">💬 Anime Discussion</h3>
          <p className="text-gray-600">Discuss episodes, theories, and recommendations with fellow fans</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">🎮 Anime Gaming</h3>
          <p className="text-gray-600">Anime-themed games, mobile games, and gaming communities</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">📺 Watch Parties</h3>
          <p className="text-gray-600">Watch anime together with friends in synchronized viewing parties</p>
        </div>
      </div>

      {/* Benefits section */}
      <div className="bg-blue-50 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Why Join Anime Discord Servers?</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Connect with anime fans worldwide who share your interests</li>
          <li>Get recommendations for new anime series to watch</li>
          <li>Participate in anime trivia, contests, and events</li>
          <li>Share and discover amazing anime artwork and memes</li>
          <li>Join watch parties for the latest episodes</li>
          <li>Discuss theories and episode reactions in real-time</li>
        </ul>
      </div>
      
      <div style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}>
        <h1>Anime Discord Servers - Best Anime Communities 2025</h1>
        <h2>Top Anime Discord Servers and Communities</h2>
        <p>Discover the best anime discord servers, join anime communities, find anime roleplay servers, and explore SFW anime discord servers. Connect with fellow anime fans in the most active anime discord communities.</p>
        
        <h2>Anime Server Categories</h2>
        <p>Anime discord servers, anime discord, anime server, anime community, anime chat, anime social, anime friends, anime dating, anime roleplay, anime forum, anime group, anime network, anime platform, anime hub, anime center, anime portal, anime directory, anime list, anime database, anime registry, anime index, anime catalog, anime collection, anime gallery, anime showcase.</p>
        
        <h2>SFW Anime Communities</h2>
        <p>SFW anime discord, SFW anime servers, anime discord servers, 18+ anime discord, adult anime discord, anime SFW community, anime community discord, anime adult content, SFW anime roleplay, anime roleplay discord, anime 18+ servers, adult anime chat, anime chat discord, anime SFW discussion, anime discussion servers.</p>
        
        <h2>Anime Activities and Features</h2>
        <p>Anime discord events, anime server activities, anime community events, anime watch parties, anime discussion groups, anime trivia contests, anime art sharing, anime meme sharing, anime music sharing, anime recommendation sharing, anime review discussions, anime theory discussions, anime news discussions, anime release discussions.</p>
        
        <h2>Popular Anime Genres</h2>
        <p>Shounen anime discord, shoujo anime discord, seinen anime discord, josei anime discord, isekai anime discord, mecha anime discord, slice of life anime discord, romance anime discord, comedy anime discord, drama anime discord, action anime discord, adventure anime discord, fantasy anime discord, sci-fi anime discord, horror anime discord, thriller anime discord.</p>
      </div>
    </div>
  );
}
