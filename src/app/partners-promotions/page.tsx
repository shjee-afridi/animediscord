import { Metadata } from 'next';
import Link from 'next/link';
import { FaHome, FaHandshake, FaBullhorn, FaGift, FaCrown } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Discord Server Partners & Promotions - Featured Communities | Anime Discord',
  description: 'Discover our featured partner Discord servers and exclusive promotional offers. Find premium anime communities with special deals, partnerships, and promotional events.',
  keywords: 'discord partners, server promotions, anime discord partnerships, premium server deals, featured communities, promotional offers, exclusive access',
  alternates: {
    canonical: 'https://animediscord.com/partners-promotions'
  },
  openGraph: {
    title: 'Discord Server Partners & Promotions - Featured Communities',
    description: 'Discover our featured partner Discord servers and exclusive promotional offers for premium anime communities.',
    url: 'https://www.animediscord.com/partners-promotions',
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
    title: 'Discord Server Partners & Promotions - Featured Communities',
    description: 'Discover our featured partner Discord servers and exclusive promotional offers.',
  },
};

export default function PartnersPromotionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <FaHandshake className="text-6xl text-purple-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Partners & Promotions
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Featured Discord server partnerships and exclusive promotional offers
            </p>
          </div>

          {/* Partnership Benefits */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-800 rounded-lg p-6 border border-purple-500/20">
              <FaCrown className="text-3xl text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Premium Partners</h3>
              <p className="text-gray-300 text-sm">
                Exclusive partnerships with top-tier anime Discord servers offering premium content and benefits.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-purple-500/20">
              <FaBullhorn className="text-3xl text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Promotional Events</h3>
              <p className="text-gray-300 text-sm">
                Special events, giveaways, and promotional campaigns from our partner communities.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-purple-500/20">
              <FaGift className="text-3xl text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Exclusive Offers</h3>
              <p className="text-gray-300 text-sm">
                Limited-time offers, exclusive access, and special perks for Anime Discord members.
              </p>
            </div>
          </div>

          {/* Featured Partnerships */}
          <div className="bg-gray-800 rounded-lg p-8 mb-12 text-left">
            <h2 className="text-2xl font-bold text-white mb-6">Current Partnership Opportunities</h2>
            
            <div className="space-y-6">
              <div className="border border-purple-500/20 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <FaCrown className="text-yellow-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">Premium Server Partnerships</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Join our network of premium anime Discord servers and gain access to cross-promotion opportunities, 
                  featured listings, and collaborative events with other top communities.
                </p>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>• Featured placement in our directory</li>
                  <li>• Cross-promotional opportunities</li>
                  <li>• Access to partnership events</li>
                  <li>• Priority customer support</li>
                </ul>
              </div>

              <div className="border border-purple-500/20 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <FaBullhorn className="text-blue-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">Promotional Campaigns</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Launch targeted promotional campaigns to grow your Discord server with our extensive user base. 
                  Reach thousands of potential members interested in SFW anime content.
                </p>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>• Targeted advertising campaigns</li>
                  <li>• Social media promotion</li>
                  <li>• Newsletter features</li>
                  <li>• Event sponsorship opportunities</li>
                </ul>
              </div>

              <div className="border border-purple-500/20 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <FaGift className="text-green-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">Member Benefits Program</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Offer exclusive benefits to Anime Discord members including special roles, early access to content, 
                  and premium features in your Discord server.
                </p>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>• Exclusive member roles and perks</li>
                  <li>• Early access to new content</li>
                  <li>• Special event invitations</li>
                  <li>• Premium feature access</li>
                </ul>
              </div>
            </div>
          </div>

          {/* SEO Content */}
          <div className="bg-gray-800 rounded-lg p-8 mb-12 text-left">
            <h2 className="text-2xl font-bold text-white mb-4">About Our Partnership Program</h2>
            <p className="text-gray-300 mb-4">
              Our partnership program connects the best anime Discord servers with our extensive community of SFW anime enthusiasts. 
              We work closely with server owners to create mutually beneficial relationships that enhance the experience for all members.
            </p>
            <p className="text-gray-300 mb-4">
              Partners gain access to our promotional tools, featured listings, and collaborative opportunities that help grow their communities. 
              We focus on quality partnerships that provide real value to our users while maintaining the high standards our community expects.
            </p>
            <p className="text-gray-300">
              Whether you&apos;re looking to promote your existing server, explore partnership opportunities, or take advantage of exclusive offers, 
              our partnerships program provides the tools and support you need to succeed in the Discord ecosystem.
            </p>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Interested in Partnership?
            </h2>
            <p className="text-white/90 mb-6">
              Explore our server directory and discover partnership opportunities with top communities!
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
