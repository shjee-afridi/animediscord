'use client'
import { useRouter } from 'next/navigation';
import { FaHome, FaExclamationTriangle, FaSearch, FaLayerGroup } from 'react-icons/fa';

export default function HomeRedirectClient() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push('/');
  };

  return (
    <main className="flex flex-col min-h-screen items-center justify-start p-2 sm:p-8 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-900 dark:to-black transition-colors">
      {/* Add h1 for SEO */}
      <h1 className="visually-hidden">
        Page Moved - Anime Discord Home
      </h1>
      
      {/* Search Bar (disabled/visual only) */}
      <div className="mb-3 w-full max-w-lg flex items-center bg-gray-800 dark:bg-gray-900 rounded-full shadow-md px-2 py-1 border border-gray-700 opacity-50">
        <FaSearch className="text-gray-400 ml-2 mr-2 text-lg" />
        <input
          type="text"
          disabled
          placeholder="Search for a server..."
          className="flex-1 bg-transparent outline-none p-2 text-base text-white placeholder-gray-400"
        />
        <button
          disabled
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-full font-semibold"
        >
          Search
        </button>
      </div>

      {/* Category Selector (disabled/visual only) */}
      <div className="w-full max-w-lg mb-4 relative opacity-50">
        <button
          disabled
          className="w-full flex items-center justify-between px-4 py-2 bg-gray-800 dark:bg-gray-900 rounded-full shadow border border-gray-700 text-gray-200 font-semibold text-base"
        >
          <span className="flex items-center gap-2"><FaLayerGroup className="text-blue-400" />All Categories</span>
        </button>
      </div>

      {/* Main Content Area - Redirect Message */}
      <div className="w-full max-w-4xl mx-auto px-4 flex-1 flex items-center justify-center">
        <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-700 shadow-lg">
          <div className="mb-6">
            <FaExclamationTriangle className="mx-auto text-yellow-400 text-4xl mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Page Moved
            </h2>
            <p className="text-gray-300 text-sm">
              This page has been moved to avoid duplicate content issues with search engines.
            </p>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-4">
              You&apos;re looking for our main homepage where you can discover the best anime Discord servers.
            </p>
          </div>

          <button
            onClick={handleRedirect}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <FaHome className="inline mr-2" />
            Go to Main Homepage
          </button>

          <div className="mt-4">
            <a 
              href="/"
              className="text-blue-400 hover:text-blue-300 text-sm underline transition-colors"
            >
              Or click here to visit: animediscord.com
            </a>
          </div>
        </div>
      </div>

      {/* Footer - same as main site */}
      <footer className="w-full flex flex-col items-center justify-center text-xs text-gray-400 py-2 mt-8 border-t border-gray-800 bg-transparent flex-shrink-0">
        <div className="flex flex-col items-center gap-2">
          <span>
            AnimeDiscord 2025 &middot; <a href="/terms" className="underline hover:text-blue-400">Terms</a> &middot; <a href="/privacy" className="underline hover:text-blue-400">Privacy</a>
          </span>
          <span className="text-gray-500">
            Also check out: <a href="https://www.hentaidiscord.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-400 text-blue-300">HentaiDiscord.com</a> - NSFW Discord Servers
          </span>
        </div>
      </footer>
    </main>
  );
}
