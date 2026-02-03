import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { GoogleSignInButton } from '../components/auth'
import { useAuthStore } from '../store/authStore'

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
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="relative">
            {/* Gear icon with clock inside */}
            <svg className="w-12 h-12 text-primary-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z" />
            </svg>
            {/* Clock overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-5 h-5 text-navy-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="6" />
                <path d="M12 9v3l2 1" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Brand name */}
        <h1 className="text-3xl font-bold text-white mb-2">
          <span className="text-primary-500">Geared</span>
          <span className="text-gray-400 text-2xl">to</span>
          <span className="text-secondary-500">Track</span>
        </h1>
        <p className="text-gray-400 text-lg">Track cycling gear ratios & lap times</p>
      </header>

      {/* Features */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto space-y-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-navy-800 rounded-xl p-4 border border-navy-700 flex gap-4"
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
        </div>
      </footer>
    </div>
  )
}
