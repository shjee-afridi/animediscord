// Cache invalidation utilities
import { mutate } from 'swr';

// Cache keys for different data types
export const CACHE_KEYS = {
  servers: '/api/servers',
  serversByUser: (userId: string) => `/api/servers/by-user?userId=${userId}`,
  serverDetails: (guildId: string) => `/api/servers/${guildId}`,
  reviews: (guildId: string) => `/api/servers/${guildId}/review`,
  allReviews: '/api/reviews',
  bumpInfo: (guildId: string) => `/api/servers/${guildId}/bump-info`,
  userServers: (userId: string) => `/api/servers/user-server?userId=${userId}`,
} as const;

// Function to invalidate server list caches
export const invalidateServerListCaches = async () => {
  // Invalidate main server list with all possible query combinations
  const serverListPatterns = [
    '/api/servers',
    '/api/servers?',
  ];
  
  // Invalidate all server list variations
  for (const pattern of serverListPatterns) {
    await mutate(
      (key) => typeof key === 'string' && key.startsWith(pattern),
      undefined,
      { revalidate: true }
    );
  }
};

// Function to invalidate review caches
export const invalidateReviewCaches = async (guildId?: string) => {
  if (guildId) {
    // Invalidate specific server reviews
    await mutate(CACHE_KEYS.reviews(guildId), undefined, { revalidate: true });
    
    // Also invalidate server details to update review counts
    await mutate(CACHE_KEYS.serverDetails(guildId), undefined, { revalidate: true });
  }
  
  // Invalidate all reviews cache (for admin)
  await mutate(CACHE_KEYS.allReviews, undefined, { revalidate: true });
  
  // Invalidate server lists to update average ratings
  await invalidateServerListCaches();
};

// Function to invalidate user-specific caches
export const invalidateUserCaches = async (userId: string) => {
  await mutate(CACHE_KEYS.serversByUser(userId), undefined, { revalidate: true });
  await mutate(CACHE_KEYS.userServers(userId), undefined, { revalidate: true });
};

// Function to invalidate server-specific caches
export const invalidateServerCaches = async (guildId: string) => {
  await mutate(CACHE_KEYS.serverDetails(guildId), undefined, { revalidate: true });
  await mutate(CACHE_KEYS.reviews(guildId), undefined, { revalidate: true });
  await mutate(CACHE_KEYS.bumpInfo(guildId), undefined, { revalidate: true });
};

// Function to invalidate all caches (for major updates)
export const invalidateAllCaches = async () => {
  await mutate(() => true, undefined, { revalidate: true });
};
