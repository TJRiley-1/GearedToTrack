import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { CommunityBenchmark } from '../types'

/**
 * Fetch community benchmarks via Supabase RPC
 * Uses 30-minute stale time since this data changes slowly
 */
export function useCommunityBenchmarks() {
  return useQuery({
    queryKey: ['community_benchmarks'],
    queryFn: async (): Promise<CommunityBenchmark[]> => {
      const { data, error } = await supabase.rpc('get_community_benchmarks')
      if (error) throw error
      if (!data) return []

      return (data as {
        event_type: string
        track_length: number
        sample_size: number
        p10_ms: number
        p25_ms: number
        p50_ms: number
        p75_ms: number
        p90_ms: number
      }[]).map((row) => ({
        eventType: row.event_type,
        trackLength: row.track_length,
        sampleSize: row.sample_size,
        p10Ms: row.p10_ms,
        p25Ms: row.p25_ms,
        p50Ms: row.p50_ms,
        p75Ms: row.p75_ms,
        p90Ms: row.p90_ms,
        userBestMs: null, // Populated by the component
        userPercentile: null,
      }))
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  })
}
