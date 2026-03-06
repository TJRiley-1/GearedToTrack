import { useState, useMemo } from 'react'
import { Card, Input, Select } from '../common'
import { useChainrings, useSprockets } from '../../hooks'
import { useAuthStore } from '../../store/authStore'
import {
  calculateSpeed,
  calculateRatio,
  calculateGearInches,
  calculateDevelopment,
  calculateSkidPatches,
} from '../../lib/calculations'

export function GearComparisonTab() {
  const { data: chainrings } = useChainrings()
  const { data: sprockets } = useSprockets()
  const { profile } = useAuthStore()

  const [chainringA, setChainringA] = useState('')
  const [sprocketA, setSprocketA] = useState('')
  const [chainringB, setChainringB] = useState('')
  const [sprocketB, setSprocketB] = useState('')
  const [customChainringA, setCustomChainringA] = useState('')
  const [customSprocketA, setCustomSprocketA] = useState('')
  const [customChainringB, setCustomChainringB] = useState('')
  const [customSprocketB, setCustomSprocketB] = useState('')
  const [useCustom, setUseCustom] = useState(false)

  const wheelDiameter = profile?.wheel_diameter || 668

  const chainringOptions = (chainrings || []).map((c) => ({
    value: c.teeth.toString(),
    label: `${c.teeth}T${c.brand ? ` (${c.brand})` : ''}`,
  }))

  const sprocketOptions = (sprockets || []).map((s) => ({
    value: s.teeth.toString(),
    label: `${s.teeth}T${s.brand ? ` (${s.brand})` : ''}`,
  }))

  const teethA = useMemo(() => {
    if (useCustom) {
      return {
        chainring: parseInt(customChainringA, 10) || 0,
        sprocket: parseInt(customSprocketA, 10) || 0,
      }
    }
    return {
      chainring: parseInt(chainringA, 10) || 0,
      sprocket: parseInt(sprocketA, 10) || 0,
    }
  }, [useCustom, chainringA, sprocketA, customChainringA, customSprocketA])

  const teethB = useMemo(() => {
    if (useCustom) {
      return {
        chainring: parseInt(customChainringB, 10) || 0,
        sprocket: parseInt(customSprocketB, 10) || 0,
      }
    }
    return {
      chainring: parseInt(chainringB, 10) || 0,
      sprocket: parseInt(sprocketB, 10) || 0,
    }
  }, [useCustom, chainringB, sprocketB, customChainringB, customSprocketB])

  const hasGears = (chainrings?.length || 0) > 0 && (sprockets?.length || 0) > 0
  const hasA = teethA.chainring > 0 && teethA.sprocket > 0
  const hasB = teethB.chainring > 0 && teethB.sprocket > 0

  const cadences = [80, 90, 100, 110, 120, 130]

  const comparison = useMemo(() => {
    if (!hasA && !hasB) return null

    const makeStats = (ct: number, st: number) => ({
      ratio: calculateRatio(ct, st),
      gearInches: calculateGearInches(ct, st, wheelDiameter),
      development: calculateDevelopment(ct, st, wheelDiameter),
      skidPatches: calculateSkidPatches(ct, st),
      speeds: cadences.map((rpm) => calculateSpeed(ct, st, rpm, wheelDiameter)),
    })

    return {
      a: hasA ? makeStats(teethA.chainring, teethA.sprocket) : null,
      b: hasB ? makeStats(teethB.chainring, teethB.sprocket) : null,
    }
  }, [hasA, hasB, teethA, teethB, wheelDiameter])

  return (
    <div className="space-y-4">
      {hasGears && !useCustom ? (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-primary-500">Setup A</p>
              <Select
                label="Chainring"
                value={chainringA}
                onChange={(e) => setChainringA(e.target.value)}
                options={chainringOptions}
                placeholder="Select..."
              />
              <Select
                label="Sprocket"
                value={sprocketA}
                onChange={(e) => setSprocketA(e.target.value)}
                options={sprocketOptions}
                placeholder="Select..."
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-secondary-500">Setup B</p>
              <Select
                label="Chainring"
                value={chainringB}
                onChange={(e) => setChainringB(e.target.value)}
                options={chainringOptions}
                placeholder="Select..."
              />
              <Select
                label="Sprocket"
                value={sprocketB}
                onChange={(e) => setSprocketB(e.target.value)}
                options={sprocketOptions}
                placeholder="Select..."
              />
            </div>
          </div>
          <button
            onClick={() => setUseCustom(true)}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Or enter custom tooth counts
          </button>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-primary-500">Setup A</p>
              <Input
                label="Chainring"
                type="number"
                min="30"
                max="70"
                value={customChainringA}
                onChange={(e) => setCustomChainringA(e.target.value)}
                placeholder="e.g., 49"
              />
              <Input
                label="Sprocket"
                type="number"
                min="10"
                max="25"
                value={customSprocketA}
                onChange={(e) => setCustomSprocketA(e.target.value)}
                placeholder="e.g., 15"
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-secondary-500">Setup B</p>
              <Input
                label="Chainring"
                type="number"
                min="30"
                max="70"
                value={customChainringB}
                onChange={(e) => setCustomChainringB(e.target.value)}
                placeholder="e.g., 51"
              />
              <Input
                label="Sprocket"
                type="number"
                min="10"
                max="25"
                value={customSprocketB}
                onChange={(e) => setCustomSprocketB(e.target.value)}
                placeholder="e.g., 14"
              />
            </div>
          </div>
          {hasGears && (
            <button
              onClick={() => setUseCustom(false)}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Use saved gear components
            </button>
          )}
        </>
      )}

      {comparison && (comparison.a || comparison.b) && (
        <>
          {/* Stats summary */}
          <Card padding="sm">
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div className="text-gray-500 text-xs font-medium" />
              {comparison.a && (
                <div className="text-primary-500 text-xs font-medium">
                  {teethA.chainring}/{teethA.sprocket}
                </div>
              )}
              {comparison.b && (
                <div className="text-secondary-500 text-xs font-medium">
                  {teethB.chainring}/{teethB.sprocket}
                </div>
              )}

              <div className="text-gray-400 text-xs">Ratio</div>
              {comparison.a && <div className="text-white font-medium">{comparison.a.ratio.toFixed(3)}</div>}
              {comparison.b && <div className="text-white font-medium">{comparison.b.ratio.toFixed(3)}</div>}

              <div className="text-gray-400 text-xs">Gear Inches</div>
              {comparison.a && <div className="text-white font-medium">{comparison.a.gearInches.toFixed(1)}"</div>}
              {comparison.b && <div className="text-white font-medium">{comparison.b.gearInches.toFixed(1)}"</div>}

              <div className="text-gray-400 text-xs">Development</div>
              {comparison.a && <div className="text-white font-medium">{comparison.a.development.toFixed(2)}m</div>}
              {comparison.b && <div className="text-white font-medium">{comparison.b.development.toFixed(2)}m</div>}

              <div className="text-gray-400 text-xs">Skid Patches</div>
              {comparison.a && <div className="text-white font-medium">{comparison.a.skidPatches}</div>}
              {comparison.b && <div className="text-white font-medium">{comparison.b.skidPatches}</div>}
            </div>
          </Card>

          {/* Speed table */}
          <Card padding="sm">
            <p className="text-gray-400 text-xs font-medium mb-2">Speed at Cadence</p>
            <div className="space-y-1">
              <div className="grid grid-cols-3 text-xs text-gray-500 font-medium pb-1 border-b border-navy-700">
                <div>RPM</div>
                {comparison.a && <div className="text-primary-500">{teethA.chainring}/{teethA.sprocket}</div>}
                {comparison.b && <div className="text-secondary-500">{teethB.chainring}/{teethB.sprocket}</div>}
              </div>
              {cadences.map((rpm, i) => (
                <div key={rpm} className="grid grid-cols-3 text-sm py-0.5">
                  <div className="text-gray-400">{rpm}</div>
                  {comparison.a && (
                    <div className="text-white">{comparison.a.speeds[i].toFixed(1)} km/h</div>
                  )}
                  {comparison.b && (
                    <div className="text-white">{comparison.b.speeds[i].toFixed(1)} km/h</div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {!comparison && (
        <Card className="text-center py-8">
          <p className="text-gray-400">Select two gear setups to compare</p>
        </Card>
      )}
    </div>
  )
}
