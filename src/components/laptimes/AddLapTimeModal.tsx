import { useState } from 'react'
import { Modal, Input, Select, Button } from '../common'
import { useAddLapSession, useChainrings, useSprockets } from '../../hooks'
import { useAuthStore } from '../../store/authStore'
import { parseTime } from '../../lib/calculations'
import { EVENT_TYPES } from '../../types'

interface AddLapTimeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddLapTimeModal({ isOpen, onClose }: AddLapTimeModalProps) {
  const { profile } = useAuthStore()
  const { data: chainrings } = useChainrings()
  const { data: sprockets } = useSprockets()
  const addLapSession = useAddLapSession()

  const [eventType, setEventType] = useState('')
  const [trackName, setTrackName] = useState('')
  const [trackLength, setTrackLength] = useState(profile?.default_track_length?.toString() || '250')
  const [chainringId, setChainringId] = useState('')
  const [sprocketId, setSprocketId] = useState('')
  const [lapTimesInput, setLapTimesInput] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!eventType) {
      setError('Please select an event type')
      return
    }

    // Parse lap times
    const lapTimeStrings = lapTimesInput
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    const lapTimes: number[] = []
    for (const timeStr of lapTimeStrings) {
      const ms = parseTime(timeStr)
      if (ms === null) {
        setError(`Invalid time format: "${timeStr}". Use SS.mmm or M:SS.mmm`)
        return
      }
      lapTimes.push(ms)
    }

    try {
      await addLapSession.mutateAsync({
        session: {
          event_type: eventType,
          track_name: trackName.trim() || null,
          track_length: parseInt(trackLength, 10) || 250,
          chainring_id: chainringId || null,
          sprocket_id: sprocketId || null,
          notes: notes.trim() || null,
        },
        lapTimes,
      })
      handleClose()
    } catch (err) {
      setError('Failed to save session. Please try again.')
      console.error(err)
    }
  }

  const handleClose = () => {
    setEventType('')
    setTrackName('')
    setTrackLength(profile?.default_track_length?.toString() || '250')
    setChainringId('')
    setSprocketId('')
    setLapTimesInput('')
    setNotes('')
    setError('')
    onClose()
  }

  const eventOptions = EVENT_TYPES.map((type) => ({
    value: type,
    label: type,
  }))

  const chainringOptions = (chainrings || []).map((c) => ({
    value: c.id,
    label: `${c.teeth}T${c.brand ? ` (${c.brand})` : ''}`,
  }))

  const sprocketOptions = (sprockets || []).map((s) => ({
    value: s.id,
    label: `${s.teeth}T${s.brand ? ` (${s.brand})` : ''}`,
  }))

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Lap Session" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Event Type"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          options={eventOptions}
          placeholder="Select event type..."
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Track Name"
            value={trackName}
            onChange={(e) => setTrackName(e.target.value)}
            placeholder="e.g., Manchester"
          />
          <Input
            label="Track Length (m)"
            type="number"
            min="200"
            max="500"
            value={trackLength}
            onChange={(e) => setTrackLength(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Chainring"
            value={chainringId}
            onChange={(e) => setChainringId(e.target.value)}
            options={chainringOptions}
            placeholder="Select..."
          />
          <Select
            label="Sprocket"
            value={sprocketId}
            onChange={(e) => setSprocketId(e.target.value)}
            options={sprocketOptions}
            placeholder="Select..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Lap Times
          </label>
          <textarea
            value={lapTimesInput}
            onChange={(e) => setLapTimesInput(e.target.value)}
            placeholder="Enter times separated by new lines or commas&#10;e.g., 12.345 or 1:23.456"
            rows={4}
            className="w-full bg-navy-700 border border-navy-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
          />
          <p className="mt-1 text-gray-500 text-xs">
            Format: SS.mmm or M:SS.mmm (e.g., 12.345 or 1:23.456)
          </p>
        </div>

        <Input
          label="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any notes about this session..."
        />

        <div className="p-3 bg-navy-700 rounded-lg border border-navy-600">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Import from Strava (Coming Soon)</span>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" isLoading={addLapSession.isPending} className="flex-1">
            Save Session
          </Button>
        </div>
      </form>
    </Modal>
  )
}
