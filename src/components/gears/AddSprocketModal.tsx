import { useState } from 'react'
import { Modal, Input, Button } from '../common'
import { useAddSprocket, useSprockets } from '../../hooks'
import { useToastStore } from '../../store/toastStore'

interface AddSprocketModalProps {
  isOpen: boolean
  onClose: () => void
}

const COMMON_TEETH = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21]

export function AddSprocketModal({ isOpen, onClose }: AddSprocketModalProps) {
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [customTeeth, setCustomTeeth] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const { data: existing } = useSprockets()
  const addSprocket = useAddSprocket()
  const addToast = useToastStore((s) => s.addToast)

  const existingTeeth = new Set((existing || []).map((s) => s.teeth))

  const toggleTooth = (t: number) => {
    const next = new Set(selected)
    if (next.has(t)) {
      next.delete(t)
    } else {
      next.add(t)
    }
    setSelected(next)
  }

  const addCustom = () => {
    const num = parseInt(customTeeth, 10)
    if (!num || num < 10 || num > 25) {
      setError('Enter a valid tooth count (10-25)')
      return
    }
    setSelected(new Set([...selected, num]))
    setCustomTeeth('')
    setError('')
  }

  const handleSubmit = async () => {
    if (selected.size === 0) {
      setError('Select at least one sprocket')
      return
    }

    setError('')
    setIsSaving(true)

    try {
      const toAdd = [...selected].filter((t) => !existingTeeth.has(t))
      for (const teeth of toAdd) {
        await addSprocket.mutateAsync({ teeth })
      }
      const count = toAdd.length
      addToast(`${count} sprocket${count !== 1 ? 's' : ''} added`)
      handleClose()
    } catch (err) {
      setError('Failed to add sprockets. Please try again.')
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleClose = () => {
    setSelected(new Set())
    setCustomTeeth('')
    setError('')
    onClose()
  }

  const newCount = [...selected].filter((t) => !existingTeeth.has(t)).length

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Sprockets">
      <div className="space-y-4">
        <p className="text-gray-400 text-sm">Tap to select tooth counts. Brand and purchase date can be added later.</p>

        <div className="grid grid-cols-5 gap-2">
          {COMMON_TEETH.map((t) => {
            const isSelected = selected.has(t)
            const isExisting = existingTeeth.has(t)
            return (
              <button
                key={t}
                type="button"
                onClick={() => !isExisting && toggleTooth(t)}
                disabled={isExisting}
                className={`
                  py-2 rounded-lg text-sm font-medium transition-colors
                  ${isExisting
                    ? 'bg-navy-700 text-gray-600 cursor-not-allowed'
                    : isSelected
                      ? 'bg-secondary-500 text-white'
                      : 'bg-navy-700 text-gray-300 hover:bg-navy-600'
                  }
                `}
              >
                {t}T
              </button>
            )
          })}
        </div>

        <div className="flex gap-2">
          <Input
            label="Custom"
            type="number"
            min="10"
            max="25"
            value={customTeeth}
            onChange={(e) => setCustomTeeth(e.target.value)}
            placeholder="e.g., 11"
          />
          <div className="flex items-end">
            <Button type="button" variant="outline" onClick={addCustom} className="mb-px">
              +
            </Button>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            isLoading={isSaving}
            className="flex-1"
            disabled={newCount === 0}
          >
            Add {newCount > 0 ? `${newCount} Sprocket${newCount !== 1 ? 's' : ''}` : 'Sprockets'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
