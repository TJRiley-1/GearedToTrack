import { useMemo } from 'react'
import { useLapSessions } from './useLapSessions'
import { calculateBestTime } from '../lib/calculations'
import type { PersonalBest, PBHistoryPoint, LapSessionWithDetails } from '../types'

/**
 * Derive personal bests from existing lap session data
 * Returns best time per event type
 */
export function usePersonalBests() {
  const { data: sessions, isLoading, error } = useLapSessions()

  const personalBests = useMemo(() => {
    if (!sessions?.length) return []

    const bestsByEvent = new Map<string, PersonalBest>()

    for (const session of sessions) {
      const times = session.lap_times?.map((lt) => lt.time_ms) || []
      const best = calculateBestTime(times)
      if (best === null) continue

      const existing = bestsByEvent.get(session.event_type)
      if (!existing || best < existing.bestTimeMs) {
        bestsByEvent.set(session.event_type, {
          eventType: session.event_type as PersonalBest['eventType'],
          bestTimeMs: best,
          sessionId: session.id,
          sessionDate: session.session_date,
          trackName: session.track_name,
          trackLength: session.track_length,
        })
      }
    }

    return Array.from(bestsByEvent.values()).sort((a, b) =>
      a.eventType.localeCompare(b.eventType)
    )
  }, [sessions])

  return { personalBests, isLoading, error }
}

/**
 * Get PB history for a specific event type
 * Shows how PBs have progressed over time (chronological order)
 */
export function usePBHistory(eventType: string) {
  const { data: sessions, isLoading, error } = useLapSessions(eventType)

  const history = useMemo(() => {
    if (!sessions?.length) return []

    // Get sessions with their best times, sorted chronologically (oldest first)
    const sessionsWithBest: { session: LapSessionWithDetails; best: number }[] = []
    for (const session of sessions) {
      const times = session.lap_times?.map((lt) => lt.time_ms) || []
      const best = calculateBestTime(times)
      if (best !== null) {
        sessionsWithBest.push({ session, best })
      }
    }

    // Sort chronologically (oldest first)
    sessionsWithBest.sort(
      (a, b) => new Date(a.session.session_date).getTime() - new Date(b.session.session_date).getTime()
    )

    // Build PB progression — only include sessions that set a new PB
    const points: PBHistoryPoint[] = []
    let currentPB = Infinity

    for (const { session, best } of sessionsWithBest) {
      if (best < currentPB) {
        const delta = currentPB === Infinity ? null : best - currentPB
        currentPB = best
        points.push({
          sessionId: session.id,
          sessionDate: session.session_date,
          bestTimeMs: best,
          trackName: session.track_name,
          delta,
        })
      }
    }

    return points
  }, [sessions])

  return { history, isLoading, error }
}
