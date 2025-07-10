import { Metadata } from 'next';
import Link from 'next/link';
import { FaHome, FaTrophy, FaChartLine, FaGlobe } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Discord Server Leaderboards - Top Ranking Anime Communities | Anime Discord',
  description: 'Discover the top-ranking anime Discord servers on our leaderboards. Find the most active, popular, and trending SFW anime communities with detailed rankings and statistics.',
  keywords: 'discord leaderboards, top anime servers, server rankings, discord statistics, popular sfw servers, anime community rankings, best discord servers, server directory',
  alternates: {
    canonical: 'https://animediscord.com/leaderboards'
  },
  openGraph: {
    title: 'Discord Server Leaderboards - Top Ranking Anime Communities',
    description: 'Discover the top-ranking anime Discord servers on our leaderboards. Find the most active, popular, and trending SFW anime communities.',
    url: 'https://www.animediscord.com/leaderboards',
    siteName: 'Anime Discord',
    type: 'website',
    images: [
      {
        url: '/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Anime Discord Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discord Server Leaderboards - Top Ranking Anime Communities',
    description: 'Discover the top-ranking anime Discord servers on our leaderboards.',
  },
};

export default function LeaderboardsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <FaTrophy className="text-6xl text-yellow-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Discord Server Leaderboards
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Discover the top-ranking anime Discord servers and communities
            </p>
          </div>

          {/* Content Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-800 rounded-lg p-6 border border-purple-500/20">
              <FaChartLine className="text-3xl text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Top Servers</h3>
              <p className="text-gray-300 text-sm">
                Find the most popular and active anime Discord servers ranked by member count and activity.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-purple-500/20">
              <FaGlobe className="text-3xl text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Global Rankings</h3>
              <p className="text-gray-300 text-sm">
                Browse comprehensive rankings of SFW anime communities from around the world.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-purple-500/20">
              <FaTrophy className="text-3xl text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Best Communities</h3>
              <p className="text-gray-300 text-sm">
                Discover award-winning Discord servers with exceptional content and moderation.
              </p>
            </div>
          </div>

          {/* SEO Content */}
          <div className="bg-gray-800 rounded-lg p-8 mb-12 text-left">
            <h2 className="text-2xl font-bold text-white mb-4">About Our Discord Server Leaderboards</h2>
            <p className="text-gray-300 mb-4">
              Our leaderboards showcase the most popular and active anime Discord servers in the community. 
              These rankings are based on various factors including member count, activity levels, content quality, 
              and community engagement.
            </p>
            <p className="text-gray-300 mb-4">
              Whether you&apos;re looking for the largest SFW anime communities, the most active roleplay servers, 
              or the best moderated adult content servers, our leaderboards help you find exactly what you&apos;re 
              looking for in the Discord ecosystem.
            </p>
            <p className="text-gray-300">
              Join thousands of members who use our directory to discover premium 18+ Discord servers with 
              exclusive anime content, active communities, and engaging discussions.
            </p>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Explore Top Discord Servers?
            </h2>
            <p className="text-white/90 mb-6">
              Browse our complete directory of the best anime Discord servers and join active communities today!
            </p>
            <Link 
              href="/"
              className="inline-flex items-center bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <FaHome className="mr-2" />
              Browse All Servers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
