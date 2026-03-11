import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const SUPABASE_URL = 'https://bajfcfinjilypieqtiwb.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhamZjZmluamlseXBpZXF0aXdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMDk2NjIsImV4cCI6MjA4Nzg4NTY2Mn0.7Ho2XhhxIeMBrfwEnCVz7rCVhT2jkGCGUTn4w5gv650'

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
