import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { LoadingScreen } from '../components/common'
import { Button } from '../components/common'

export function AuthCallback() {
  const navigate = useNavigate()
  const { setUser, setSession, fetchProfile } = useAuthStore()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // For PKCE flow: extract code from URL and exchange for session
        const url = new URL(window.location.href)
        const code = url.searchParams.get('code')

        let session

        if (code) {
          // PKCE flow — exchange the code for a session
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          if (exchangeError) throw exchangeError
          session = data.session
        } else {
          // Implicit flow fallback — tokens may be in the hash fragment
          const { data: { session: existingSession }, error: sessionError } = await supabase.auth.getSession()
          if (sessionError) throw sessionError
          session = existingSession
        }

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
          setError('No session received. Please try signing in again.')
        }
      } catch (err) {
        console.error('Auth callback error:', err)
        const message = err instanceof Error ? err.message : 'An unknown error occurred'
        setError(message)
      }
    }

    handleCallback()
  }, [navigate, setUser, setSession, fetchProfile])

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
