import { useMemo } from 'react'
import { useLapSessions } from './useLapSessions'
import type { WeeklyLoad } from '../types'

/**
 * Get the Monday of the week for a given date
 */
function getWeekStart(date: Date): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Monday
  d.setDate(diff)
  return d.toISOString().split('T')[0]
}

/**
 * Derive weekly training load from lap sessions with RPE data
 * Flags weeks with >30% load increase vs previous week
 */
export function useTrainingLoad() {
  const { data: sessions, isLoading, error } = useLapSessions()

  const weeklyLoads = useMemo((): WeeklyLoad[] => {
    if (!sessions?.length) return []

    // Group sessions by week
    const weekMap = new Map<string, { count: number; rpeSum: number; rpeCount: number }>()

    for (const session of sessions) {
      const weekStart = getWeekStart(new Date(session.session_date))
      const existing = weekMap.get(weekStart) || { count: 0, rpeSum: 0, rpeCount: 0 }
      existing.count++
      if (session.rpe) {
        existing.rpeSum += session.rpe
        existing.rpeCount++
      }
      weekMap.set(weekStart, existing)
    }

    // Sort by week (oldest first)
    const sorted = Array.from(weekMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))

    // Build weekly loads with spike detection
    const loads: WeeklyLoad[] = []
    for (let i = 0; i < sorted.length; i++) {
      const [weekStart, data] = sorted[i]
      const avgRpe = data.rpeCount > 0 ? data.rpeSum / data.rpeCount : 0
      const totalRpe = data.rpeSum

      let spikePercent: number | null = null
      let isSpikeAlert = false

      if (i > 0) {
        const prevLoad = loads[i - 1]
        if (prevLoad.totalRpe > 0) {
          spikePercent = ((totalRpe - prevLoad.totalRpe) / prevLoad.totalRpe) * 100
          isSpikeAlert = spikePercent > 30
        }
      }

      loads.push({
        weekStart,
        sessionCount: data.count,
        totalRpe,
        averageRpe: Math.round(avgRpe * 10) / 10,
        spikePercent: spikePercent !== null ? Math.round(spikePercent) : null,
        isSpikeAlert,
      })
    }

    return loads
  }, [sessions])

  return { weeklyLoads, isLoading, error }
}
