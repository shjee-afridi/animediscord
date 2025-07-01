'use client'
import useSWR from 'swr';

import ServerListItem from '@/components/ServerListItem';
import Spinner from '@/components/Spinner';


const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function CategoryPage({ params }: { params: { category: string } }) {
  const { data, isLoading, error } = useSWR(
    params.category ? `/api/servers?category=${encodeURIComponent(params.category)}` : null,
    fetcher
  );

  const servers = data?.servers || [];

  return (
    <main className="flex flex-col min-h-screen items-center justify-start p-2 sm:p-8 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-900 dark:to-black transition-colors">
      <div className="w-full max-w-7xl">
        <div className="text-center mb-6">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2">
            {params.category} Servers
          </h1>
          {!isLoading && servers.length > 0 && (
            <p className="text-gray-400 text-xs sm:text-sm">
              {servers.length} server{servers.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-900/50 border border-red-600 text-red-200 rounded-xl shadow-lg">
            <p>Error loading servers: {error.message}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : servers.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700 shadow-lg">
            <p className="text-gray-300 text-lg mb-2">No servers found in the &quot;{params.category}&quot; category.</p>
            <p className="text-gray-400 text-sm">Try browsing other categories or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
            {servers.map((server: any, idx: number) => (
              <ServerListItem key={server.guildId || idx} server={server} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}