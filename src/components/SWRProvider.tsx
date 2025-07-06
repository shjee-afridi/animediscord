'use client';
import { SWRConfig } from 'swr';
import { ReactNode } from 'react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface SWRProviderProps {
  children: ReactNode;
}

export default function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        fetcher,
        // Global SWR configuration for better responsiveness
        dedupingInterval: 30000, // 30 seconds instead of default 2 seconds
        focusThrottleInterval: 30000, // 30 seconds between revalidations when focusing
        revalidateOnFocus: true, // Revalidate when tab comes back into focus
        revalidateOnReconnect: true, // Revalidate when network reconnects
        refreshInterval: 0, // Disable auto-refresh by default (can be overridden per-hook)
        errorRetryCount: 2, // Retry failed requests twice
        errorRetryInterval: 5000, // Wait 5 seconds between retries
        shouldRetryOnError: true,
        // Reduce cache time for server/review data
        onSuccess: (data, key) => {
          // Automatically invalidate cache for frequently updated data after 1 minute
          if (typeof key === 'string' && (key.includes('/api/servers') || key.includes('/api/reviews'))) {
            setTimeout(() => {
              // This will mark the cache as stale so next access refetches
              if ('caches' in window) {
                caches.open('swr-cache').then(cache => {
                  cache.delete(key);
                });
              }
            }, 60000); // 1 minute
          }
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}
