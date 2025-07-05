import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes by default
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Keep data in cache for 10 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      // Retry failed requests 3 times
      retry: 3,
      // Refetch on window focus (good for keeping data fresh)
      refetchOnWindowFocus: true,
      // Don't refetch on reconnect if data is fresh
      refetchOnReconnect: 'always',
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
})

// Custom query keys for better organization
export const queryKeys = {
  movies: {
    all: ['movies'] as const,
    search: (query: string) => [...queryKeys.movies.all, 'search', query] as const,
    details: (tmdbId: number) => [...queryKeys.movies.all, 'details', tmdbId] as const,
  },
  user: {
    all: ['user'] as const,
    profile: ['user', 'profile'] as const,
  },
} as const
