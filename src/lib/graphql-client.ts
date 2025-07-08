import { GraphQLClient } from 'graphql-request'

// Create GraphQL client
const graphqlClient = new GraphQLClient(
  import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/graphql',
  {
    headers: {
      'Content-Type': 'application/json',
    },
  }
)

// Helper function to add auth headers
export const createAuthenticatedClient = (token?: string) => {
  if (!token) return graphqlClient

  return new GraphQLClient(
    import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/graphql',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )
}

export { graphqlClient }
