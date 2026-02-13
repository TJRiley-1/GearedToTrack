import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const SUPABASE_URL = 'https://klljtobzcfgcwzcoputv.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsbGp0b2J6Y2ZnY3d6Y29wdXR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNjM3NDUsImV4cCI6MjA4NTYzOTc0NX0.Cba8FzyyUlM_Vdf8CFpllkjBxpsEojtWncywSiB6tpc'

export const supabase: SupabaseClient<Database> = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'implicit',
    },
  }
)
