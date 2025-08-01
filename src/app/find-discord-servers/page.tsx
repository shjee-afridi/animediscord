'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Metadata } from 'next';

// Redirect component that sends users to the directory page
export default function FindDiscordServersRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to directory page after a brief delay
    const timer = setTimeout(() => {
      router.replace('/discord-server-directory');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="flex flex-col min-h-screen items-center justify-center p-8 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-900 dark:to-black transition-colors">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-700 shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-4">
          Redirecting...
        </h1>
        <p className="text-gray-300 text-sm mb-6">
          This page has been moved to our main directory to provide you with better server discovery tools.
        </p>
        <div className="mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
        </div>
        <p className="text-gray-400 text-xs">
          You&apos;ll be automatically redirected to our server directory in a moment...
        </p>
      </div>
    </main>
  );
}

export const metadata: Metadata = {
  title: 'Redirecting - Find Discord Servers',
  description: 'This page has been moved. Redirecting to our comprehensive Discord server directory.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: 'https://www.animediscord.com/discord-server-directory'
  },
};
