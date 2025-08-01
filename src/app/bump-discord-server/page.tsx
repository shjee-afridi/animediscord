'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Metadata } from 'next';

// Redirect component that sends users to the main promotion page
export default function BumpDiscordServerRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main promotion page after a brief delay
    const timer = setTimeout(() => {
      router.replace('/promote-discord-server');
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
          This page has been moved to our main server promotion guide to provide you with better, consolidated information.
        </p>
        <div className="mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
        </div>
        <p className="text-gray-400 text-xs">
          You&apos;ll be automatically redirected to our promotion guide in a moment...
        </p>
      </div>
    </main>
  );
}

export const metadata: Metadata = {
  title: 'Redirecting - Bump Discord Server',
  description: 'This page has been moved. Redirecting to our comprehensive server promotion guide.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: 'https://www.animediscord.com/promote-discord-server'
  },
};
