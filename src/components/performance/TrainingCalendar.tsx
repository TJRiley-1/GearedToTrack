import { useState, useMemo } from 'react'
import { Card, EmptyState, Loading } from '../common'
import { useLapSessions } from '../../hooks'
import { useTrainingLoad } from '../../hooks/useTrainingLoad'

function rpeBgClass(sessionCount: number, avgRpe: number): string {
  if (sessionCount === 0) return 'bg-navy-800'
  if (avgRpe === 0) return 'bg-navy-600' // sessions but no RPE data
  if (avgRpe <= 3) return 'bg-green-900/60'
  if (avgRpe <= 5) return 'bg-yellow-900/60'
  if (avgRpe <= 7) return 'bg-orange-900/60'
  return 'bg-red-900/60'
}

export function TrainingCalendar() {
  const { data: sessions, isLoading } = useLapSessions()
  const { weeklyLoads } = useTrainingLoad()

  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  const year = parseInt(viewMonth.split('-')[0], 10)
  const month = parseInt(viewMonth.split('-')[1], 10) - 1

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPad = (firstDay.getDay() + 6) % 7 // Monday = 0

    // Build a map of date → sessions
    const dayMap = new Map<string, { count: number; rpeSum: number; rpeCount: number }>()
    if (sessions) {
      for (const s of sessions) {
        const dateStr = s.session_date.split('T')[0]
        const existing = dayMap.get(dateStr) || { count: 0, rpeSum: 0, rpeCount: 0 }
        existing.count++
        if (s.rpe) {
          existing.rpeSum += s.rpe
          existing.rpeCount++
        }
        dayMap.set(dateStr, existing)
      }
    }

    const days: { date: number | null; dateStr: string; count: number; avgRpe: number }[] = []

    // Pad start
    for (let i = 0; i < startPad; i++) {
      days.push({ date: null, dateStr: '', count: 0, avgRpe: 0 })
    }

    // Days of month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const data = dayMap.get(dateStr)
      days.push({
        date: d,
        dateStr,
        count: data?.count || 0,
        avgRpe: data && data.rpeCount > 0 ? data.rpeSum / data.rpeCount : 0,
      })
    }

    return days
  }, [year, month, sessions])

  const monthName = new Date(year, month).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  // Recent weekly loads (last 8 weeks)
  const recentWeeks = weeklyLoads.slice(-8)
  const maxLoad = Math.max(...recentWeeks.map((w) => w.totalRpe), 1)

  if (isLoading) {
    return (
      <div className="py-12">
        <Loading text="Loading training data..." />
      </div>
    )
  }

  if (!sessions?.length) {
    return (
      <EmptyState
        icon={
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        }
        title="No training data yet"
        description="Record sessions with RPE to start tracking your training load"
      />
    )
  }

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            const d = new Date(year, month - 1, 1)
            setViewMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
          }}
          className="text-gray-400 hover:text-white p-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-white font-medium">{monthName}</h3>
        <button
          onClick={() => {
            const d = new Date(year, month + 1, 1)
            setViewMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
          }}
          className="text-gray-400 hover:text-white p-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar grid */}
      <Card padding="sm">
        <div className="grid grid-cols-7 gap-1 text-center">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
            <div key={i} className="text-xs text-gray-500 py-1">{day}</div>
          ))}
          {calendarDays.map((day, i) => (
            <div
              key={i}
              className={`aspect-square rounded flex flex-col items-center justify-center text-xs ${
                day.date
                  ? `${rpeBgClass(day.count, day.avgRpe)} ${day.count > 0 ? 'ring-1 ring-navy-600' : ''}`
                  : ''
              }`}
            >
              {day.date && (
                <>
                  <span className={day.count > 0 ? 'text-white font-medium' : 'text-gray-600'}>
                    {day.date}
                  </span>
                  {day.count > 0 && (
                    <span className="text-[9px] text-gray-400">{day.count}s</span>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 mt-3 pt-2 border-t border-navy-700 text-[10px] text-gray-500">
          <span>RPE:</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-green-600" /> 1-3</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-yellow-600" /> 4-5</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-orange-600" /> 6-7</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-600" /> 8-10</span>
        </div>
      </Card>

      {/* Weekly load bar chart */}
      {recentWeeks.length > 0 && (
        <Card padding="sm" className="space-y-2">
          <p className="text-xs font-medium text-gray-500">Weekly Training Load (RPE total)</p>
          <svg viewBox={`0 0 320 100`} className="w-full">
            {recentWeeks.map((week, i) => {
              const barW = 280 / recentWeeks.length - 4
              const barH = maxLoad > 0 ? (week.totalRpe / maxLoad) * 70 : 0
              const x = 30 + i * (barW + 4)
              const y = 80 - barH

              // Colour by average RPE
              let fill = '#374151' // gray if no RPE data
              if (week.averageRpe > 0) {
                if (week.averageRpe <= 3) fill = '#16a34a'
                else if (week.averageRpe <= 5) fill = '#ca8a04'
                else if (week.averageRpe <= 7) fill = '#ea580c'
                else fill = '#dc2626'
              }

              const weekLabel = new Date(week.weekStart).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

              return (
                <g key={week.weekStart}>
                  <rect x={x} y={y} width={barW} height={barH} rx="2" fill={fill} opacity="0.8" />
                  {/* Week label */}
                  <text x={x + barW / 2} y={95} fill="#6b7280" fontSize="7" textAnchor="middle" fontFamily="sans-serif">
                    {weekLabel}
                  </text>
                  {/* Load value */}
                  {week.totalRpe > 0 && (
                    <text x={x + barW / 2} y={y - 3} fill="#9ca3af" fontSize="8" textAnchor="middle" fontFamily="sans-serif">
                      {week.totalRpe}
                    </text>
                  )}
                  {/* Spike alert */}
                  {week.isSpikeAlert && (
                    <text x={x + barW / 2} y={y - 12} fill="#f59e0b" fontSize="10" textAnchor="middle">
                      ⚠
                    </text>
                  )}
                </g>
              )
            })}
          </svg>

          {/* Spike alerts */}
          {recentWeeks.filter((w) => w.isSpikeAlert).length > 0 && (
            <div className="text-xs text-amber-400 flex items-center gap-1 pt-1 border-t border-navy-700">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Load spike detected (&gt;30% increase). Consider recovery.
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
