import { Metadata } from 'next';
import Link from 'next/link';
import { FaHome, FaStar, FaComments, FaThumbsUp } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Discord Server Reviews - Top Rated Anime Communities | Anime Discord',
  description: 'Read honest reviews and ratings of the best anime Discord servers. Find top-rated SFW anime communities with detailed member feedback and server quality ratings.',
  keywords: 'discord server reviews, anime server ratings, sfw anime reviews, adult discord feedback, server quality, community reviews, best discord servers',
  alternates: {
    canonical: 'https://animediscord.com/reviews'
  },
  openGraph: {
    title: 'Discord Server Reviews - Top Rated Anime Communities',
    description: 'Read honest reviews and ratings of the best anime Discord servers. Find top-rated SFW anime communities with detailed member feedback.',
    url: 'https://www.animediscord.com/reviews',
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
    title: 'Discord Server Reviews - Top Rated Anime Communities',
    description: 'Read honest reviews and ratings of the best anime Discord servers.',
  },
};

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <FaStar className="text-6xl text-yellow-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Discord Server Reviews
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Honest reviews and ratings of the best anime Discord communities
            </p>
          </div>

          {/* Review Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-800 rounded-lg p-6 border border-purple-500/20">
              <FaStar className="text-3xl text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Quality Ratings</h3>
              <p className="text-gray-300 text-sm">
                Comprehensive star ratings based on content quality, community activity, and moderation standards.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-purple-500/20">
              <FaComments className="text-3xl text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Member Feedback</h3>
              <p className="text-gray-300 text-sm">
                Real reviews from active members sharing their experiences in SFW anime Discord servers.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-purple-500/20">
              <FaThumbsUp className="text-3xl text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Verified Reviews</h3>
              <p className="text-gray-300 text-sm">
                Authentic feedback from verified Discord users who have actively participated in these communities.
              </p>
            </div>
          </div>

          {/* Sample Reviews */}
          <div className="bg-gray-800 rounded-lg p-8 mb-12 text-left">
            <h2 className="text-2xl font-bold text-white mb-6">Featured Server Reviews</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-yellow-400 pl-4">
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400 mr-3">
                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                  </div>
                  <span className="text-white font-semibold">Premium Anime Community</span>
                </div>
                <p className="text-gray-300 text-sm">
                  &quot;Amazing server with active moderation and high-quality content. The community is welcoming and the exclusive channels are worth joining for.&quot;
                </p>
              </div>
              
              <div className="border-l-4 border-yellow-400 pl-4">
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400 mr-3">
                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                  </div>
                  <span className="text-white font-semibold">Anime Roleplay Haven</span>
                </div>
                <p className="text-gray-300 text-sm">
                  &quot;Best roleplay server I&apos;ve found! Great community, active members, and fantastic moderation. Highly recommended for anime enthusiasts.&quot;
                </p>
              </div>
              
              <div className="border-l-4 border-yellow-400 pl-4">
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400 mr-3">
                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                  </div>
                  <span className="text-white font-semibold">SFW Art Gallery</span>
                </div>
                <p className="text-gray-300 text-sm">
                  &quot;Excellent curation of SFW anime art. The server has clear rules, active community, and regular events. Perfect for art enthusiasts.&quot;
                </p>
              </div>
            </div>
          </div>

          {/* SEO Content */}
          <div className="bg-gray-800 rounded-lg p-8 mb-12 text-left">
            <h2 className="text-2xl font-bold text-white mb-4">About Our Discord Server Reviews</h2>
            <p className="text-gray-300 mb-4">
              Our comprehensive review system helps you find the highest quality anime Discord servers based on real member experiences. 
              Each review is carefully moderated to ensure authenticity and provide valuable insights into server quality, 
              community atmosphere, and content standards.
            </p>
            <p className="text-gray-300 mb-4">
              We evaluate servers based on multiple criteria including content quality, community activity, moderation effectiveness, 
              and member satisfaction. Our rating system helps you quickly identify the best SFW anime communities that match your preferences.
            </p>
            <p className="text-gray-300">
              Whether you&apos;re looking for active roleplay servers, exclusive art galleries, or discussion communities, our reviews 
              provide detailed insights to help you choose the perfect Discord server for your interests.
            </p>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Explore Top-Rated Servers
            </h2>
            <p className="text-white/90 mb-6">
              Browse our complete directory of reviewed and rated anime Discord servers!
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
