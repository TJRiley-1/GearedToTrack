import { useState, useMemo } from 'react'
import { Card, Select, EmptyState, Loading } from '../common'
import { usePersonalBests, usePBHistory } from '../../hooks'
import { formatTime } from '../../lib/calculations'
import { EVENT_TYPES } from '../../types'

export function PBTimeline() {
  const { personalBests, isLoading } = usePersonalBests()
  const [selectedEvent, setSelectedEvent] = useState('')

  // Auto-select first event that has PBs
  const effectiveEvent = selectedEvent || personalBests[0]?.eventType || ''

  const eventOptions = useMemo(() => {
    const eventsWithPBs = personalBests.map((pb) => pb.eventType)
    return EVENT_TYPES
      .filter((e) => eventsWithPBs.includes(e))
      .map((e) => ({ value: e, label: e }))
  }, [personalBests])

  if (isLoading) {
    return (
      <div className="py-12">
        <Loading text="Loading personal bests..." />
      </div>
    )
  }

  if (!personalBests.length) {
    return (
      <EmptyState
        icon={
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        }
        title="No personal bests yet"
        description="Record lap sessions to start tracking your PBs"
      />
    )
  }

  return (
    <div className="space-y-4">
      {/* PB Summary Cards */}
      <div className="grid grid-cols-2 gap-2">
        {personalBests.map((pb) => (
          <Card
            key={pb.eventType}
            padding="sm"
            className={`cursor-pointer transition-colors ${
              pb.eventType === effectiveEvent
                ? 'ring-1 ring-primary-500'
                : ''
            }`}
            onClick={() => setSelectedEvent(pb.eventType)}
          >
            <p className="text-xs text-gray-500 truncate">{pb.eventType}</p>
            <p className="text-lg font-semibold text-primary-500">{formatTime(pb.bestTimeMs)}</p>
            <p className="text-xs text-gray-500">
              {new Date(pb.sessionDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
            </p>
          </Card>
        ))}
      </div>

      {eventOptions.length > 1 && (
        <Select
          label="Event"
          value={effectiveEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          options={eventOptions}
        />
      )}

      {effectiveEvent && <PBChart eventType={effectiveEvent} />}
    </div>
  )
}

function PBChart({ eventType }: { eventType: string }) {
  const { history, isLoading } = usePBHistory(eventType)

  if (isLoading) return <Loading text="Loading history..." />

  if (!history.length) {
    return (
      <Card className="text-center py-6">
        <p className="text-gray-400 text-sm">No PB progression data for {eventType}</p>
      </Card>
    )
  }

  // Chart dimensions
  const W = 320
  const H = 120
  const PAD_X = 10
  const PAD_Y = 15
  const chartW = W - PAD_X * 2
  const chartH = H - PAD_Y * 2

  // Compute scales
  const times = history.map((p) => p.bestTimeMs)
  const minTime = Math.min(...times)
  const maxTime = Math.max(...times)
  const timeRange = maxTime - minTime || 1

  const dates = history.map((p) => new Date(p.sessionDate).getTime())
  const minDate = Math.min(...dates)
  const maxDate = Math.max(...dates)
  const dateRange = maxDate - minDate || 1

  const points = history.map((p) => {
    const x = PAD_X + ((new Date(p.sessionDate).getTime() - minDate) / dateRange) * chartW
    // Invert Y so faster (lower) times are higher on chart
    const y = PAD_Y + ((p.bestTimeMs - minTime) / timeRange) * chartH
    return { x, y, point: p }
  })

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ')

  return (
    <div className="space-y-3">
      <Card padding="sm">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          {/* Grid lines */}
          <line x1={PAD_X} y1={PAD_Y} x2={PAD_X} y2={H - PAD_Y} stroke="#1e293b" strokeWidth="1" />
          <line x1={PAD_X} y1={H - PAD_Y} x2={W - PAD_X} y2={H - PAD_Y} stroke="#1e293b" strokeWidth="1" />

          {/* Axis labels */}
          <text x={PAD_X + 2} y={PAD_Y - 3} fill="#6b7280" fontSize="8" fontFamily="sans-serif">
            Faster
          </text>
          <text x={PAD_X + 2} y={H - PAD_Y + 10} fill="#6b7280" fontSize="8" fontFamily="sans-serif">
            Slower
          </text>

          {/* Line */}
          {points.length > 1 && (
            <polyline
              points={polylinePoints}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          )}

          {/* Points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" fill={i === points.length - 1 ? '#14b8a6' : '#f59e0b'} />
              {/* Time label on last point */}
              {i === points.length - 1 && (
                <text
                  x={p.x}
                  y={p.y - 8}
                  fill="#14b8a6"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {formatTime(p.point.bestTimeMs)}
                </text>
              )}
            </g>
          ))}
        </svg>
      </Card>

      {/* History list */}
      <Card padding="sm" className="space-y-1">
        <p className="text-xs font-medium text-gray-500 pb-1 border-b border-navy-700">PB History</p>
        {history.map((point) => (
          <div key={point.sessionId} className="flex items-center justify-between py-1 text-sm">
            <div>
              <span className="text-white font-medium">{formatTime(point.bestTimeMs)}</span>
              {point.delta !== null && (
                <span className="text-green-400 text-xs ml-2">
                  {formatTime(Math.abs(point.delta))} faster
                </span>
              )}
            </div>
            <div className="text-right">
              <span className="text-gray-400 text-xs">
                {new Date(point.sessionDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
              {point.trackName && (
                <span className="text-gray-500 text-xs ml-1">@ {point.trackName}</span>
              )}
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}
