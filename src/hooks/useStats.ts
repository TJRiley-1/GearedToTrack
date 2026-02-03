import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

interface UserStats {
  totalSessions: number
  totalGearCombos: number
  totalFavorites: number
  totalChainrings: number
  totalSprockets: number
}

export function useStats() {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: ['stats', user?.id],
    queryFn: async (): Promise<UserStats> => {
      if (!user) {
        return {
          totalSessions: 0,
          totalGearCombos: 0,
          totalFavorites: 0,
          totalChainrings: 0,
          totalSprockets: 0,
        }
      }

      const [sessionsResult, chainringsResult, sprocketsResult] = await Promise.all([
        supabase.from('lap_sessions').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('chainrings').select('id, is_favorite').eq('user_id', user.id),
        supabase.from('sprockets').select('id, is_favorite').eq('user_id', user.id),
      ])

      const chainrings = chainringsResult.data || []
      const sprockets = sprocketsResult.data || []

      const favoriteChainrings = chainrings.filter((c) => c.is_favorite).length
      const favoriteSprockets = sprockets.filter((s) => s.is_favorite).length

      return {
        totalSessions: sessionsResult.count || 0,
        totalGearCombos: chainrings.length * sprockets.length,
        totalFavorites: favoriteChainrings + favoriteSprockets,
        totalChainrings: chainrings.length,
        totalSprockets: sprockets.length,
      }
    },
    enabled: !!user,
  })
}
