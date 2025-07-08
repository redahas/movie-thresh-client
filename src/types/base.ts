export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  preferences: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Option<T = string> {
  value: T;
  label: string;
}

// Common variations
export type StringOption = Option<string>;
export type NumberOption = Option<number>;
