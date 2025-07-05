import { gql } from 'graphql-request'

export const UPDATE_USER_PREFERENCES = gql`
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
