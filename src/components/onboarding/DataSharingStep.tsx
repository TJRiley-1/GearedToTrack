import { useState } from 'react'
import { Toggle, Button, Card } from '../common'
import { useAuthStore } from '../../store/authStore'

interface DataSharingStepProps {
  onComplete: () => void
  onBack: () => void
}

export function DataSharingStep({ onComplete, onBack }: DataSharingStepProps) {
  const { profile, updateProfile } = useAuthStore()
  const [shareEnabled, setShareEnabled] = useState(profile?.share_data_enabled || false)
  const [shareAge, setShareAge] = useState(profile?.share_age || false)
  const [shareLapTimes, setShareLapTimes] = useState(profile?.share_lap_times || false)
  const [shareGearRatios, setShareGearRatios] = useState(profile?.share_gear_ratios || false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setError('')
    setIsLoading(true)

    try {
      await updateProfile({
        share_data_enabled: shareEnabled,
        share_age: shareEnabled && shareAge,
        share_lap_times: shareEnabled && shareLapTimes,
        share_gear_ratios: shareEnabled && shareGearRatios,
        onboarding_completed: true,
      })
      onComplete()
    } catch (err) {
      setError('Failed to save preferences. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMasterToggle = (enabled: boolean) => {
    setShareEnabled(enabled)
    if (!enabled) {
      setShareAge(false)
      setShareLapTimes(false)
      setShareGearRatios(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col">
      {/* Progress indicator */}
      <div className="pt-8 px-6">
        <div className="flex gap-2 max-w-md mx-auto">
          <div className="flex-1 h-1 bg-primary-500 rounded-full" />
          <div className="flex-1 h-1 bg-primary-500 rounded-full" />
        </div>
        <p className="text-center text-gray-400 text-sm mt-3">Step 2 of 2</p>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-white mb-2">Data Sharing</h1>
          <p className="text-gray-400 mb-8">
            Help improve the cycling community by sharing anonymized data
          </p>

          <Card className="space-y-6">
            <Toggle
              label="Enable Data Sharing"
              description="Allow your anonymized data to contribute to community insights"
              checked={shareEnabled}
              onChange={(e) => handleMasterToggle(e.target.checked)}
            />

            {shareEnabled && (
              <div className="space-y-4 pl-4 border-l-2 border-navy-600">
                <Toggle
                  label="Share Age"
                  description="Include your age in statistics"
                  checked={shareAge}
                  onChange={(e) => setShareAge(e.target.checked)}
                />
                <Toggle
                  label="Share Lap Times"
                  description="Contribute lap times to performance benchmarks"
                  checked={shareLapTimes}
                  onChange={(e) => setShareLapTimes(e.target.checked)}
                />
                <Toggle
                  label="Share Gear Ratios"
                  description="Help others find popular gear combinations"
                  checked={shareGearRatios}
                  onChange={(e) => setShareGearRatios(e.target.checked)}
                />
              </div>
            )}
          </Card>

          <p className="text-gray-500 text-sm mt-4">
            Your data is always anonymized and never includes personal information.
            You can change these settings anytime in your profile.
          </p>

          {error && (
            <p className="text-red-400 text-sm mt-4">{error}</p>
          )}

          <div className="flex gap-3 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              isLoading={isLoading}
              className="flex-1"
            >
              Get Started
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
