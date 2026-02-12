import { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  tips?: string[]
  action?: ReactNode
}

export function EmptyState({ icon, title, description, tips, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="mb-4 text-gray-500">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-white mb-1">{title}</h3>
      {description && (
        <p className="text-gray-400 mb-4 max-w-sm">{description}</p>
      )}
      {tips && tips.length > 0 && (
        <div className="bg-navy-800 border border-navy-700 rounded-lg p-3 mb-4 max-w-sm w-full text-left">
          <p className="text-gray-400 text-xs font-medium mb-1.5">Tips</p>
          <ul className="text-gray-300 text-sm space-y-1">
            {tips.map((tip, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-primary-500 flex-shrink-0">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  )
}
