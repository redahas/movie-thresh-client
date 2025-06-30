import { getSupabaseServerClient } from './supabase'
import type { UserProfile } from '~/types/base'

// Update user preferences
export const updateUserPreferences = async (preferences: Record<string, any>) => {
  const supabase = getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('users')
    .update({ 
      preferences,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// Update user profile
export const updateUserProfile = async (updates: Partial<Pick<UserProfile, 'full_name' | 'avatar_url'>>) => {
  const supabase = getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('users')
    .update({ 
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// Get user profile
export const getUserProfile = async () => {
  const supabase = getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    throw error
  }

  return data
} 