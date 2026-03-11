import { useState } from 'react'
import { Modal, Input, Button } from '../common'
import { useAddChainring, useChainrings } from '../../hooks'
import { useToastStore } from '../../store/toastStore'

interface AddChainringModalProps {
  isOpen: boolean
  onClose: () => void
}

const COMMON_TEETH = [44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58]

export function AddChainringModal({ isOpen, onClose }: AddChainringModalProps) {
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [customTeeth, setCustomTeeth] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const { data: existing } = useChainrings()
  const addChainring = useAddChainring()
  const addToast = useToastStore((s) => s.addToast)

  const existingTeeth = new Set((existing || []).map((c) => c.teeth))

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
    if (!num || num < 30 || num > 70) {
      setError('Enter a valid tooth count (30-70)')
      return
    }
    setSelected(new Set([...selected, num]))
    setCustomTeeth('')
    setError('')
  }

  const handleSubmit = async () => {
    if (selected.size === 0) {
      setError('Select at least one chainring')
      return
    }

    setError('')
    setIsSaving(true)

    try {
      const toAdd = [...selected].filter((t) => !existingTeeth.has(t))
      for (const teeth of toAdd) {
        await addChainring.mutateAsync({ teeth })
      }
      const count = toAdd.length
      addToast(`${count} chainring${count !== 1 ? 's' : ''} added`)
      handleClose()
    } catch (err) {
      setError('Failed to add chainrings. Please try again.')
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
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Chainrings">
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
                      ? 'bg-primary-500 text-white'
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
            min="30"
            max="70"
            value={customTeeth}
            onChange={(e) => setCustomTeeth(e.target.value)}
            placeholder="e.g., 59"
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
            Add {newCount > 0 ? `${newCount} Chainring${newCount !== 1 ? 's' : ''}` : 'Chainrings'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
