import { useState, useMemo } from 'react'
import { Card, Input, Select } from '../common'
import { useChainrings, useSprockets } from '../../hooks'
import { useAuthStore } from '../../store/authStore'
import { calculateSpeed, calculateCadence, calculateDevelopment, calculateRatio } from '../../lib/calculations'

type CalcMode = 'speed' | 'cadence'

export function SpeedCadenceCalc() {
  const { data: chainrings } = useChainrings()
  const { data: sprockets } = useSprockets()
  const { profile } = useAuthStore()

  const [chainringId, setChainringId] = useState('')
  const [sprocketId, setSprocketId] = useState('')
  const [mode, setMode] = useState<CalcMode>('speed')
  const [cadenceInput, setCadenceInput] = useState('90')
  const [speedInput, setSpeedInput] = useState('40')

  const wheelDiameter = profile?.wheel_diameter || 668

  const selectedChainring = chainrings?.find((c) => c.id === chainringId)
  const selectedSprocket = sprockets?.find((s) => s.id === sprocketId)

  const chainringOptions = (chainrings || []).map((c) => ({
    value: c.id,
    label: `${c.teeth}T${c.brand ? ` (${c.brand})` : ''}`,
  }))

  const sprocketOptions = (sprockets || []).map((s) => ({
    value: s.id,
    label: `${s.teeth}T${s.brand ? ` (${s.brand})` : ''}`,
  }))

  const modeOptions = [
    { value: 'speed', label: 'Cadence → Speed' },
    { value: 'cadence', label: 'Speed → Cadence' },
  ]

  const result = useMemo(() => {
    if (!selectedChainring || !selectedSprocket) return null

    const ct = selectedChainring.teeth
    const st = selectedSprocket.teeth
    const ratio = calculateRatio(ct, st)
    const development = calculateDevelopment(ct, st, wheelDiameter)

    if (mode === 'speed') {
      const rpm = parseFloat(cadenceInput)
      if (isNaN(rpm) || rpm < 0) return { ratio, development, value: null }
      const speed = calculateSpeed(ct, st, rpm, wheelDiameter)
      return { ratio, development, value: speed, unit: 'km/h', label: 'Speed' }
    } else {
      const kmh = parseFloat(speedInput)
      if (isNaN(kmh) || kmh < 0) return { ratio, development, value: null }
      const cadence = calculateCadence(ct, st, kmh, wheelDiameter)
      return { ratio, development, value: cadence, unit: 'RPM', label: 'Cadence' }
    }
  }, [selectedChainring, selectedSprocket, mode, cadenceInput, speedInput, wheelDiameter])

  const hasGears = (chainrings?.length || 0) > 0 && (sprockets?.length || 0) > 0

  if (!hasGears) {
    return (
      <Card className="text-center py-8">
        <p className="text-gray-400">Add chainrings and sprockets first to use the calculator.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Chainring"
          value={chainringId}
          onChange={(e) => setChainringId(e.target.value)}
          options={chainringOptions}
          placeholder="Select..."
        />
        <Select
          label="Sprocket"
          value={sprocketId}
          onChange={(e) => setSprocketId(e.target.value)}
          options={sprocketOptions}
          placeholder="Select..."
        />
      </div>

      <Select
        label="Calculate"
        value={mode}
        onChange={(e) => setMode(e.target.value as CalcMode)}
        options={modeOptions}
      />

      {mode === 'speed' ? (
        <Input
          label="Cadence (RPM)"
          type="number"
          min="0"
          max="300"
          value={cadenceInput}
          onChange={(e) => setCadenceInput(e.target.value)}
          placeholder="e.g., 90"
        />
      ) : (
        <Input
          label="Speed (km/h)"
          type="number"
          min="0"
          max="100"
          value={speedInput}
          onChange={(e) => setSpeedInput(e.target.value)}
          placeholder="e.g., 40"
        />
      )}

      {result && (
        <Card className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-gray-400 text-xs">Ratio</p>
              <p className="text-white font-semibold">{result.ratio.toFixed(3)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Development</p>
              <p className="text-white font-semibold">{result.development.toFixed(2)} m/rev</p>
            </div>
          </div>

          {result.value !== null && (
            <div className="text-center pt-2 border-t border-navy-700">
              <p className="text-gray-400 text-xs">{result.label}</p>
              <p className="text-3xl font-bold text-primary-500">
                {result.value.toFixed(1)} <span className="text-lg text-gray-400">{result.unit}</span>
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
