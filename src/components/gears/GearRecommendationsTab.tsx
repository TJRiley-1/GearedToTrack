import { useState, useMemo } from 'react'
import { Card, Select } from '../common'
import { useChainrings, useSprockets } from '../../hooks'
import { useAuthStore } from '../../store/authStore'
import { calculateRatio } from '../../lib/calculations'
import { getGearRecommendation, getEventRecommendations, RECOMMENDED_EVENTS } from '../../lib/gearRecommendations'
import type { RiderLevel } from '../../types'

const LEVELS: { value: RiderLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'elite', label: 'Elite' },
]

export function GearRecommendationsTab() {
  const { data: chainrings } = useChainrings()
  const { data: sprockets } = useSprockets()
  const { profile } = useAuthStore()

  const [eventType, setEventType] = useState(RECOMMENDED_EVENTS[0])
  const [level, setLevel] = useState<RiderLevel>('intermediate')

  const trackLength = profile?.default_track_length || 250

  const eventOptions = RECOMMENDED_EVENTS.map((e) => ({ value: e, label: e }))

  const recommendation = useMemo(
    () => getGearRecommendation(eventType, level, trackLength),
    [eventType, level, trackLength]
  )

  const allLevels = useMemo(
    () => getEventRecommendations(eventType, trackLength),
    [eventType, trackLength]
  )

  // Find user setups that match the recommended range
  const matchingSetups = useMemo(() => {
    if (!recommendation || !chainrings?.length || !sprockets?.length) return []

    const matches: { chainring: number; sprocket: number; ratio: number }[] = []
    for (const c of chainrings) {
      for (const s of sprockets) {
        const ratio = calculateRatio(c.teeth, s.teeth)
        if (ratio >= recommendation.minRatio && ratio <= recommendation.maxRatio) {
          matches.push({ chainring: c.teeth, sprocket: s.teeth, ratio })
        }
      }
    }
    return matches.sort((a, b) => a.ratio - b.ratio)
  }, [recommendation, chainrings, sprockets])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Event"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          options={eventOptions}
        />
        <Select
          label="Level"
          value={level}
          onChange={(e) => setLevel(e.target.value as RiderLevel)}
          options={LEVELS}
        />
      </div>

      {recommendation && (
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">{eventType}</h3>
            <span className="text-xs bg-navy-700 px-2 py-0.5 rounded text-gray-300 capitalize">
              {level}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Recommended Ratio</p>
              <p className="text-lg font-semibold text-primary-500">
                {recommendation.minRatio.toFixed(1)} – {recommendation.maxRatio.toFixed(1)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Typical Setup</p>
              <p className="text-lg font-semibold text-white">
                {recommendation.typicalChainring}/{recommendation.typicalSprocket}
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-400">{recommendation.notes}</p>

          <p className="text-xs text-gray-500">
            Track: {trackLength}m (set in Profile)
          </p>
        </Card>
      )}

      {matchingSetups.length > 0 && (
        <Card className="space-y-2">
          <p className="text-sm font-medium text-secondary-500">
            Your matching setups
          </p>
          <div className="space-y-1">
            {matchingSetups.map((s) => (
              <div
                key={`${s.chainring}-${s.sprocket}`}
                className="flex items-center justify-between py-1 text-sm"
              >
                <span className="text-white">
                  {s.chainring}/{s.sprocket}
                </span>
                <span className="text-gray-400">{s.ratio.toFixed(3)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {matchingSetups.length === 0 && recommendation && chainrings?.length && sprockets?.length && (
        <Card className="text-center py-4">
          <p className="text-gray-400 text-sm">
            None of your current gear combos fall in the {recommendation.minRatio.toFixed(1)}–{recommendation.maxRatio.toFixed(1)} range
          </p>
        </Card>
      )}

      {/* All levels overview */}
      {allLevels.length > 0 && (
        <Card padding="sm" className="space-y-2">
          <p className="text-xs font-medium text-gray-500">All levels for {eventType}</p>
          <div className="space-y-1">
            {allLevels.map((rec) => (
              <div
                key={rec.level}
                className={`grid grid-cols-[1fr_auto_auto] items-center gap-x-4 py-1.5 text-sm rounded px-2 ${
                  rec.level === level ? 'bg-navy-700' : ''
                }`}
              >
                <span className={`capitalize ${rec.level === level ? 'text-primary-500 font-medium' : 'text-gray-400'}`}>
                  {rec.level}
                </span>
                <span className="text-white text-right tabular-nums">
                  {rec.minRatio.toFixed(1)} – {rec.maxRatio.toFixed(1)}
                </span>
                <span className="text-gray-500 text-xs text-right tabular-nums w-10">
                  {rec.typicalChainring}/{rec.typicalSprocket}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
