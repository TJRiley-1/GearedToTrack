import { Card } from '../common'
import { useAuthStore } from '../../store/authStore'
import { useStats } from '../../hooks'

export function UserCard() {
  const { profile } = useAuthStore()
  const { data: stats } = useStats()

  const initial = profile?.name?.charAt(0).toUpperCase() || 'U'

  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{initial}</span>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-white">{profile?.name}</h2>
          <p className="text-gray-400 text-sm">{profile?.email}</p>
          {profile?.age && (
            <p className="text-gray-500 text-sm">{profile.age} years old</p>
          )}
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-navy-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{stats.totalSessions}</p>
            <p className="text-gray-400 text-xs">Sessions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{stats.totalChainrings}</p>
            <p className="text-gray-400 text-xs">Chainrings</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{stats.totalSprockets}</p>
            <p className="text-gray-400 text-xs">Sprockets</p>
          </div>
        </div>
      )}
    </Card>
  )
}
