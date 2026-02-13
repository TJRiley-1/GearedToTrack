import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { GoogleSignInButton } from '../components/auth'
import { useAuthStore } from '../store/authStore'
import { APP_VERSION } from '../version'

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Gear Ratios',
    description: 'Calculate and compare gear ratios, gear inches, and development for your track bike',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Lap Times',
    description: 'Track your lap times across different events and analyze your performance',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Progress Tracking',
    description: 'Monitor your improvement with session history and gear combinations',
  },
]

export function Landing() {
  const navigate = useNavigate()
  const { user, profile, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading && user) {
      if (profile?.onboarding_completed) {
        navigate('/home', { replace: true })
      } else {
        navigate('/onboarding', { replace: true })
      }
    }
  }, [user, profile, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col">
      {/* Header */}
      <header className="pt-12 pb-8 px-6 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center mb-4">
          <img
            src="/images/logo-horizontal.png"
            alt="Geared to Track"
            className="h-24 w-auto"
          />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Your Track Cycling Companion</h1>
        <p className="text-gray-400 text-lg">Calculate gear ratios, track lap times, and monitor your progress</p>
      </header>

      {/* Features */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto space-y-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-navy-800 rounded-xl p-4 border border-navy-700 flex gap-4 hover:border-primary-500/30 transition-colors"
            >
              <div className="text-primary-500 flex-shrink-0">{feature.icon}</div>
              <div>
                <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Sign in */}
      <footer className="px-6 pb-8 pt-4">
        <div className="max-w-md mx-auto">
          <GoogleSignInButton />
          <p className="text-center text-gray-500 text-xs mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
          <p className="text-center text-gray-600 text-xs mt-2">v{APP_VERSION}</p>
        </div>
      </footer>
    </div>
  )
}
