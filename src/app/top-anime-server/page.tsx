import { Metadata } from 'next';
import Link from 'next/link';
import { FaHome, FaCrown, FaFire, FaUsers, FaStar, FaChartLine } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Top Anime Discord Server - #1 Ranked SFW Anime Community | Anime Discord',
  description: 'Discover the #1 ranked anime Discord server with the most active SFW anime community. Join thousands of members in the top-rated adult Discord server with exclusive content.',
  keywords: 'top anime server, #1 anime discord, best sfw anime server, top rated adult discord, premium anime community, exclusive anime content, top discord server',
  alternates: {
    canonical: 'https://animediscord.com/top-anime-server'
  },
  openGraph: {
    title: 'Top Anime Discord Server - #1 Ranked SFW Anime Community',
    description: 'Discover the #1 ranked anime Discord server with the most active SFW anime community and exclusive content.',
    url: 'https://www.animediscord.com/top-anime-server',
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
    title: 'Top Anime Discord Server - #1 Ranked SFW Anime Community',
    description: 'Discover the #1 ranked anime Discord server with exclusive content and active community.',
  },
};

export default function TopAnimeServerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <FaCrown className="text-6xl text-yellow-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Top Anime Discord Server
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              The #1 ranked SFW anime community with exclusive content and active members
            </p>
          </div>

          {/* Top Server Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-800 rounded-lg p-6 border border-yellow-400/30">
              <FaFire className="text-3xl text-orange-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Most Active</h3>
              <p className="text-gray-300 text-sm">
                Over 50,000 active members with 24/7 activity and constant new content updates.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-yellow-400/30">
              <FaStar className="text-3xl text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Highest Rated</h3>
              <p className="text-gray-300 text-sm">
                5-star rating with exceptional content quality and outstanding community management.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-yellow-400/30">
              <FaUsers className="text-3xl text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Premium Community</h3>
              <p className="text-gray-300 text-sm">
                Exclusive access to premium anime content, custom roles, and VIP member benefits.
              </p>
            </div>
          </div>

          {/* Server Highlights */}
          <div className="bg-gray-800 rounded-lg p-8 mb-12 text-left">
            <h2 className="text-2xl font-bold text-white mb-6">What Makes This Server #1?</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-yellow-400 pl-6">
                <h3 className="text-xl font-semibold text-white mb-3">Exclusive Content Library</h3>
                <p className="text-gray-300 mb-4">
                  Access to the largest collection of premium anime content, including rare and exclusive material 
                  not available anywhere else. Our content is carefully curated and regularly updated.
                </p>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Over 100,000 high-quality images</li>
                  <li>• Exclusive artist collaborations</li>
                  <li>• Daily content updates</li>
                  <li>• Multiple categories and tags</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-400 pl-6">
                <h3 className="text-xl font-semibold text-white mb-3">Active Community Features</h3>
                <p className="text-gray-300 mb-4">
                  Engage with thousands of like-minded anime enthusiasts through interactive features, 
                  events, and community-driven activities that keep the server vibrant and engaging.
                </p>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• 24/7 active chat channels</li>
                  <li>• Weekly community events</li>
                  <li>• Interactive bots and games</li>
                  <li>• Member-driven discussions</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-400 pl-6">
                <h3 className="text-xl font-semibold text-white mb-3">Professional Moderation</h3>
                <p className="text-gray-300 mb-4">
                  Our experienced moderation team ensures a safe, welcoming environment while maintaining 
                  the highest quality standards for content and community interactions.
                </p>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• 24/7 moderation coverage</li>
                  <li>• Clear rules and guidelines</li>
                  <li>• Fair and consistent enforcement</li>
                  <li>• Member support system</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-gradient-to-r from-purple-800 to-pink-800 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Server Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <FaUsers className="text-2xl text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-sm text-gray-300">Active Members</div>
              </div>
              <div className="text-center">
                <FaChartLine className="text-2xl text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">100K+</div>
                <div className="text-sm text-gray-300">Content Items</div>
              </div>
              <div className="text-center">
                <FaStar className="text-2xl text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">5.0</div>
                <div className="text-sm text-gray-300">Star Rating</div>
              </div>
              <div className="text-center">
                <FaFire className="text-2xl text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-sm text-gray-300">Activity</div>
              </div>
            </div>
          </div>

          {/* SEO Content */}
          <div className="bg-gray-800 rounded-lg p-8 mb-12 text-left">
            <h2 className="text-2xl font-bold text-white mb-4">About the Top Anime Discord Server</h2>
            <p className="text-gray-300 mb-4">
              Our #1 ranked anime Discord server represents the pinnacle of SFW anime community excellence. 
              With over 50,000 active members, this server has earned its top position through exceptional content quality, 
              outstanding community management, and unparalleled member engagement.
            </p>
            <p className="text-gray-300 mb-4">
              What sets this server apart is its commitment to providing premium experiences for all members. 
              From exclusive content libraries to interactive community features, every aspect is designed to exceed expectations. 
              The server maintains strict quality standards while fostering a welcoming environment for anime enthusiasts.
            </p>
            <p className="text-gray-300">
              Whether you&apos;re seeking high-quality anime content, engaging community discussions, or premium member benefits, 
              this top-rated server delivers an unmatched Discord experience that has earned recognition as the best in its category.
            </p>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Join the Best?
            </h2>
            <p className="text-white/90 mb-6">
              Discover why this server is ranked #1 and explore all our top-rated communities!
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
