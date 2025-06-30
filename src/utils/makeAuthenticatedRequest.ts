import { getSupabaseServerClient } from "./supabase"


export const makeAuthenticatedRequest = async (endpoint: string, data: any) => {
  const supabase = getSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.access_token) {
    throw new Error('Not authenticated')
  }

  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}
