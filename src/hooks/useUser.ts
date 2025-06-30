import { Route } from '~/routes/__root'

export function useUser() {
  const { user } = Route.useRouteContext()
  
  return {
    user,
    isLoading: false, // You can add loading state logic here if needed
  }
} 