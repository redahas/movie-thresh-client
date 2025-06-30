import { gql } from 'graphql-request'

export const SEARCH_MOVIES = gql`
  query SearchMovies($query: String!) {
    searchMovies(query: $query) {
      title
      released
    }
  }
`


// # id
// Title
// Year
// Rated
// Released
// Runtime
// Genre
// Director
// Writer
// Plot
// Language
// Ratings {
//   Source
//   Value
// }
