import { useState, useMemo } from 'react'
import { Card, EmptyState, Loading, Select } from '../common'
import { useChainrings, useSprockets } from '../../hooks'
import { useAuthStore } from '../../store/authStore'
import { calculateRatio, calculateGearInches, calculateDevelopment } from '../../lib/calculations'

type SortOption = 'ratio-asc' | 'ratio-desc' | 'development-asc' | 'development-desc'

interface GearCombo {
  chainringTeeth: number
  sprocketTeeth: number
  ratio: number
  gearInches: number
  development: number
}

export function RatiosTab() {
  const { data: chainrings, isLoading: loadingChainrings } = useChainrings()
  const { data: sprockets, isLoading: loadingSprockets } = useSprockets()
  const { profile } = useAuthStore()
  const [sortBy, setSortBy] = useState<SortOption>('ratio-desc')

  const wheelDiameter = profile?.wheel_diameter || 668

  const combinations = useMemo(() => {
    if (!chainrings?.length || !sprockets?.length) return []

    const combos: GearCombo[] = []
    for (const chainring of chainrings) {
      for (const sprocket of sprockets) {
        combos.push({
          chainringTeeth: chainring.teeth,
          sprocketTeeth: sprocket.teeth,
          ratio: calculateRatio(chainring.teeth, sprocket.teeth),
          gearInches: calculateGearInches(chainring.teeth, sprocket.teeth, wheelDiameter),
          development: calculateDevelopment(chainring.teeth, sprocket.teeth, wheelDiameter),
        })
      }
    }

    // Sort
    combos.sort((a, b) => {
      switch (sortBy) {
        case 'ratio-asc':
          return a.ratio - b.ratio
        case 'ratio-desc':
          return b.ratio - a.ratio
        case 'development-asc':
          return a.development - b.development
        case 'development-desc':
          return b.development - a.development
        default:
          return 0
      }
    })

    return combos
  }, [chainrings, sprockets, wheelDiameter, sortBy])

  const isLoading = loadingChainrings || loadingSprockets

  if (isLoading) {
    return (
      <div className="py-12">
        <Loading text="Calculating ratios..." />
      </div>
    )
  }

  if (!chainrings?.length || !sprockets?.length) {
    return (
      <EmptyState
        icon={
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        }
        title="Add gear components first"
        description="You need at least one chainring and one sprocket to see gear ratios"
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-gray-400 text-sm">
          {combinations.length} combination{combinations.length !== 1 ? 's' : ''}
        </p>
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          options={[
            { value: 'ratio-desc', label: 'Ratio (High to Low)' },
            { value: 'ratio-asc', label: 'Ratio (Low to High)' },
            { value: 'development-desc', label: 'Development (High to Low)' },
            { value: 'development-asc', label: 'Development (Low to High)' },
          ]}
          className="w-48"
        />
      </div>

      <div className="space-y-2">
        {combinations.map((combo) => (
          <Card
            key={`${combo.chainringTeeth}-${combo.sprocketTeeth}`}
            padding="sm"
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="bg-navy-700 px-3 py-1.5 rounded-lg">
                <span className="text-primary-500 font-semibold">{combo.chainringTeeth}</span>
                <span className="text-gray-500 mx-1">/</span>
                <span className="text-secondary-500 font-semibold">{combo.sprocketTeeth}</span>
              </div>
              <div>
                <p className="text-white font-medium">{combo.ratio.toFixed(2)}</p>
                <p className="text-gray-400 text-xs">Ratio</p>
              </div>
            </div>
            <div className="flex gap-6 text-right">
              <div>
                <p className="text-white font-medium">{combo.gearInches.toFixed(1)}"</p>
                <p className="text-gray-400 text-xs">Gear Inches</p>
              </div>
              <div>
                <p className="text-white font-medium">{combo.development.toFixed(2)}m</p>
                <p className="text-gray-400 text-xs">Development</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
