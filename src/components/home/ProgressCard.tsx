import { Card } from '../common'
import { useStats } from '../../hooks'

export function ProgressCard() {
  const { data: stats, isLoading } = useStats()

  const progressItems = [
    {
      label: 'Sessions',
      value: stats?.totalSessions || 0,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Gear Combos',
      value: stats?.totalGearCombos || 0,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
    },
    {
      label: 'Favorites',
      value: stats?.totalFavorites || 0,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
  ]

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <div className="h-4 bg-navy-700 rounded w-24 mb-4" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center">
              <div className="h-8 bg-navy-700 rounded mb-2" />
              <div className="h-3 bg-navy-700 rounded w-16 mx-auto" />
            </div>
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <h3 className="text-gray-400 text-sm font-medium mb-4">Your Progress</h3>
      <div className="grid grid-cols-3 gap-4">
        {progressItems.map((item) => (
          <div key={item.label} className="text-center">
            <div className="flex items-center justify-center text-primary-500 mb-1">
              {item.icon}
            </div>
            <p className="text-2xl font-bold text-white">{item.value}</p>
            <p className="text-gray-400 text-xs">{item.label}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
