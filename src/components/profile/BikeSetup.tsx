import { useState } from 'react'
import { Card, Input, Button } from '../common'
import { useAuthStore } from '../../store/authStore'

export function BikeSetup() {
  const { profile, updateProfile } = useAuthStore()
  const [trackLength, setTrackLength] = useState(profile?.default_track_length?.toString() || '250')
  const [wheelDiameter, setWheelDiameter] = useState(profile?.wheel_diameter?.toString() || '668')
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    setSaved(false)
    try {
      await updateProfile({
        default_track_length: parseInt(trackLength, 10) || 250,
        wheel_diameter: parseInt(wheelDiameter, 10) || 668,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  const hasChanges =
    trackLength !== (profile?.default_track_length?.toString() || '250') ||
    wheelDiameter !== (profile?.wheel_diameter?.toString() || '668')

  return (
    <Card>
      <h3 className="text-lg font-semibold text-white mb-4">Bike Setup</h3>
      <div className="space-y-4">
        <Input
          label="Default Track Length (m)"
          type="number"
          min="200"
          max="500"
          value={trackLength}
          onChange={(e) => setTrackLength(e.target.value)}
          hint="Common: 250m (Olympic), 333m"
        />

        <Input
          label="Wheel Diameter (mm)"
          type="number"
          min="600"
          max="750"
          value={wheelDiameter}
          onChange={(e) => setWheelDiameter(e.target.value)}
          hint="Common: 668mm (700c with 23mm tire)"
        />

        <div className="flex items-center gap-3">
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            isLoading={isSaving}
            size="sm"
          >
            Save Changes
          </Button>
          {saved && (
            <span className="text-secondary-500 text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Saved
            </span>
          )}
        </div>
      </div>
    </Card>
  )
}
