import { GraphQLClient } from 'graphql-request';
import { RequestInit } from 'graphql-request/dist/types.dom';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };

function fetcher<TData, TVariables extends { [key: string]: any }>(client: GraphQLClient, query: string, variables?: TVariables, requestHeaders?: RequestInit['headers']) {
  return async (): Promise<TData> => client.request({
    document: query,
    variables,
    requestHeaders
  });
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Movie = {
  __typename?: 'Movie';
  director: Scalars['String']['output'];
  genre: Scalars['String']['output'];
  language: Scalars['String']['output'];
  plot: Scalars['String']['output'];
  rated: Scalars['String']['output'];
  ratings: Array<MovieRating>;
  released: Scalars['String']['output'];
  runtime: Scalars['String']['output'];
  title: Scalars['String']['output'];
  writer: Scalars['String']['output'];
  year: Scalars['String']['output'];
};

export type MovieRating = {
  __typename?: 'MovieRating';
  Source: Scalars['String']['output'];
  Value: Scalars['String']['output'];
};

export type MovieSearchResult = {
  __typename?: 'MovieSearchResult';
  released: Scalars['String']['output'];
  title: Scalars['String']['output'];
  tmdbId: Scalars['Int']['output'];
};

export type OmdbMovie = {
  __typename?: 'OmdbMovie';
  Director: Scalars['String']['output'];
  Genre: Scalars['String']['output'];
  Language: Scalars['String']['output'];
  Plot: Scalars['String']['output'];
  Rated: Scalars['String']['output'];
  Ratings: Array<MovieRating>;
  Released: Scalars['String']['output'];
  Runtime: Scalars['String']['output'];
  Title: Scalars['String']['output'];
  Writer: Scalars['String']['output'];
  Year: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  searchMovies: Array<MovieSearchResult>;
};


export type QuerySearchMoviesArgs = {
  query: Scalars['String']['input'];
};

export type TmdbMovie = {
  __typename?: 'TmdbMovie';
  adult: Scalars['Boolean']['output'];
  backdrop_path: Scalars['String']['output'];
  genre_ids: Array<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  original_language: Scalars['String']['output'];
  original_title: Scalars['String']['output'];
  overview: Scalars['String']['output'];
  popularity: Scalars['Float']['output'];
  poster_path: Scalars['String']['output'];
  release_date: Scalars['String']['output'];
  title: Scalars['String']['output'];
  video: Scalars['Boolean']['output'];
  vote_average: Scalars['Float']['output'];
  vote_count: Scalars['Int']['output'];
};

export type TmdbMovieSearchResult = {
  __typename?: 'TmdbMovieSearchResult';
  page: Scalars['Int']['output'];
  results: Array<TmdbMovie>;
  total_pages: Scalars['Int']['output'];
  total_results: Scalars['Int']['output'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  updatedAt: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type SearchMoviesQueryVariables = Exact<{
  query: Scalars['String']['input'];
}>;


export type SearchMoviesQuery = { __typename?: 'Query', searchMovies: Array<{ __typename?: 'MovieSearchResult', title: string, released: string }> };



export const SearchMoviesDocument = `
    query SearchMovies($query: String!) {
  searchMovies(query: $query) {
    title
    released
  }
}
    `;

export const useSearchMoviesQuery = <
      TData = SearchMoviesQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables: SearchMoviesQueryVariables,
      options?: UseQueryOptions<SearchMoviesQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) => {
    
    return useQuery<SearchMoviesQuery, TError, TData>(
      ['SearchMovies', variables],
      fetcher<SearchMoviesQuery, SearchMoviesQueryVariables>(client, SearchMoviesDocument, variables, headers),
      options
    )};

useSearchMoviesQuery.getKey = (variables: SearchMoviesQueryVariables) => ['SearchMovies', variables];


useSearchMoviesQuery.fetcher = (client: GraphQLClient, variables: SearchMoviesQueryVariables, headers?: RequestInit['headers']) => fetcher<SearchMoviesQuery, SearchMoviesQueryVariables>(client, SearchMoviesDocument, variables, headers);
