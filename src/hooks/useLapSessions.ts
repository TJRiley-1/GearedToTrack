import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import type { LapSession, LapSessionInsert, LapSessionWithDetails, LapTimeInsert, Chainring, Sprocket, LapTime } from '../types'

export function useLapSessions(eventTypeFilter?: string) {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: ['lap_sessions', user?.id, eventTypeFilter],
    queryFn: async (): Promise<LapSessionWithDetails[]> => {
      if (!user) return []

      // Fetch sessions
      let sessionsQuery = supabase
        .from('lap_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('session_date', { ascending: false })

      if (eventTypeFilter) {
        sessionsQuery = sessionsQuery.eq('event_type', eventTypeFilter)
      }

      const { data: sessions, error: sessionsError } = await sessionsQuery
      if (sessionsError) throw sessionsError
      if (!sessions?.length) return []

      // Fetch related data
      const sessionIds = sessions.map(s => s.id)
      const chainringIds = sessions.map(s => s.chainring_id).filter(Boolean) as string[]
      const sprocketIds = sessions.map(s => s.sprocket_id).filter(Boolean) as string[]

      const [chainringsResult, sprocketsResult, lapTimesResult] = await Promise.all([
        chainringIds.length > 0
          ? supabase.from('chainrings').select('*').in('id', chainringIds)
          : Promise.resolve({ data: [] as Chainring[], error: null }),
        sprocketIds.length > 0
          ? supabase.from('sprockets').select('*').in('id', sprocketIds)
          : Promise.resolve({ data: [] as Sprocket[], error: null }),
        supabase.from('lap_times').select('*').in('session_id', sessionIds).order('lap_number', { ascending: true }),
      ])

      const chainringsMap = new Map((chainringsResult.data || []).map(c => [c.id, c]))
      const sprocketsMap = new Map((sprocketsResult.data || []).map(s => [s.id, s]))
      const lapTimesMap = new Map<string, LapTime[]>()
      for (const lt of (lapTimesResult.data || [])) {
        if (!lapTimesMap.has(lt.session_id)) {
          lapTimesMap.set(lt.session_id, [])
        }
        lapTimesMap.get(lt.session_id)!.push(lt)
      }

      return sessions.map(session => ({
        ...session,
        chainring: session.chainring_id ? chainringsMap.get(session.chainring_id) || null : null,
        sprocket: session.sprocket_id ? sprocketsMap.get(session.sprocket_id) || null : null,
        lap_times: lapTimesMap.get(session.id) || [],
      }))
    },
    enabled: !!user,
  })
}

export function useLapSession(sessionId: string) {
  return useQuery({
    queryKey: ['lap_session', sessionId],
    queryFn: async (): Promise<LapSessionWithDetails | null> => {
      const { data: session, error } = await supabase
        .from('lap_sessions')
        .select('*')
        .eq('id', sessionId)
        .single()
      if (error) throw error
      if (!session) return null

      const [chainringResult, sprocketResult, lapTimesResult] = await Promise.all([
        session.chainring_id
          ? supabase.from('chainrings').select('*').eq('id', session.chainring_id).single()
          : Promise.resolve({ data: null, error: null }),
        session.sprocket_id
          ? supabase.from('sprockets').select('*').eq('id', session.sprocket_id).single()
          : Promise.resolve({ data: null, error: null }),
        supabase.from('lap_times').select('*').eq('session_id', sessionId).order('lap_number', { ascending: true }),
      ])

      return {
        ...session,
        chainring: chainringResult.data,
        sprocket: sprocketResult.data,
        lap_times: lapTimesResult.data || [],
      }
    },
    enabled: !!sessionId,
  })
}

interface AddLapSessionInput {
  session: Omit<LapSessionInsert, 'user_id'>
  lapTimes: number[] // Array of times in ms
}

export function useAddLapSession() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async ({ session, lapTimes }: AddLapSessionInput) => {
      if (!user) throw new Error('Not authenticated')

      // Insert session
      const { data: sessionData, error: sessionError } = await supabase
        .from('lap_sessions')
        .insert({ ...session, user_id: user.id })
        .select()
        .single()
      if (sessionError) throw sessionError

      // Insert lap times
      if (lapTimes.length > 0) {
        const lapTimeRecords: LapTimeInsert[] = lapTimes.map((time_ms, index) => ({
          session_id: sessionData.id,
          lap_number: index + 1,
          time_ms,
        }))

        const { error: lapError } = await supabase
          .from('lap_times')
          .insert(lapTimeRecords)
        if (lapError) throw lapError
      }

      return sessionData as LapSession
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lap_sessions'] })
    },
  })
}

export function useDeleteLapSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('lap_sessions').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lap_sessions'] })
    },
  })
}
