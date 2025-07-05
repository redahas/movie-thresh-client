import { gql } from 'graphql-request'

export const SEARCH_MOVIES = gql`
  query SearchMovies($query: String!) {
    searchMovies(query: $query) {
      title
      released
      tmdbId
    }
  }
`;

export const GET_MOVIE_DETAILS = gql`
  query GetMovieDetails($tmdbId: Int!) {
    movieDetails(tmdbId: $tmdbId) {
      title
      year
      rated
      released
      runtime
      genre
      director
      writer
      plot
      posters
      language
      ratings {
        source
        value
      }
    }
  }
`;

export const GET_USER = gql`
  query GetUser {
    me {
      id
      username
      email
      createdAt
      updatedAt
      preferences {
        theme
        soundEnabled
        animationsEnabled
        autoPlayEnabled
        smoothScrollingEnabled
        imdbThreshold
        rottenTomatoesThreshold
        metacriticThreshold
      }
    }
  }
`;
