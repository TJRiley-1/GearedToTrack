import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { LoadingScreen } from '../components/common'

export function AuthCallback() {
  const navigate = useNavigate()
  const { setUser, setSession, fetchProfile } = useAuthStore()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) throw error

        if (session) {
          setUser(session.user)
          setSession(session)
          await fetchProfile()

          // Check if profile exists and onboarding is complete
          const { data: profile } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', session.user.id)
            .single()

          if (profile?.onboarding_completed) {
            navigate('/home', { replace: true })
          } else {
            navigate('/onboarding', { replace: true })
          }
        } else {
          navigate('/', { replace: true })
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        navigate('/', { replace: true })
      }
    }

    handleCallback()
  }, [navigate, setUser, setSession, fetchProfile])

  return <LoadingScreen text="Signing you in..." />
}
