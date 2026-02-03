import { useNavigate } from 'react-router-dom'

const actions = [
  {
    label: 'Add Lap Time',
    description: 'Record a new session',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    path: '/times',
    color: 'text-primary-500',
    bgColor: 'bg-primary-500/10',
  },
  {
    label: 'Add Chainring',
    description: 'Add a new chainring',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    path: '/gears?tab=chainrings&action=add',
    color: 'text-secondary-500',
    bgColor: 'bg-secondary-500/10',
  },
  {
    label: 'Add Sprocket',
    description: 'Add a new sprocket',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    path: '/gears?tab=sprockets&action=add',
    color: 'text-secondary-500',
    bgColor: 'bg-secondary-500/10',
  },
  {
    label: 'Gear Calculator',
    description: 'View all ratios',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    path: '/gears',
    color: 'text-primary-500',
    bgColor: 'bg-primary-500/10',
  },
]

export function QuickActions() {
  const navigate = useNavigate()

  return (
    <div>
      <h3 className="text-gray-400 text-sm font-medium mb-3">Quick Actions</h3>
      <div className="space-y-2">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="w-full bg-navy-800 border border-navy-700 rounded-xl p-4 flex items-center gap-4 hover:bg-navy-700 transition-colors text-left"
          >
            <div className={`p-2 rounded-lg ${action.bgColor}`}>
              <span className={action.color}>{action.icon}</span>
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">{action.label}</p>
              <p className="text-gray-400 text-sm">{action.description}</p>
            </div>
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}
