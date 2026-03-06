import { useState, useMemo } from 'react'
import { Card, Input, Select } from '../common'
import { useAuthStore } from '../../store/authStore'
import {
  formatTime,
  parseTime,
  calculateEvenSplits,
  calculateNegativeSplits,
  calculateProgressiveSplits,
} from '../../lib/calculations'
import type { PacingStrategy } from '../../types'

const STRATEGY_OPTIONS = [
  { value: 'even', label: 'Even Splits' },
  { value: 'negative', label: 'Negative Splits (get faster)' },
  { value: 'progressive', label: 'Progressive (front-loaded)' },
]

export function PacingCalculator() {
  const { profile } = useAuthStore()

  const [targetTimeStr, setTargetTimeStr] = useState('')
  const [trackLength, setTrackLength] = useState(
    (profile?.default_track_length || 250).toString()
  )
  const [totalDistance, setTotalDistance] = useState('4000')
  const [strategy, setStrategy] = useState<PacingStrategy>('even')
  const [aggression, setAggression] = useState('50')

  const lapCount = useMemo(() => {
    const track = parseInt(trackLength, 10)
    const dist = parseInt(totalDistance, 10)
    if (!track || !dist || track <= 0) return 0
    return Math.ceil(dist / track)
  }, [trackLength, totalDistance])

  const targetMs = useMemo(() => parseTime(targetTimeStr), [targetTimeStr])

  const splits = useMemo(() => {
    if (!targetMs || lapCount <= 0) return null

    const aggressionValue = parseInt(aggression, 10) / 100

    switch (strategy) {
      case 'even':
        return calculateEvenSplits(targetMs, lapCount)
      case 'negative':
        return calculateNegativeSplits(targetMs, lapCount, aggressionValue)
      case 'progressive':
        return calculateProgressiveSplits(targetMs, lapCount, aggressionValue)
    }
  }, [targetMs, lapCount, strategy, aggression])

  const evenSplits = useMemo(() => {
    if (!targetMs || lapCount <= 0) return null
    return calculateEvenSplits(targetMs, lapCount)
  }, [targetMs, lapCount])

  // Max split time for SVG bar chart scaling
  const maxSplit = splits ? Math.max(...splits) : 0

  return (
    <div className="space-y-4">
      <Input
        label="Target Time"
        value={targetTimeStr}
        onChange={(e) => setTargetTimeStr(e.target.value)}
        placeholder="e.g., 4:30.000 or 13.500"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Track Length (m)"
          type="number"
          min="200"
          max="500"
          value={trackLength}
          onChange={(e) => setTrackLength(e.target.value)}
        />
        <Input
          label="Total Distance (m)"
          type="number"
          min="200"
          max="20000"
          value={totalDistance}
          onChange={(e) => setTotalDistance(e.target.value)}
        />
      </div>

      <Select
        label="Pacing Strategy"
        value={strategy}
        onChange={(e) => setStrategy(e.target.value as PacingStrategy)}
        options={STRATEGY_OPTIONS}
      />

      {strategy !== 'even' && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Aggression: {aggression}%
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={aggression}
            onChange={(e) => setAggression(e.target.value)}
            className="w-full accent-primary-500"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Conservative</span>
            <span>Aggressive</span>
          </div>
        </div>
      )}

      {lapCount > 0 && targetMs && (
        <Card padding="sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-300">
              {lapCount} laps @ {parseInt(trackLength, 10)}m
            </p>
            <p className="text-xs text-gray-500">
              Target: {formatTime(targetMs)}
            </p>
          </div>
        </Card>
      )}

      {splits && (
        <>
          {/* SVG bar chart */}
          <Card padding="sm">
            <svg viewBox={`0 0 320 ${lapCount * 28 + 10}`} className="w-full">
              {splits.map((splitMs, i) => {
                const barWidth = maxSplit > 0 ? (splitMs / maxSplit) * 260 : 0
                const evenWidth = evenSplits && maxSplit > 0 ? (evenSplits[i] / maxSplit) * 260 : 0
                const y = i * 28 + 5

                return (
                  <g key={i}>
                    {/* Even split reference line */}
                    {strategy !== 'even' && evenWidth > 0 && (
                      <rect x="40" y={y + 2} width={evenWidth} height={18} rx="2" fill="#1e293b" />
                    )}
                    {/* Actual split bar */}
                    <rect
                      x="40"
                      y={y + 2}
                      width={barWidth}
                      height={18}
                      rx="2"
                      fill={strategy === 'even' ? '#f59e0b' : i < lapCount / 2 ? '#f59e0b' : '#14b8a6'}
                      opacity="0.8"
                    />
                    {/* Lap number */}
                    <text x="4" y={y + 15} fill="#9ca3af" fontSize="11" fontFamily="monospace">
                      L{i + 1}
                    </text>
                    {/* Time label */}
                    <text x="305" y={y + 15} fill="#e5e7eb" fontSize="11" fontFamily="monospace" textAnchor="end">
                      {formatTime(splitMs)}
                    </text>
                  </g>
                )
              })}
            </svg>
          </Card>

          {/* Split table */}
          <Card padding="sm">
            <div className="space-y-1">
              <div className="grid grid-cols-4 text-xs text-gray-500 font-medium pb-1 border-b border-navy-700">
                <div>Lap</div>
                <div>Split</div>
                <div>Cumulative</div>
                <div>Pace/km</div>
              </div>
              {splits.map((splitMs, i) => {
                const cumulative = splits.slice(0, i + 1).reduce((a, b) => a + b, 0)
                const lapDistM = parseInt(trackLength, 10) || 250
                const pacePerKm = splitMs / (lapDistM / 1000)
                return (
                  <div key={i} className="grid grid-cols-4 text-sm py-0.5">
                    <div className="text-gray-400">{i + 1}</div>
                    <div className="text-white">{formatTime(splitMs)}</div>
                    <div className="text-gray-300">{formatTime(cumulative)}</div>
                    <div className="text-gray-400">{formatTime(pacePerKm)}</div>
                  </div>
                )
              })}
            </div>
          </Card>
        </>
      )}

      {!targetMs && targetTimeStr && (
        <p className="text-red-400 text-sm">
          Invalid time format. Use SS.mmm or M:SS.mmm
        </p>
      )}
    </div>
  )
}
