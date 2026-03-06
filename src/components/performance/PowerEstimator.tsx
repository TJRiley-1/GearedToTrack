import { useState, useMemo } from 'react'
import { Card, Input, Select } from '../common'
import { useAuthStore } from '../../store/authStore'
import { useLapSessions } from '../../hooks'
import { formatTime, estimatePower } from '../../lib/calculations'

export function PowerEstimator() {
  const { profile } = useAuthStore()
  const { data: sessions } = useLapSessions()

  const [mode, setMode] = useState<'manual' | 'session'>('manual')
  const [sessionId, setSessionId] = useState('')
  const [timeStr, setTimeStr] = useState('')
  const [distance, setDistance] = useState((profile?.default_track_length || 250).toString())
  const [weight, setWeight] = useState('75')
  const [bikeWeight, setBikeWeight] = useState('8')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [cdA, setCdA] = useState('0.32')
  const [crr, setCrr] = useState('0.002')
  const [airDensity, setAirDensity] = useState('1.2')

  const sessionOptions = useMemo(() => {
    if (!sessions?.length) return []
    return sessions
      .filter((s) => s.lap_times?.length > 0)
      .map((s) => {
        const bestMs = Math.min(...s.lap_times.map((lt) => lt.time_ms))
        return {
          value: s.id,
          label: `${s.event_type} — ${formatTime(bestMs)} (${new Date(s.session_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })})`,
        }
      })
  }, [sessions])

  // Derive time and distance from selected session
  const sessionData = useMemo(() => {
    if (mode !== 'session' || !sessionId || !sessions) return null
    const session = sessions.find((s) => s.id === sessionId)
    if (!session || !session.lap_times?.length) return null

    const bestMs = Math.min(...session.lap_times.map((lt) => lt.time_ms))
    return {
      timeSeconds: bestMs / 1000,
      distanceMeters: session.track_length,
    }
  }, [mode, sessionId, sessions])

  const manualData = useMemo(() => {
    if (mode !== 'manual') return null
    // Parse time
    const trimmed = timeStr.trim()
    let seconds: number

    if (trimmed.includes(':')) {
      const parts = trimmed.split(':')
      if (parts.length !== 2) return null
      const mins = parseInt(parts[0], 10)
      const secs = parseFloat(parts[1])
      if (isNaN(mins) || isNaN(secs)) return null
      seconds = mins * 60 + secs
    } else {
      seconds = parseFloat(trimmed)
      if (isNaN(seconds)) return null
    }

    if (seconds <= 0) return null

    return {
      timeSeconds: seconds,
      distanceMeters: parseInt(distance, 10) || 250,
    }
  }, [mode, timeStr, distance])

  const data = mode === 'session' ? sessionData : manualData

  const result = useMemo(() => {
    if (!data) return null
    const riderWeight = parseFloat(weight) || 75
    return estimatePower({
      timeSeconds: data.timeSeconds,
      distanceMeters: data.distanceMeters,
      riderWeightKg: riderWeight,
      bikeWeightKg: parseFloat(bikeWeight) || 8,
      cdA: showAdvanced ? parseFloat(cdA) || 0.32 : undefined,
      crr: showAdvanced ? parseFloat(crr) || 0.002 : undefined,
      airDensity: showAdvanced ? parseFloat(airDensity) || 1.2 : undefined,
    })
  }, [data, weight, bikeWeight, showAdvanced, cdA, crr, airDensity])

  return (
    <div className="space-y-4">
      <Select
        label="Input Mode"
        value={mode}
        onChange={(e) => setMode(e.target.value as 'manual' | 'session')}
        options={[
          { value: 'manual', label: 'Manual Entry' },
          { value: 'session', label: 'From Session' },
        ]}
      />

      {mode === 'session' ? (
        <Select
          label="Session"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          options={sessionOptions}
          placeholder="Select a session..."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Lap Time"
            value={timeStr}
            onChange={(e) => setTimeStr(e.target.value)}
            placeholder="e.g., 13.500"
          />
          <Input
            label="Distance (m)"
            type="number"
            min="100"
            max="10000"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Rider Weight (kg)"
          type="number"
          min="30"
          max="200"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <Input
          label="Bike Weight (kg)"
          type="number"
          min="4"
          max="20"
          value={bikeWeight}
          onChange={(e) => setBikeWeight(e.target.value)}
        />
      </div>

      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
      >
        {showAdvanced ? 'Hide' : 'Show'} advanced parameters
      </button>

      {showAdvanced && (
        <div className="grid grid-cols-3 gap-3">
          <Input
            label="CdA (m²)"
            type="number"
            step="0.01"
            min="0.1"
            max="1.0"
            value={cdA}
            onChange={(e) => setCdA(e.target.value)}
          />
          <Input
            label="Crr"
            type="number"
            step="0.001"
            min="0.001"
            max="0.01"
            value={crr}
            onChange={(e) => setCrr(e.target.value)}
          />
          <Input
            label="Air ρ (kg/m³)"
            type="number"
            step="0.01"
            min="0.9"
            max="1.5"
            value={airDensity}
            onChange={(e) => setAirDensity(e.target.value)}
          />
        </div>
      )}

      {result && (
        <Card className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-500">Estimated Power</p>
              <p className="text-3xl font-bold text-primary-500">
                {Math.round(result.totalWatts)}
                <span className="text-sm text-gray-400 ml-1">W</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Power-to-Weight</p>
              <p className="text-3xl font-bold text-secondary-500">
                {result.wattsPerKg.toFixed(1)}
                <span className="text-sm text-gray-400 ml-1">W/kg</span>
              </p>
            </div>
          </div>

          <div className="border-t border-navy-700 pt-3 grid grid-cols-2 gap-4 text-center text-sm">
            <div>
              <p className="text-xs text-gray-500">Aero Power</p>
              <p className="text-white font-medium">{Math.round(result.aeroPower)} W</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Rolling Power</p>
              <p className="text-white font-medium">{Math.round(result.rollingPower)} W</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Speed</p>
              <p className="text-white font-medium">{result.speedKmh.toFixed(1)} km/h</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Avg Speed</p>
              <p className="text-white font-medium">{result.speedMs.toFixed(1)} m/s</p>
            </div>
          </div>
        </Card>
      )}

      <p className="text-xs text-gray-600">
        Simplified model: P = P<sub>aero</sub> + P<sub>rolling</sub>. Does not account for
        acceleration, drivetrain loss, or altitude. Best used for steady-state efforts.
      </p>
    </div>
  )
}
