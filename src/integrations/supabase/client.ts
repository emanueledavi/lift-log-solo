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

export type Database = {}