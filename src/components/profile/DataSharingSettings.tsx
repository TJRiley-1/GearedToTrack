import { useState, useEffect } from 'react'
import { Card, Toggle } from '../common'
import { useAuthStore } from '../../store/authStore'

export function DataSharingSettings() {
  const { profile, updateProfile } = useAuthStore()
  const [shareEnabled, setShareEnabled] = useState(profile?.share_data_enabled || false)
  const [shareAge, setShareAge] = useState(profile?.share_age || false)
  const [shareLapTimes, setShareLapTimes] = useState(profile?.share_lap_times || false)
  const [shareGearRatios, setShareGearRatios] = useState(profile?.share_gear_ratios || false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (profile) {
      setShareEnabled(profile.share_data_enabled)
      setShareAge(profile.share_age)
      setShareLapTimes(profile.share_lap_times)
      setShareGearRatios(profile.share_gear_ratios)
    }
  }, [profile])

  const handleToggle = async (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    field: 'share_data_enabled' | 'share_age' | 'share_lap_times' | 'share_gear_ratios',
    value: boolean
  ) => {
    setter(value)
    setIsSaving(true)

    const updates: Record<string, boolean> = { [field]: value }

    // If disabling master toggle, disable all sub-options
    if (field === 'share_data_enabled' && !value) {
      setShareAge(false)
      setShareLapTimes(false)
      setShareGearRatios(false)
      updates.share_age = false
      updates.share_lap_times = false
      updates.share_gear_ratios = false
    }

    try {
      await updateProfile(updates)
    } catch (err) {
      // Revert on error
      setter(!value)
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className={isSaving ? 'opacity-70' : ''}>
      <h3 className="text-lg font-semibold text-white mb-4">Data Sharing</h3>
      <div className="space-y-4">
        <Toggle
          label="Enable Data Sharing"
          description="Allow your anonymized data to contribute to community insights"
          checked={shareEnabled}
          onChange={(e) => handleToggle(setShareEnabled, 'share_data_enabled', e.target.checked)}
        />

        {shareEnabled && (
          <div className="space-y-4 pl-4 border-l-2 border-navy-600 ml-2">
            <Toggle
              label="Share Age"
              description="Include your age in statistics"
              checked={shareAge}
              onChange={(e) => handleToggle(setShareAge, 'share_age', e.target.checked)}
            />
            <Toggle
              label="Share Lap Times"
              description="Contribute lap times to performance benchmarks"
              checked={shareLapTimes}
              onChange={(e) => handleToggle(setShareLapTimes, 'share_lap_times', e.target.checked)}
            />
            <Toggle
              label="Share Gear Ratios"
              description="Help others find popular gear combinations"
              checked={shareGearRatios}
              onChange={(e) => handleToggle(setShareGearRatios, 'share_gear_ratios', e.target.checked)}
            />
          </div>
        )}
      </div>
    </Card>
  )
}
