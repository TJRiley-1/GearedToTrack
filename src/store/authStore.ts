import { create } from 'zustand'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Profile } from '../types'

interface AuthState {
  user: User | null
  session: Session | null
  profile: Profile | null
  isLoading: boolean
  error: string | null
  initialize: () => Promise<void>
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setProfile: (profile: Profile | null) => void
  fetchProfile: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  error: null,

  initialize: async () => {
    try {
      set({ isLoading: true, error: null })

      // Get current session with a 5-second timeout so we don't hang
      // against an unreachable Supabase instance
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Auth initialization timed out')), 5000)
      )
      const sessionPromise = supabase.auth.getSession()
      const { data: { session }, error: sessionError } = await Promise.race([sessionPromise, timeout])
      if (sessionError) throw sessionError

      if (session?.user) {
        set({ user: session.user, session })
        await get().fetchProfile()
      }
    } catch (error) {
      console.warn('Auth initialization failed:', (error as Error).message)
      set({ error: (error as Error).message })
    } finally {
      set({ isLoading: false })
    }
  },

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),

  fetchProfile: async () => {
    const { user } = get()
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      set({ profile: data })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  updateProfile: async (updates) => {
    const { user, profile } = get()
    if (!user || !profile) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      set({ profile: data })
    } catch (error) {
      set({ error: (error as Error).message })
      throw error
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      set({ user: null, session: null, profile: null })
    } catch (error) {
      set({ error: (error as Error).message })
      throw error
    }
  },
}))
