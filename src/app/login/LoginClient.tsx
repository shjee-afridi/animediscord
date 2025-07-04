'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { FaDiscord, FaHome, FaShieldAlt, FaUsers, FaStar } from 'react-icons/fa';

export default function LoginClient() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <FaDiscord className="text-6xl text-purple-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Login to Anime Discord
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Access premium SFW anime communities and exclusive Discord servers
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-gray-800 rounded-lg p-8 mb-12 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Connect with Discord</h2>
            <button
              onClick={() => signIn('discord')}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center"
            >
              <FaDiscord className="mr-3 text-xl" />
              Login with Discord
            </button>
            <p className="text-gray-400 text-sm mt-4">
              Secure authentication through Discord
            </p>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-800 rounded-lg p-6 border border-purple-500/20">
              <FaUsers className="text-3xl text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Premium Access</h3>
              <p className="text-gray-300 text-sm">
                Get access to exclusive 18+ Discord servers with premium anime content and active communities.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-purple-500/20">
              <FaShieldAlt className="text-3xl text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Secure Login</h3>
              <p className="text-gray-300 text-sm">
                Safe and secure authentication through Discord&apos;s official OAuth system.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-purple-500/20">
              <FaStar className="text-3xl text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Manage Servers</h3>
              <p className="text-gray-300 text-sm">
                Add, promote, and manage your own Discord servers in our directory.
              </p>
            </div>
          </div>

          {/* SEO Content */}
          <div className="bg-gray-800 rounded-lg p-8 mb-12 text-left">
            <h2 className="text-2xl font-bold text-white mb-4">Why Login to Anime Discord?</h2>
            <p className="text-gray-300 mb-4">
              By logging in to Anime Discord, you gain access to our premium directory of SFW anime communities. 
              Our platform connects you with thousands of active members in carefully curated Discord servers 
              featuring exclusive anime content, roleplay opportunities, and engaging discussions.
            </p>
            <p className="text-gray-300 mb-4">
              Members can manage their own servers, participate in our community features, and get priority 
              access to new server listings. Join the largest network of adult anime enthusiasts on Discord.
            </p>
            <p className="text-gray-300">
              Your login is secured through Discord&apos;s official authentication system, ensuring your privacy 
              and security while accessing our premium 18+ content directory.
            </p>
          </div>

          {/* Alternative Action */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Browse Without Login
            </h2>
            <p className="text-white/90 mb-6">
              You can still explore our directory of the best anime Discord servers without creating an account.
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
