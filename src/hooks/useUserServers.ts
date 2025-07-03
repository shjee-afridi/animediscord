import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { useEffect, useState } from 'react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

// Cache key and duration constants
const CACHE_KEY = 'userServers_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface CachedData {
  data: any[];
  timestamp: number;
  userId: string;
}

function getCachedData(userId: string): any[] | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const parsedCache: CachedData = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is for the same user and still valid
    if (parsedCache.userId === userId && (now - parsedCache.timestamp) < CACHE_DURATION) {
      return parsedCache.data;
    }
    
    // Cache is expired or for different user, remove it
    localStorage.removeItem(CACHE_KEY);
    return null;
  } catch (error) {
    console.error('Error reading cache:', error);
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
}

function setCachedData(userId: string, data: any[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    const cacheData: CachedData = {
      data,
      timestamp: Date.now(),
      userId
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error setting cache:', error);
  }
}

export function useUserServers() {
  const { data: session, status } = useSession();
  const [cachedServers, setCachedServers] = useState<any[] | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize cache on component mount
  useEffect(() => {
    if (status === 'loading') return; // Wait for session to load
    
    if (session?.user?.id && !isInitialized) {
      const cached = getCachedData(session.user.id);
      if (cached) {
        setCachedServers(cached);
      }
      setIsInitialized(true);
    } else if (!session?.user?.id) {
      // User is not logged in, mark as initialized
      setIsInitialized(true);
    }
  }, [session?.user?.id, status, isInitialized]);
  
  const { data: userServers, error, isLoading } = useSWR(
    session?.user?.id ? `/api/servers/by-user?userId=${session.user.id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes
      refreshInterval: 0, // Disable automatic refresh
      errorRetryCount: 1, // Reduce retry attempts
      shouldRetryOnError: false, // Don't retry on error
      // Only fetch if we don't have cached data
      isPaused: () => cachedServers !== null && session?.user?.id ? getCachedData(session.user.id) !== null : false,
    }
  );

  // Update cache when fresh data is received
  useEffect(() => {
    if (userServers && session?.user?.id && Array.isArray(userServers)) {
      setCachedData(session.user.id, userServers);
      setCachedServers(userServers);
    }
  }, [userServers, session?.user?.id]);

  // Use cached data if available, otherwise fall back to SWR data
  const finalServers = cachedServers !== null ? cachedServers : (userServers || []);
  const finalHasServers = Array.isArray(finalServers) && finalServers.length > 0;

  return {
    userServers: finalServers,
    hasServers: finalHasServers,
    isLoading: !isInitialized || (cachedServers === null && isLoading),
    error,
    isLoggedIn: !!session?.user?.id,
  };
}
