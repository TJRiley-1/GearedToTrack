import { useState } from 'react'
import { Card } from '../common'
import { formatTime, calculateBestTime, calculateAverageTime } from '../../lib/calculations'
import type { LapSessionWithDetails } from '../../types'

interface LapSessionCardProps {
  session: LapSessionWithDetails
  onDelete?: (id: string) => void
  onUpdateRpe?: (id: string, rpe: number) => void
}

export function LapSessionCard({ session, onDelete, onUpdateRpe }: LapSessionCardProps) {
  const lapTimes = session.lap_times?.map((lt) => lt.time_ms) || []
  const bestTime = calculateBestTime(lapTimes)
  const avgTime = calculateAverageTime(lapTimes)

  const sessionDate = new Date(session.session_date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  const gearSetup = session.chainring && session.sprocket
    ? `${session.chainring.teeth}/${session.sprocket.teeth}`
    : null

  return (
    <Card className="space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white">{session.event_type}</h3>
            {gearSetup && (
              <span className="text-xs bg-navy-700 px-2 py-0.5 rounded text-gray-300">
                {gearSetup}
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm">
            {session.track_name || 'Track'} - {session.track_length}m
          </p>
          <p className="text-gray-500 text-xs">{sessionDate}</p>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(session.id)}
            className="text-gray-400 hover:text-red-400 transition-colors p-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {lapTimes.length > 0 && (
        <div className="flex gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase">Best</p>
            <p className="text-lg font-semibold text-primary-500">
              {bestTime !== null ? formatTime(bestTime) : '-'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Avg</p>
            <p className="text-lg font-semibold text-gray-300">
              {avgTime !== null ? formatTime(avgTime) : '-'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Laps</p>
            <p className="text-lg font-semibold text-gray-300">{lapTimes.length}</p>
          </div>
        </div>
      )}

      {lapTimes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {session.lap_times?.sort((a, b) => a.lap_number - b.lap_number).map((lt) => (
            <span
              key={lt.id}
              className={`text-sm px-2 py-1 rounded ${
                lt.time_ms === bestTime
                  ? 'bg-primary-500/20 text-primary-400'
                  : 'bg-navy-700 text-gray-300'
              }`}
            >
              {formatTime(lt.time_ms)}
            </span>
          ))}
        </div>
      )}

      {/* RPE display or inline add */}
      {session.rpe ? (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">RPE</span>
          <span className="text-sm font-medium text-primary-500">{session.rpe}/10</span>
        </div>
      ) : onUpdateRpe ? (
        <InlineRpeAdd sessionId={session.id} onSave={onUpdateRpe} />
      ) : null}

      {session.notes && (
        <p className="text-gray-400 text-sm italic">{session.notes}</p>
      )}
    </Card>
  )
}

function InlineRpeAdd({ sessionId, onSave }: { sessionId: string; onSave: (id: string, rpe: number) => void }) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState('5')

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="text-xs text-gray-500 hover:text-primary-400 transition-colors"
      >
        + Add RPE
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500">RPE</span>
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-24 accent-primary-500"
      />
      <span className="text-sm font-medium text-primary-500 w-6 text-center">{value}</span>
      <button
        onClick={() => {
          onSave(sessionId, parseInt(value, 10))
          setIsEditing(false)
        }}
        className="text-xs text-primary-500 hover:text-primary-400"
      >
        Save
      </button>
      <button
        onClick={() => setIsEditing(false)}
        className="text-xs text-gray-500 hover:text-gray-300"
      >
        Cancel
      </button>
    </div>
  )
}
