import { useState, useMemo } from 'react'
import { Card, Select, Loading } from '../common'
import { useAuthStore } from '../../store/authStore'
import { usePersonalBests, useCommunityBenchmarks } from '../../hooks'
import { formatTime } from '../../lib/calculations'
import type { CommunityBenchmark } from '../../types'

export function CommunityBenchmarks() {
  const { profile } = useAuthStore()
  const { data: benchmarks, isLoading, error } = useCommunityBenchmarks()
  const { personalBests } = usePersonalBests()

  const [selectedEvent, setSelectedEvent] = useState('')

  const isOptedIn = profile?.share_data_enabled && profile?.share_lap_times

  // Enrich benchmarks with user's own data
  const enriched = useMemo(() => {
    if (!benchmarks) return []
    return benchmarks.map((b) => {
      const userPB = personalBests.find(
        (pb) => pb.eventType === b.eventType && pb.trackLength === b.trackLength
      )
      if (!userPB) return b

      // Estimate percentile — interpolate between known percentiles
      const userTime = userPB.bestTimeMs
      let percentile: number | null = null

      if (userTime <= b.p10Ms) percentile = 10
      else if (userTime <= b.p25Ms) percentile = 10 + ((b.p25Ms - userTime) / (b.p25Ms - b.p10Ms)) * 15
      else if (userTime <= b.p50Ms) percentile = 25 + ((b.p50Ms - userTime) / (b.p50Ms - b.p25Ms)) * 25
      else if (userTime <= b.p75Ms) percentile = 50 + ((b.p75Ms - userTime) / (b.p75Ms - b.p50Ms)) * 25
      else if (userTime <= b.p90Ms) percentile = 75 + ((b.p90Ms - userTime) / (b.p90Ms - b.p75Ms)) * 15
      else percentile = 90

      // Lower percentile = faster (better)
      return {
        ...b,
        userBestMs: userTime,
        userPercentile: Math.round(Math.max(1, Math.min(99, percentile ?? 50))),
      }
    })
  }, [benchmarks, personalBests])

  const eventOptions = useMemo(() => {
    const events = [...new Set(enriched.map((b) => b.eventType))]
    return events.map((e) => ({ value: e, label: e }))
  }, [enriched])

  const effectiveEvent = selectedEvent || eventOptions[0]?.value || ''

  const filtered = enriched.filter((b) => b.eventType === effectiveEvent)

  // Opt-in gate
  if (!isOptedIn) {
    return (
      <Card className="text-center py-8 space-y-3">
        <svg className="w-12 h-12 mx-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <h3 className="text-white font-semibold">Community Benchmarks</h3>
        <p className="text-gray-400 text-sm max-w-xs mx-auto">
          Enable data sharing in your Profile to see how your times compare to other riders anonymously.
        </p>
        <p className="text-gray-500 text-xs">
          Profile → Privacy → Share lap times
        </p>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className="py-12">
        <Loading text="Loading community data..." />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="text-center py-8">
        <p className="text-red-400 text-sm">Failed to load community data</p>
        <p className="text-gray-500 text-xs mt-1">The benchmarks function may not be set up yet. Run migration 003.</p>
      </Card>
    )
  }

  if (!enriched.length) {
    return (
      <Card className="text-center py-8">
        <p className="text-gray-400 text-sm">
          Not enough community data yet. Need at least 5 riders per event to show benchmarks.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {eventOptions.length > 1 && (
        <Select
          label="Event"
          value={effectiveEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          options={eventOptions}
        />
      )}

      {filtered.map((benchmark) => (
        <BenchmarkCard key={`${benchmark.eventType}-${benchmark.trackLength}`} benchmark={benchmark} />
      ))}
    </div>
  )
}

function BenchmarkCard({ benchmark }: { benchmark: CommunityBenchmark }) {
  const W = 300
  const barY = 20
  const barH = 24

  // Percentile positions (map 0-100% to bar width)
  const p = (ms: number) => {
    const range = benchmark.p90Ms - benchmark.p10Ms
    if (range <= 0) return W / 2
    // Lower time = better = leftward
    return ((ms - benchmark.p10Ms) / range) * (W - 40) + 20
  }

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold">{benchmark.eventType}</h3>
          <p className="text-gray-500 text-xs">{benchmark.trackLength}m track</p>
        </div>
        <span className="text-xs text-gray-500">{benchmark.sampleSize} riders</span>
      </div>

      {/* Percentile distribution bar */}
      <svg viewBox={`0 0 ${W} 60`} className="w-full">
        {/* Background bar */}
        <rect x="20" y={barY} width={W - 40} height={barH} rx="4" fill="#1e293b" />

        {/* P25-P75 range (middle 50%) */}
        <rect
          x={p(benchmark.p25Ms)}
          y={barY}
          width={Math.max(0, p(benchmark.p75Ms) - p(benchmark.p25Ms))}
          height={barH}
          rx="4"
          fill="#374151"
        />

        {/* Percentile markers */}
        {[
          { ms: benchmark.p10Ms, label: 'P10' },
          { ms: benchmark.p25Ms, label: 'P25' },
          { ms: benchmark.p50Ms, label: 'P50' },
          { ms: benchmark.p75Ms, label: 'P75' },
          { ms: benchmark.p90Ms, label: 'P90' },
        ].map(({ ms, label }) => (
          <g key={label}>
            <line x1={p(ms)} y1={barY - 2} x2={p(ms)} y2={barY + barH + 2} stroke="#6b7280" strokeWidth="1" />
            <text x={p(ms)} y={barY + barH + 14} fill="#6b7280" fontSize="8" textAnchor="middle" fontFamily="sans-serif">
              {label}
            </text>
          </g>
        ))}

        {/* User marker */}
        {benchmark.userBestMs !== null && (
          <g>
            <line
              x1={p(benchmark.userBestMs)}
              y1={barY - 5}
              x2={p(benchmark.userBestMs)}
              y2={barY + barH + 5}
              stroke="#14b8a6"
              strokeWidth="2.5"
            />
            <text
              x={p(benchmark.userBestMs)}
              y={barY - 8}
              fill="#14b8a6"
              fontSize="9"
              fontFamily="monospace"
              textAnchor="middle"
              fontWeight="bold"
            >
              You
            </text>
          </g>
        )}
      </svg>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div>
          <p className="text-xs text-gray-500">Fastest (P10)</p>
          <p className="text-white">{formatTime(benchmark.p10Ms)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Median</p>
          <p className="text-white">{formatTime(benchmark.p50Ms)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Slowest (P90)</p>
          <p className="text-white">{formatTime(benchmark.p90Ms)}</p>
        </div>
      </div>

      {benchmark.userBestMs !== null && benchmark.userPercentile !== null && (
        <div className="text-center pt-2 border-t border-navy-700">
          <p className="text-xs text-gray-500">Your Best</p>
          <p className="text-lg font-semibold text-secondary-500">
            {formatTime(benchmark.userBestMs)}
          </p>
          <p className="text-xs text-gray-400">
            Top {benchmark.userPercentile}% of riders
          </p>
        </div>
      )}
    </Card>
  )
}
