import { useState } from 'react'
import { Input, Button } from '../common'
import { useAuthStore } from '../../store/authStore'

interface ProfileStepProps {
  onNext: () => void
}

export function ProfileStep({ onNext }: ProfileStepProps) {
  const { user, profile, updateProfile } = useAuthStore()
  const [name, setName] = useState(profile?.name || user?.user_metadata?.full_name || '')
  const [age, setAge] = useState<string>(profile?.age?.toString() || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Please enter your name')
      return
    }

    setIsLoading(true)
    try {
      await updateProfile({
        name: name.trim(),
        age: age ? parseInt(age, 10) : null,
      })
      onNext()
    } catch (err) {
      setError('Failed to save profile. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col">
      {/* Progress indicator */}
      <div className="pt-8 px-6">
        <div className="flex gap-2 max-w-md mx-auto">
          <div className="flex-1 h-1 bg-primary-500 rounded-full" />
          <div className="flex-1 h-1 bg-navy-700 rounded-full" />
        </div>
        <p className="text-center text-gray-400 text-sm mt-3">Step 1 of 2</p>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to GearedtoTrack</h1>
          <p className="text-gray-400 mb-8">Let's set up your profile</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />

            <Input
              label="Email"
              value={user?.email || ''}
              disabled
              hint="From your Google account"
            />

            <Input
              label="Age (optional)"
              type="number"
              min="10"
              max="100"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              hint="Used for anonymized community statistics"
            />

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              Continue
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
