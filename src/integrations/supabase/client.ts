import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eqiapfuamkfefrofzfve.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxaWFwZnVhbWtmZWZyb2Z6ZnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyODQ5NTUsImV4cCI6MjA3Mzg2MDk1NX0.8qAb7FqsFbL3GwOQu9BetI3ZxhHBkeBqyfdB8soW4lg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          username: string | null
          avatar_url: string | null
          bio: string | null
          date_of_birth: string | null
          height: number | null
          weight: number | null
          fitness_level: string | null
          fitness_goals: string[] | null
          preferred_units: string | null
          notifications_enabled: boolean | null
          email_notifications: boolean | null
          push_notifications: boolean | null
          privacy_profile: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          username?: string | null
          avatar_url?: string | null
          bio?: string | null
          date_of_birth?: string | null
          height?: number | null
          weight?: number | null
          fitness_level?: string | null
          fitness_goals?: string[] | null
          preferred_units?: string | null
          notifications_enabled?: boolean | null
          email_notifications?: boolean | null
          push_notifications?: boolean | null
          privacy_profile?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          username?: string | null
          avatar_url?: string | null
          bio?: string | null
          date_of_birth?: string | null
          height?: number | null
          weight?: number | null
          fitness_level?: string | null
          fitness_goals?: string[] | null
          preferred_units?: string | null
          notifications_enabled?: boolean | null
          email_notifications?: boolean | null
          push_notifications?: boolean | null
          privacy_profile?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      workouts: {
        Row: {
          id: string
          user_id: string
          date: string
          duration: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          duration?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          duration?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      exercises: {
        Row: {
          id: string
          workout_id: string
          name: string
          type: string
          notes: string | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workout_id: string
          name: string
          type: string
          notes?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workout_id?: string
          name?: string
          type?: string
          notes?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      sets: {
        Row: {
          id: string
          exercise_id: string
          type: string
          reps: number | null
          weight: number | null
          duration: number | null
          distance: number | null
          speed: number | null
          calories: number | null
          incline: number | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          exercise_id: string
          type: string
          reps?: number | null
          weight?: number | null
          duration?: number | null
          distance?: number | null
          speed?: number | null
          calories?: number | null
          incline?: number | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          exercise_id?: string
          type?: string
          reps?: number | null
          weight?: number | null
          duration?: number | null
          distance?: number | null
          speed?: number | null
          calories?: number | null
          incline?: number | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}