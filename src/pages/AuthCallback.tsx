import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { LoadingScreen } from '../components/common'

/**
 * Legacy callback route. With implicit flow, OAuth tokens now arrive at /
 * via hash fragment and are handled by detectSessionInUrl + onAuthStateChange.
 * This page exists as a fallback redirect.
 */
export function AuthCallback() {
  const navigate = useNavigate()
  const { user, isLoading } = useAuthStore()

  useEffect(() => {
    if (isLoading) return

    if (user) {
      navigate('/home', { replace: true })
    } else {
      navigate('/', { replace: true })
    }
  }, [user, isLoading, navigate])

  return <LoadingScreen text="Signing you in..." />
}
