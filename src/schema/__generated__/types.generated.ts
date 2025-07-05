import { GraphQLClient } from 'graphql-request';
import { RequestInit } from 'graphql-request/dist/types.dom';
import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
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
  posters: Array<Scalars['String']['output']>;
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
  source: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type MovieSearchResult = {
  __typename?: 'MovieSearchResult';
  released: Scalars['String']['output'];
  title: Scalars['String']['output'];
  tmdbId: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  updateUserPreferences: User;
};


export type MutationUpdateUserPreferencesArgs = {
  preferences: UpdateUserPreferencesInput;
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  movieDetails: Movie;
  searchMovies: Array<MovieSearchResult>;
};


export type QueryMovieDetailsArgs = {
  tmdbId: Scalars['Int']['input'];
};


export type QuerySearchMoviesArgs = {
  query: Scalars['String']['input'];
};

export type UpdateUserPreferencesInput = {
  animationsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  autoPlayEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  imdbThreshold?: InputMaybe<Scalars['Float']['input']>;
  metacriticThreshold?: InputMaybe<Scalars['Float']['input']>;
  rottenTomatoesThreshold?: InputMaybe<Scalars['Float']['input']>;
  smoothScrollingEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  soundEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  theme?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  preferences?: Maybe<UserPreferences>;
  updatedAt: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type UserPreferences = {
  __typename?: 'UserPreferences';
  animationsEnabled?: Maybe<Scalars['Boolean']['output']>;
  autoPlayEnabled?: Maybe<Scalars['Boolean']['output']>;
  imdbThreshold?: Maybe<Scalars['Float']['output']>;
  metacriticThreshold?: Maybe<Scalars['Float']['output']>;
  rottenTomatoesThreshold?: Maybe<Scalars['Float']['output']>;
  smoothScrollingEnabled?: Maybe<Scalars['Boolean']['output']>;
  soundEnabled?: Maybe<Scalars['Boolean']['output']>;
  theme?: Maybe<Scalars['String']['output']>;
};

export type UpdateUserPreferencesMutationVariables = Exact<{
  preferences: UpdateUserPreferencesInput;
}>;


export type UpdateUserPreferencesMutation = { __typename?: 'Mutation', updateUserPreferences: { __typename?: 'User', id: string, updatedAt: string, preferences?: { __typename?: 'UserPreferences', theme?: string | null, imdbThreshold?: number | null, rottenTomatoesThreshold?: number | null, metacriticThreshold?: number | null } | null } };

export type SearchMoviesQueryVariables = Exact<{
  query: Scalars['String']['input'];
}>;


export type SearchMoviesQuery = { __typename?: 'Query', searchMovies: Array<{ __typename?: 'MovieSearchResult', title: string, released: string, tmdbId: number }> };

export type GetMovieDetailsQueryVariables = Exact<{
  tmdbId: Scalars['Int']['input'];
}>;


export type GetMovieDetailsQuery = { __typename?: 'Query', movieDetails: { __typename?: 'Movie', title: string, year: string, rated: string, released: string, runtime: string, genre: string, director: string, writer: string, plot: string, posters: Array<string>, language: string, ratings: Array<{ __typename?: 'MovieRating', source: string, value: string }> } };

export type GetUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, username: string, email: string, createdAt: string, updatedAt: string, preferences?: { __typename?: 'UserPreferences', theme?: string | null, soundEnabled?: boolean | null, animationsEnabled?: boolean | null, autoPlayEnabled?: boolean | null, smoothScrollingEnabled?: boolean | null, imdbThreshold?: number | null, rottenTomatoesThreshold?: number | null, metacriticThreshold?: number | null } | null } | null };



export const UpdateUserPreferencesDocument = `
    mutation UpdateUserPreferences($preferences: UpdateUserPreferencesInput!) {
  updateUserPreferences(preferences: $preferences) {
    id
    updatedAt
    preferences {
      theme
      imdbThreshold
      rottenTomatoesThreshold
      metacriticThreshold
    }
  }
}
    `;

export const useUpdateUserPreferencesMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<UpdateUserPreferencesMutation, TError, UpdateUserPreferencesMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) => {
    
    return useMutation<UpdateUserPreferencesMutation, TError, UpdateUserPreferencesMutationVariables, TContext>(
      {
    mutationKey: ['UpdateUserPreferences'],
    mutationFn: (variables?: UpdateUserPreferencesMutationVariables) => fetcher<UpdateUserPreferencesMutation, UpdateUserPreferencesMutationVariables>(client, UpdateUserPreferencesDocument, variables, headers)(),
    ...options
  }
    )};


useUpdateUserPreferencesMutation.fetcher = (client: GraphQLClient, variables: UpdateUserPreferencesMutationVariables, headers?: RequestInit['headers']) => fetcher<UpdateUserPreferencesMutation, UpdateUserPreferencesMutationVariables>(client, UpdateUserPreferencesDocument, variables, headers);

export const SearchMoviesDocument = `
    query SearchMovies($query: String!) {
  searchMovies(query: $query) {
    title
    released
    tmdbId
  }
}
    `;

export const useSearchMoviesQuery = <
      TData = SearchMoviesQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables: SearchMoviesQueryVariables,
      options?: Omit<UseQueryOptions<SearchMoviesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<SearchMoviesQuery, TError, TData>['queryKey'] },
      headers?: RequestInit['headers']
    ) => {
    
    return useQuery<SearchMoviesQuery, TError, TData>(
      {
    queryKey: ['SearchMovies', variables],
    queryFn: fetcher<SearchMoviesQuery, SearchMoviesQueryVariables>(client, SearchMoviesDocument, variables, headers),
    ...options
  }
    )};

useSearchMoviesQuery.getKey = (variables: SearchMoviesQueryVariables) => ['SearchMovies', variables];


useSearchMoviesQuery.fetcher = (client: GraphQLClient, variables: SearchMoviesQueryVariables, headers?: RequestInit['headers']) => fetcher<SearchMoviesQuery, SearchMoviesQueryVariables>(client, SearchMoviesDocument, variables, headers);

export const GetMovieDetailsDocument = `
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

export const useGetMovieDetailsQuery = <
      TData = GetMovieDetailsQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables: GetMovieDetailsQueryVariables,
      options?: Omit<UseQueryOptions<GetMovieDetailsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetMovieDetailsQuery, TError, TData>['queryKey'] },
      headers?: RequestInit['headers']
    ) => {
    
    return useQuery<GetMovieDetailsQuery, TError, TData>(
      {
    queryKey: ['GetMovieDetails', variables],
    queryFn: fetcher<GetMovieDetailsQuery, GetMovieDetailsQueryVariables>(client, GetMovieDetailsDocument, variables, headers),
    ...options
  }
    )};

useGetMovieDetailsQuery.getKey = (variables: GetMovieDetailsQueryVariables) => ['GetMovieDetails', variables];


useGetMovieDetailsQuery.fetcher = (client: GraphQLClient, variables: GetMovieDetailsQueryVariables, headers?: RequestInit['headers']) => fetcher<GetMovieDetailsQuery, GetMovieDetailsQueryVariables>(client, GetMovieDetailsDocument, variables, headers);

export const GetUserDocument = `
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

export const useGetUserQuery = <
      TData = GetUserQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: GetUserQueryVariables,
      options?: Omit<UseQueryOptions<GetUserQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetUserQuery, TError, TData>['queryKey'] },
      headers?: RequestInit['headers']
    ) => {
    
    return useQuery<GetUserQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetUser'] : ['GetUser', variables],
    queryFn: fetcher<GetUserQuery, GetUserQueryVariables>(client, GetUserDocument, variables, headers),
    ...options
  }
    )};

useGetUserQuery.getKey = (variables?: GetUserQueryVariables) => variables === undefined ? ['GetUser'] : ['GetUser', variables];


useGetUserQuery.fetcher = (client: GraphQLClient, variables?: GetUserQueryVariables, headers?: RequestInit['headers']) => fetcher<GetUserQuery, GetUserQueryVariables>(client, GetUserDocument, variables, headers);
