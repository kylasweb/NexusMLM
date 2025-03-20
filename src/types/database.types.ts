export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          sponsor_id: string | null
          binary_parent_id: string | null
          binary_position: 'left' | 'right' | null
          full_name: string | null
          email: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          sponsor_id?: string | null
          binary_parent_id?: string | null
          binary_position?: 'left' | 'right' | null
          full_name?: string | null
          email?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          sponsor_id?: string | null
          binary_parent_id?: string | null
          binary_position?: 'left' | 'right' | null
          full_name?: string | null
          email?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Helper type for profile
export type Profile = Tables<'profiles'> 