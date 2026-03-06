import { useState, useMemo } from 'react'
import { Card, Select } from '../common'
import { usePersonalBests } from '../../hooks'
import { useAuthStore } from '../../store/authStore'
import { formatTime } from '../../lib/calculations'
import { getBCCategory, getStandards, getAgeGroup, BC_STANDARD_EVENTS, BC_AGE_GROUPS } from '../../lib/bcStandards'
import type { BCCategory } from '../../types'

const CATEGORY_COLORS: Record<BCCategory, string> = {
  A: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  B: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  C: 'bg-green-500/20 text-green-400 border-green-500/30',
  D: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  E: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
]

export function BCStandardsTab() {
  const { profile } = useAuthStore()
  const { personalBests } = usePersonalBests()

  const defaultAgeGroup = getAgeGroup(profile?.age)

  const [eventType, setEventType] = useState(BC_STANDARD_EVENTS[0])
  const [ageGroup, setAgeGroup] = useState(defaultAgeGroup)
  const [gender, setGender] = useState<'male' | 'female'>('male')

  const eventOptions = BC_STANDARD_EVENTS.map((e) => ({ value: e, label: e }))
  const ageOptions = BC_AGE_GROUPS.map((a) => ({ value: a, label: a }))

  const standards = useMemo(
    () => getStandards(eventType, ageGroup, gender),
    [eventType, ageGroup, gender]
  )

  // Find user's best for this event
  const userBest = personalBests.find((pb) => pb.eventType === eventType)

  // For pursuit/TT events, the PB represents a total time (sum of laps)
  // We need the total session time, not individual lap best
  // For now, use the lap PB as an approximation
  const userTimeMs = userBest?.bestTimeMs ?? null

  const achievedCategory = useMemo(() => {
    if (userTimeMs === null) return null
    return getBCCategory(eventType, ageGroup, gender, userTimeMs)
  }, [eventType, ageGroup, gender, userTimeMs])

  return (
    <div className="space-y-4">
      <Select
        label="Event"
        value={eventType}
        onChange={(e) => setEventType(e.target.value)}
        options={eventOptions}
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Age Group"
          value={ageGroup}
          onChange={(e) => setAgeGroup(e.target.value)}
          options={ageOptions}
        />
        <Select
          label="Gender"
          value={gender}
          onChange={(e) => setGender(e.target.value as 'male' | 'female')}
          options={GENDER_OPTIONS}
        />
      </div>

      {/* User's achieved category */}
      {userTimeMs !== null && (
        <Card className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Your Best</p>
              <p className="text-lg font-semibold text-primary-500">{formatTime(userTimeMs)}</p>
            </div>
            {achievedCategory ? (
              <span className={`text-2xl font-bold px-4 py-2 rounded-lg border ${CATEGORY_COLORS[achievedCategory]}`}>
                {achievedCategory}
              </span>
            ) : (
              <span className="text-sm text-gray-500 px-3 py-1 bg-navy-700 rounded-lg">
                Below E
              </span>
            )}
          </div>
        </Card>
      )}

      {/* Standards table */}
      {standards.length > 0 ? (
        <Card padding="sm" className="space-y-1">
          <div className="grid grid-cols-3 text-xs text-gray-500 font-medium pb-1 border-b border-navy-700">
            <div>Category</div>
            <div>Time</div>
            <div>Status</div>
          </div>
          {standards.map((standard) => {
            const isAchieved = userTimeMs !== null && userTimeMs <= standard.timeMs
            const isCurrentCategory = achievedCategory === standard.category

            return (
              <div
                key={standard.category}
                className={`grid grid-cols-3 text-sm py-1.5 rounded px-1 ${
                  isCurrentCategory ? 'bg-navy-700' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-6 h-6 rounded text-center leading-6 text-xs font-bold border ${CATEGORY_COLORS[standard.category]}`}>
                    {standard.category}
                  </span>
                </div>
                <div className="text-white font-medium flex items-center">
                  {formatTime(standard.timeMs)}
                </div>
                <div className="flex items-center">
                  {isAchieved ? (
                    <span className="text-green-400 text-xs flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Achieved
                    </span>
                  ) : userTimeMs !== null ? (
                    <span className="text-gray-500 text-xs">
                      {formatTime(userTimeMs - standard.timeMs)} off
                    </span>
                  ) : (
                    <span className="text-gray-600 text-xs">—</span>
                  )}
                </div>
              </div>
            )
          })}
        </Card>
      ) : (
        <Card className="text-center py-6">
          <p className="text-gray-400 text-sm">
            No BC standards available for {eventType} / {ageGroup} / {gender}
          </p>
        </Card>
      )}

      <p className="text-xs text-gray-600">
        Standards are approximate BC accreditation targets. Pursuit and TT categories
        are based on total event time, not individual lap times.
      </p>
    </div>
  )
}
