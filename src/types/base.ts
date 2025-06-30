export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  preferences: Record<string, any>
  created_at: string
  updated_at: string
}