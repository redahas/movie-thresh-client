import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { graphqlClient } from '../lib/graphql-client'
import { SEARCH_MOVIES, GET_MOVIE_DETAILS } from '../graphql/queries'
import { queryKeys } from '../lib/query-client'
import { Movie, MovieSearchResult } from '../schema/__generated__/types.generated'

export interface SearchMoviesResponse {
  searchMovies: MovieSearchResult[]
}

export interface MovieDetailsResponse {
  movieDetails: Movie
}

// Hook for searching movies with caching
export function useSearchMovies(query: string) {
  return useQuery({
    queryKey: queryKeys.movies.search(query),
    queryFn: async (): Promise<MovieSearchResult[]> => {
      if (!query || query.trim().length < 2) {
        return []
      }

      const variables = { query: query.trim() }
      const data: SearchMoviesResponse = await graphqlClient.request(SEARCH_MOVIES, variables)
      return data.searchMovies
    },
    enabled: query.trim().length >= 2, // Only run query if query is valid
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: (failureCount, error) => {
      // Don't retry if query is too short
      if (query.trim().length < 2) return false
      // Retry up to 3 times for other errors
      return failureCount < 3
    },
  })
}

// Hook for prefetching individual movie details (much better use case!)
export function usePrefetchMovieDetails() {
  const queryClient = useQueryClient()

  return (tmdbId: number) => {
    // Check if data already exists in cache
    const existingData = queryClient.getQueryData(queryKeys.movies.details(tmdbId))
    if (existingData) {
      console.log('🎬 Data already in TanStack Query cache for tmdbId:', tmdbId, 'skipping prefetch')
      return
    }

    queryClient.prefetchQuery({
      queryKey: queryKeys.movies.details(tmdbId),
      queryFn: async () => {
        // This would be your movie details query
        // For now, we'll just prefetch the search result that contains this movie
        // In a real app, you'd have a separate movie details query
        const variables = { tmdbId }
        const data: MovieDetailsResponse = await graphqlClient.request(GET_MOVIE_DETAILS, variables)
        return data.movieDetails
      },
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    })
  }
}

// Hook for fetching movie details (with automatic cache checking)
export function useMovieDetails(tmdbId: number) {
  return useQuery({
    queryKey: queryKeys.movies.details(tmdbId),
    queryFn: async (): Promise<MovieDetailsResponse['movieDetails']> => {
      if (isNaN(tmdbId)) {
        throw new Error('Invalid movie ID');
      }

      const variables = { tmdbId };
      const data: MovieDetailsResponse = await graphqlClient.request(GET_MOVIE_DETAILS, variables);
      return data.movieDetails;
    },
    enabled: !isNaN(tmdbId), // Only run query if tmdbId is valid
    staleTime: 10 * 60 * 1000, // Consider data fresh for 10 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    retry: (failureCount, error) => {
      // Don't retry if movie ID is invalid
      if (error instanceof Error && error.message === 'Invalid movie ID') return false;
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
  });
}

// Hook for invalidating movie cache
export function useInvalidateMovieCache() {
  const queryClient = useQueryClient()

  return {
    invalidateSearch: (query?: string) => {
      if (query) {
        queryClient.invalidateQueries({ queryKey: queryKeys.movies.search(query) })
      } else {
        queryClient.invalidateQueries({ queryKey: queryKeys.movies.all })
      }
    },
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.movies.all })
    },
    // Debug function to see what's in the cache
    debugCache: () => {
      const queries = queryClient.getQueryCache().getAll()
      console.log('🔍 TanStack Query Cache Contents:')
      queries.forEach(query => {
        console.log(`  - ${query.queryKey.join(' > ')}: ${query.state.status}`, {
          data: query.state.data,
          dataUpdatedAt: new Date(query.state.dataUpdatedAt).toISOString(),
        })
      })
    },
    // Clear all cache for testing
    clearAll: () => {
      queryClient.clear()
      console.log('🗑️ TanStack Query cache cleared')
    },
  }
}
