import { useSession } from 'next-auth/react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useUserServers() {
  const { data: session } = useSession();
  
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
    }
  );

  return {
    userServers: userServers || [],
    hasServers: Array.isArray(userServers) && userServers.length > 0,
    isLoading,
    error,
  };
}
