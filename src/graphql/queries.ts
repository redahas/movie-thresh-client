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
