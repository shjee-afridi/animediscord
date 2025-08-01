'use client';

import { useRouter } from 'next/navigation';
import { FaRocket, FaBullhorn, FaUsers, FaChartLine, FaHome } from 'react-icons/fa';

export default function PromoteDiscordServerClient() {
  const router = useRouter();

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-900 dark:to-black transition-colors">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <FaRocket className="text-blue-400" />
            Promote Your Discord Server
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Learn proven strategies to grow your Discord community, attract active members, and boost engagement with our comprehensive promotion guide.
          </p>
        </div>

        {/* Main CTA */}
        <div className="text-center mb-12">
          <button 
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <FaHome className="inline mr-2" />
            Browse Our Server Directory
          </button>
        </div>

        {/* Content Sections */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Promotion Strategies */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <FaBullhorn className="text-yellow-400" />
              Effective Promotion Strategies
            </h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span><strong>List on directories:</strong> Submit your server to multiple Discord server directories for maximum visibility</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span><strong>Social media promotion:</strong> Share your server on Twitter, Reddit, and other social platforms</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span><strong>Content marketing:</strong> Create valuable content that showcases your community&apos;s unique value</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span><strong>Partner with creators:</strong> Collaborate with streamers, YouTubers, and influencers in your niche</span>
              </li>
            </ul>
          </div>

          {/* Growth Tips */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <FaUsers className="text-green-400" />
              Community Growth Tips
            </h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span><strong>Engage actively:</strong> Be present in your server and respond to members quickly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span><strong>Host events:</strong> Regular events keep members engaged and attract new users</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span><strong>Create quality content:</strong> Valuable channels and resources make people want to stay</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span><strong>Incentivize invites:</strong> Reward members who successfully bring new active users</span>
              </li>
            </ul>
          </div>

          {/* Marketing Techniques */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <FaChartLine className="text-purple-400" />
              Advanced Marketing
            </h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span><strong>SEO optimization:</strong> Optimize your server name, description, and tags for discoverability</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span><strong>Cross-promotion:</strong> Partner with similar servers for mutual growth</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span><strong>Analytics tracking:</strong> Monitor your growth metrics and adjust strategies accordingly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span><strong>Bumping services:</strong> Use Discord bots to regularly bump your server on listing sites</span>
              </li>
            </ul>
          </div>

          {/* Best Practices */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <FaRocket className="text-orange-400" />
              Best Practices
            </h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-1">•</span>
                <span><strong>Quality over quantity:</strong> Focus on attracting engaged members rather than just numbers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-1">•</span>
                <span><strong>Consistent branding:</strong> Maintain a professional and recognizable server identity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-1">•</span>
                <span><strong>Community guidelines:</strong> Clear rules create a welcoming environment for new members</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-1">•</span>
                <span><strong>Regular updates:</strong> Keep your server description and content fresh and current</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 bg-gray-800/30 rounded-xl p-8 border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Grow Your Server?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Start implementing these strategies today and watch your Discord community flourish. 
            List your server in our directory to get discovered by thousands of potential members.
          </p>
          <button 
            onClick={() => router.push('/add-server')}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg mr-4"
          >
            List Your Server
          </button>
          <button 
            onClick={() => router.push('/')}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300"
          >
            Browse Servers
          </button>
        </div>
      </div>
    </main>
  );
}
