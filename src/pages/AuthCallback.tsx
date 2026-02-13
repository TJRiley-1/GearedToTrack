import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { LoadingScreen } from '../components/common'
import { Button } from '../components/common'

export function AuthCallback() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [error, setError] = useState<string | null>(null)

  // Watch for the auth store to receive a user (set by onAuthStateChange in App.tsx).
  // Supabase's detectSessionInUrl handles extracting tokens from the URL automatically.
  useEffect(() => {
    if (!user) return

    const checkOnboarding = async () => {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single()

        if (profile?.onboarding_completed) {
          navigate('/home', { replace: true })
        } else {
          navigate('/onboarding', { replace: true })
        }
      } catch (err) {
        console.error('Profile check error:', err)
        navigate('/onboarding', { replace: true })
      }
    }

    checkOnboarding()
  }, [user, navigate])

  // Timeout: if no session arrives within 10 seconds, something went wrong
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!user) {
        setError(
          'Authentication timed out. This usually means the redirect URL ' +
          'is not configured in Supabase (Authentication → URL Configuration → Redirect URLs). ' +
          'Ensure https://www.gearedtotrack.co.uk/auth/callback is in the allowed list.'
        )
      }
    }, 10000)

    return () => clearTimeout(timeout)
  }, [user])

  if (error) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center px-6">
        <div className="max-w-sm w-full text-center space-y-4">
          <div className="text-red-400">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-white">Sign-in failed</h2>
          <p className="text-gray-400 text-sm">{error}</p>
          <Button onClick={() => navigate('/', { replace: true })} className="w-full">
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  return <LoadingScreen text="Signing you in..." />
}
